import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["CASH", "BANK"],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", AccountSchema);

export default Account;
