const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // Optional profile fields
  college: String,
  company: String,
  role: String,
  employmentType: String,
  stipend: Number,
  ctc: Number,
  city: String
});

module.exports = mongoose.model("User", userSchema);
