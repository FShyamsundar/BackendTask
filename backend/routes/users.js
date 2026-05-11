const express = require("express");
const { param, validationResult } = require("express-validator");
const User = require("../models/User");
const Note = require("../models/Note");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", async (req, res, next) => {
  try {
    const [users, noteCounts] = await Promise.all([
      User.find({}, "-password").sort({ createdAt: -1 }),
      Note.aggregate([{ $group: { _id: "$owner", count: { $sum: 1 } } }]),
    ]);

    const noteCountMap = new Map(noteCounts.map((item) => [String(item._id), item.count]));

    const usersWithCounts = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      noteCount: noteCountMap.get(String(user._id)) || 0,
    }));

    res.json({ users: usersWithCounts });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id/notes",
  [param("id").isMongoId().withMessage("Valid user id is required")],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      const notes = await Note.find({ owner: user._id })
        .sort({ createdAt: -1 })
        .populate("owner", "name email role");

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        notes,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Valid user id is required")],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      if (req.user._id.equals(req.params.id)) {
        return res.status(400).json({ message: "Admin users cannot delete themselves" });
      }

      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await Note.deleteMany({ owner: user._id });
      await User.deleteOne({ _id: user._id });

      res.json({ message: "User and associated notes deleted" });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
