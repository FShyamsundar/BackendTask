require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");
const userRoutes = require("./routes/users");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME || "Admin User",
  email: (process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com").toLowerCase(),
  password: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
};

const ensureDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log(`Updated default admin role for ${DEFAULT_ADMIN.email}`);
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 12);

  await User.create({
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Default admin created: ${DEFAULT_ADMIN.email}`);
};

connectDB()
  .then(async () => {
    await ensureDefaultAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
