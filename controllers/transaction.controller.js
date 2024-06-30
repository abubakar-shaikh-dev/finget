import Transaction from "../models/Transaction.model.js";
import Account from "../models/Account.model.js";
import Category from "../models/Category.model.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

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
    res.status(500).json({ status: false, message: error.message });
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
    res.status(500).json({ status: false, message: error.message });
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
    res.status(500).json({ status: false, message: error.message });
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
    res.status(500).json({ status: false, message: error.message });
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
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getInfoCards = async (req, res) => {
  try {
    const { account, fromDate, toDate } = req.query;

    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    // Calculate Remaining Balance
    const totalBalanceData = await Account.aggregate([
      {
        $match: {
          ...(account && { _id: new ObjectId(account) }),
          user: new ObjectId(req.userId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$balance" },
        },
      },
    ]);

    totalBalance =
      totalBalanceData.length > 0 ? totalBalanceData[0].totalBalance : 0;

    // calculate total income
    const totalIncomeData = await Transaction.aggregate([
      {
        $match: {
          ...(account && { account: new ObjectId(account) }),
          user: new ObjectId(req.userId),
          isDeleted: false,
          date: {
            ...(fromDate && { $gte: new Date(fromDate) }),
            ...(toDate && { $lte: new Date(toDate) }),
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          "category.type": "INCOME",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    totalIncome =
      totalIncomeData.length > 0 ? totalIncomeData[0].totalIncome : 0;

    // calculate total expense
    const totalExpenseData = await Transaction.aggregate([
      {
        $match: {
          ...(account && { account: new ObjectId(account) }),
          user: new ObjectId(req.userId),
          isDeleted: false,
          date: {
            ...(fromDate && { $gte: new Date(fromDate) }),
            ...(toDate && { $lte: new Date(toDate) }),
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          "category.type": "EXPENSE",
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    totalExpense =
      totalExpenseData.length > 0 ? totalExpenseData[0].totalExpense : 0;

    return res.status(200).json({
      status: true,
      message: "Info cards fetched successfully",
      data: {
        remaining: totalBalance,
        income: totalIncome,
        expense: totalExpense,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getAreaChartData = async (req, res) => {
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

    const data = await Transaction.find(filters).populate("account category");
    // Aggregate transactions with the same timestamp
    const aggregatedData = {};

    data.forEach((record) => {
      const date = new Date(record.date).getTime();
      const key = date.toString();
      if (!aggregatedData[key]) {
        aggregatedData[key] = { date, income: 0, expense: 0 };
      }
      if (record.category.type === "INCOME") {
        aggregatedData[key].income += record.amount;
      } else if (record.category.type === "EXPENSE") {
        aggregatedData[key].expense += record.amount;
      }
    });

    // Convert aggregated data to arrays for income and expense
    const incomeData = Object.values(aggregatedData).map((item) => [
      item.date,
      item.income,
    ]);
    const expenseData = Object.values(aggregatedData).map((item) => [
      item.date,
      item.expense,
    ]);

    // Sort incomeData and expenseData by date
    incomeData.sort((a, b) => a[0] - b[0]);
    expenseData.sort((a, b) => a[0] - b[0]);

    return res.status(200).json({
      status: true,
      message: "Transactions fetched successfully",
      data: { income: incomeData, expense: expenseData },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};
