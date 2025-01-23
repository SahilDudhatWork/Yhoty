const { Schema, model, Types } = require("mongoose");
const { ObjectId } = Types;

const collectionSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    apiUserName: {
      type: String,
      default: null,
    },
    apiPassword: {
      type: String,
      default: null,
    },
    walletId: {
      type: String,
      default: null,
    },
    cardIssuerBinId: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    adrLine1: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    custom: {
      c1: {
        type: String,
        default: null,
      },
      c2: {
        type: String,
        default: null,
      },
      c3: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ["Active", "Deactive", "Deleted"],
    },
    statusId: {
      type: String,
      default: null,
    },
    cardNumber: {
      type: String,
      default: null,
    },
    cardExpMonth: {
      type: String,
      default: null,
    },
    cardExpYear: {
      type: String,
      default: null,
    },
    cardCvv: {
      type: String,
      default: null,
    },
    cardToken: {
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

module.exports = model("card", collectionSchema);
