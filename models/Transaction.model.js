import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    payee: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", TransactionSchema);
