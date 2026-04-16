const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

  type: {
    type: String,
    required: true,
    enum: ["income", "expense"]
  },

  category: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Transaction", transactionSchema);
