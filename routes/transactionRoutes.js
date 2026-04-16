const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const authMiddleware = require("../middleware/authMiddleware");


/* ADD TRANSACTION */
router.post("/", authMiddleware, async (req, res) => {

  try {

    const transaction = new Transaction({
      ...req.body,
      userId: req.user.id   // FIX: link transaction to the logged-in user
    });

    await transaction.save();

    res.status(201).json(transaction);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* GET ALL TRANSACTIONS — only for logged-in user */
router.get("/", authMiddleware, async (req, res) => {

  try {

    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });  // FIX: filter by userId

    res.json(transactions);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* DELETE TRANSACTION */
router.delete("/:id", authMiddleware, async (req, res) => {

  await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });  // FIX: only delete own transactions

  res.json({ message: "Deleted" });

});



module.exports = router;
