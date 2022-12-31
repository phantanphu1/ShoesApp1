const express = require("express");
const route = express.Router();
const app = express();
//CORS middleware
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
};

const CommentController=require("../controllers/comments");
const { commentValidation } = require("../helpers/commentValidation");
route.post("/comments/create",commentValidation,CommentController.addCommentProduct);
route.delete("/comment/deleteCommentById/:commentId", CommentController.deleteCommentById);
route.get("/comment/getAllCommentById/:commentId", CommentController.getCommentById);

route.get("/comment/getCommentByUserId/:userId", CommentController.getCommentByUserId);
route.get("/comments/getAllComments", CommentController.getAllComment);
route.patch("/comment/updateCommentById/:commentId", CommentController.updateCommentById);
app.use(allowCrossDomain);



module.exports = route;
