const { Schema, model } = require("mongoose");

const collectionSchema = new Schema(
  {
    fullName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      lowercase: true,
      default: null,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    countryCode: {
      type: Number,
      default: 1,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
      enum: ["Male", "Female", "Other"],
    },
    address1: {
      type: String,
      default: null,
    },
    address2: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    zipCode: {
      type: Number,
      default: null,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    documentType: {
      type: String,
      enum: ["Passport", "Driving Licence", "ID Card"],
    },
    document: {
      front: {
        type: String,
        default: null,
      },
      back: {
        type: String,
        default: null,
      },
    },
    verifyByAdmin: {
      type: Boolean,
      default: false,
    },
    token: {
      type: {
        type: String,
        enum: ["Access", "Denied"],
      },
      accessToken: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
    },
    forgotPassword: {
      createdAt: {
        type: Date,
        default: null,
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("user", collectionSchema);
