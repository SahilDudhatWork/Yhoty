const { Schema, model } = require("mongoose");

const countrySchema = new Schema(
  {
    countryName: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    isoCode: {
      type: String,
      required: true,
    },
    usaRate: {
      type: Number,
      required: true,
    },
    franceRate: {
      type: Number,
      required: true,
    },
    ukRate: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("country", countrySchema);
