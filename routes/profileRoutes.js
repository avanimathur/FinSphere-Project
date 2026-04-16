const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* GET PROFILE */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select("-password");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* CREATE / UPDATE PROFILE */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const profile = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Profile save failed" });
  }
});

/* DELETE PROFILE */
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
