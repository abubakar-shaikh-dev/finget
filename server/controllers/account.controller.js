import Account from "../models/Account.model.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const createAccount = async (req, res) => {
  try {
    const { name, type, balance } = req.body;

    const newAccount = await new Account({
      name,
      type,
      balance,
      user: req.userId,
    });

    await newAccount.save();

    return res.status(201).json({
      status: true,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({
      user: new ObjectId(req.userId),
      isDeleted: false,
    });

    return res.status(200).json({
      status: true,
      message: "Accounts fetched successfully",
      data: accounts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: account,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    const { name, type, balance } = req.body;

    account.name = name;
    account.type = type;
    account.balance = balance;

    await account.save();

    return res.status(200).json({
      status: true,
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!account) {
      return res.status(404).json({
        status: false,
        message: "Account not found",
      });
    }

    account.isDeleted = true;

    await account.save();

    return res.status(200).json({
      status: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
