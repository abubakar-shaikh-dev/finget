import Transaction from "../models/Transaction.model.js";

export const create = async (req, res) => {
  try {
    const { date, account, category, payee, amount, notes } = req.body;

    const transaction = new Transaction({
      date,
      account,
      category,
      payee,
      amount,
      notes,
      user: req.userId,
    });

    await transaction.save();

    return res.status(201).json({
      status: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: error.message });
  }
};

export const get = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.userId,
      isDeleted: false,
    });

    return res.status(200).json({
      status: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { date, account, category, payee, amount, notes } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    transaction.date = date;
    transaction.account = account;
    transaction.category = category;
    transaction.payee = payee;
    transaction.amount = amount;
    transaction.notes = notes;

    await transaction.save();

    return res.status(200).json({
      status: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    transaction.isDeleted = true;

    await transaction.save();

    return res.status(200).json({
      status: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
