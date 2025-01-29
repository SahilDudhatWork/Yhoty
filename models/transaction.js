const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;

const transactionSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    cardId: {
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
    description: {
      type: String,
      default: "Fund Transfer",
    },
    balance: {
      type: Number,
      default: null,
    },
    refTransId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["credit", "debit"],
    },
  },
  { timestamps: true }
);

module.exports = model("transaction", transactionSchema);
