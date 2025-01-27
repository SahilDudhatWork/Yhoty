const { Schema, model } = require("mongoose");

const collectionSchema = new Schema(
  {
    banners: [
      {
        image: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("banners", collectionSchema);
