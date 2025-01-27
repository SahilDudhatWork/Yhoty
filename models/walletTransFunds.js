const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;

const collectionSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    walletIdFrom: {
      type: String,
      default: null,
    },
    walletIdTo: {
      type: String,
      default: null,
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
    statusId: {
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

module.exports = model("walletTransFunds", collectionSchema);
