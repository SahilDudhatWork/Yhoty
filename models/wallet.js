const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;

const collectionSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    parentWalletId: {
      type: String,
      default: null,
    },
    walletName: {
      type: String,
      default: null,
    },
    walletId: {
      type: String,
      default: null,
    },
    statusId: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("wallet", collectionSchema);
