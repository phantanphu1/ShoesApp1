const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historysSchema = new Schema(
  {
    productId: {
      type: String,
      require: true,
    },
    productName: {
      type: String,
      require: true,
    },
    productBrand: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    discount: {
        type: Number,
        require: true,
      },
    type: {
      type: String,
      require: true,
    },
    images: {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    orderStatus: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);
const Historys = mongoose.model("Historys", historysSchema);
module.exports = Historys;
