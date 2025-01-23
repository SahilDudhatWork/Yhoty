const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;

const transactionSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    walletIdFrom: {
      type: String,
      required: true,
    },
    walletIdTo: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: "Fund Transfer",
    },
    refTransId: {
      type: String,
      default: null,
    },
    statusId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: null,
      enum: ["credit", "debit"],
    },
  },
  { timestamps: true }
);

module.exports = model("transaction", transactionSchema);
