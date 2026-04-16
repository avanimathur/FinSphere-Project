const express = require("express");
const router = express.Router();

const Transaction = require("../models/transaction");


/* ADD TRANSACTION */
router.post("/", async (req, res) => {

  try {

    const transaction = new Transaction(req.body);

    await transaction.save();

    res.status(201).json(transaction);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* GET ALL TRANSACTIONS */
router.get("/", async (req, res) => {

  try {

    const transactions = await Transaction.find().sort({ date: -1 });

    res.json(transactions);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});
/* DELETE TRANSACTION */
router.delete("/:id", async (req, res) => {

  await Transaction.findByIdAndDelete(req.params.id);

  res.json({ message: "Deleted" });

});



module.exports = router;
