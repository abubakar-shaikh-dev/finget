import Transaction from "../models/Transaction.model.js";
import Account from "../models/Account.model.js";
import Category from "../models/Category.model.js";
import moment from "moment-timezone";

export const create = async (req, res) => {
  try {
    const { date, account, category, payee, amount, notes } = req.body;

    const categoryData = await Category.findOne({ _id: category });
    const categoryType = categoryData.type;

    //Check whether the account has enough balance
    if (categoryType === "EXPENSE") {
      const accountData = await Account.findOne({ _id: account });
      if (accountData.balance < amount) {
        return res.status(400).json({
          status: false,
          message: "Account does not have enough balance",
        });
      }
    } else {
      const accountData = await Account.findOne({ _id: account });
      accountData.balance = accountData.balance + amount;
      await accountData.save();
    }

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

    if (categoryType === "INCOME") {
      const accountData = await Account.findOne({ _id: account });
      accountData.balance = accountData.balance + amount;
      await accountData.save();
    } else {
      const accountData = await Account.findOne({ _id: account });
      accountData.balance = accountData.balance - amount;
      await accountData.save();
    }

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
    const { account, fromDate, toDate } = req.query;

    const filters = {
      user: req.userId,
      isDeleted: false,
    };

    if (account) {
      filters.account = account;
    }

    if (fromDate || toDate) {
      filters.date = {};
      if (fromDate) {
        filters.date.$gte = moment(fromDate).startOf("day").toDate();
      }
      if (toDate) {
        filters.date.$lte = moment(toDate).endOf("day").toDate();
      }
    }

    const transactions = await Transaction.find(filters).populate(
      "account category"
    );

    return res.status(200).json({
      status: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error(error);
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

    //Check whether the account has enough balance
    const categoryData = await Category.findOne({ _id: category });
    const categoryType = categoryData.type;

    if (categoryType === "EXPENSE") {
      const accountData = await Account.findOne({ _id: account });
      if (accountData.balance < amount) {
        return res.status(400).json({
          status: false,
          message: "Account does not have enough balance",
        });
      }
    }

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

    const oldAccount = transaction.account;
    const oldAmount = transaction.amount;
    const oldCategory = transaction.category;

    transaction.date = date;
    transaction.account = account;
    transaction.category = category;
    transaction.payee = payee;
    transaction.amount = amount;
    transaction.notes = notes;

    await transaction.save();

    // revert old account balance
    const oldAccountData = await Account.findOne({ _id: oldAccount });
    const oldCategoryData = await Category.findOne({ _id: oldCategory });

    if (oldCategoryData.type === "INCOME") {
      oldAccountData.balance =
        Number(oldAccountData.balance) - Number(oldAmount);
    } else {
      oldAccountData.balance =
        Number(oldAccountData.balance) + Number(oldAmount);
    }

    await oldAccountData.save();

    // update new account balance

    if (categoryType === "INCOME") {
      const accountData = await Account.findOne({ _id: account });
      accountData.balance = Number(accountData.balance) + Number(amount);
      await accountData.save();
    } else {
      const accountData = await Account.findOne({ _id: account });
      accountData.balance = Number(accountData.balance) - Number(amount);
      await accountData.save();
    }

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

    const categoryData = await Category.findOne({ _id: transaction.category });
    const categoryType = categoryData.type;

    if (categoryType === "INCOME") {
      const accountData = await Account.findOne({ _id: transaction.account });
      accountData.balance = accountData.balance - transaction.amount;
      await accountData.save();
    } else {
      const accountData = await Account.findOne({ _id: transaction.account });
      accountData.balance = accountData.balance + transaction.amount;
      await accountData.save();
    }

    return res.status(200).json({
      status: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
