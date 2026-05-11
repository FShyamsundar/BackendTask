const express = require("express");
const { body, validationResult, param } = require("express-validator");
const Note = require("../models/Note");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { owner: req.user._id };
    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .populate("owner", "name email role");
    res.json({ notes });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, content } = req.body;
      const note = await Note.create({ title, content, owner: req.user._id });
      await note.populate("owner", "name email role");
      res.status(201).json({ note });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Valid note id is required")],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const note = await Note.findById(req.params.id).populate("owner", "name email role");
      if (!note) return res.status(404).json({ message: "Note not found" });
      if (req.user.role !== "admin" && !note.owner._id.equals(req.user._id))
        return res.status(403).json({ message: "Forbidden" });
      res.json({ note });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Valid note id is required"),
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),
    body("content")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Content cannot be empty"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const note = await Note.findById(req.params.id);
      if (!note) return res.status(404).json({ message: "Note not found" });
      if (req.user.role !== "admin" && !note.owner.equals(req.user._id))
        return res.status(403).json({ message: "Forbidden" });

      note.title = req.body.title ?? note.title;
      note.content = req.body.content ?? note.content;
      await note.save();
      await note.populate("owner", "name email role");
      res.json({ note });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Valid note id is required")],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const note = await Note.findById(req.params.id);
      if (!note) return res.status(404).json({ message: "Note not found" });
      if (req.user.role !== "admin" && !note.owner.equals(req.user._id))
        return res.status(403).json({ message: "Forbidden" });

      await note.remove();
      res.json({ message: "Note deleted" });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
