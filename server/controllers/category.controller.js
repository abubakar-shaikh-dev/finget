import Category from "../models/Category.model.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import moment from "moment-timezone";

export const create = async (req, res) => {
  try {
    const { name, type } = req.body;

    const category = new Category({
      name,
      type,
      user: req.userId,
    });

    await category.save();

    return res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: error.message });
  }
};

export const get = async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.userId,
      isDeleted: false,
    }).sort({ type: 1 });

    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getDonutChartData = async (req, res) => {
  try {
    const { account, fromDate, toDate } = req.query;

    let values = [];
    let labels = [];

    const pipeline = [
      {
        $match: {
          isDeleted: false,
          user: new ObjectId(req.userId),
          type: "EXPENSE",
        },
      },
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "category",
          as: "transactions",
        },
      },
      {
        $unwind: "$transactions",
      },
      {
        $match: {
          "transactions.isDeleted": false,
          ...(account && {
            "transactions.account": new ObjectId(account),
          }),
          ...(fromDate && {
            "transactions.date": {
              $gte: new Date(moment(fromDate).startOf("day").toDate()),
            },
          }),
          ...(toDate && {
            "transactions.date": {
              $lte: new Date(moment(toDate).endOf("day").toDate()),
            },
          }),
        },
      },
      {
        $group: {
          _id: "$name",
          amount: { $sum: "$transactions.amount" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          amount: 1,
        },
      },
    ];

    const data = await Category.aggregate(pipeline);

    data.map((item) => {
      values.push(item.amount);
      labels.push(item.name);
    });

    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: {
        labels,
        values,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    category.name = req.body.name;
    category.type = req.body.type;

    await category.save();

    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!category) {
      return res.status(404).json({
        status: false,
        message: "Category not found",
      });
    }

    category.isDeleted = true;

    await category.save();

    return res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};
