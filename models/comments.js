const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    productId: {
      type: String,
      require: true,
    },
    content: {
        type: String,
        required: true,
      },
    productName: {
      type: String,
      require: true,
    },
    productBrand: {
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
  },
  { timestamps: true }
);
const Comments = mongoose.model("Comments", commentSchema);
module.exports = Comments;
