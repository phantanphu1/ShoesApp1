const Comments = require("../models/comments");
const Products = require("../models/products");
const Users = require("../models/users");
const { errorFunction } = require("../utils/errorFunction");
const addCommentProduct = async (req, res, next) => {
  try {
    const productId = await Products.findById(req.body.productId);
    const userId = await Users.findById(req.body.userId);
    if (!productId) {
      return res.json(
        errorFunction(true, 204, "This product Id have not in the database")
      );
    }
    if (!userId) {
      return res.json(
        errorFunction(true, 204, "This user Id have not in the database")
      );
    }
    const newComment = await Comments.create(req.body);

    if (newComment) {
      return res
        .status(201)
        .json(errorFunction(false, 201, "Comment Created", newComment));
    } else {
      return res.status(403).json(errorFunction(true, "Error Creating Comment"));
    }
  } catch (error) {
    console.log("ERRORS:", error);
    return res.status(403).json(errorFunction(true, "Error Creating Comment"));
  }
};

const getCommentByUserId = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const filter = {
      $and: [
        {
          userId: {
            $regex: userId,
            $options: '$i',
          },
        },
      ],
    }
    const comments = await Comments.find(filter)
    if (comments) {
      res.status(200).json({
        statusCode: 200,
        total: comments.length,
        comments: comments.reverse(),
      })
    } else {
      res.json({
        statusCode: 204,
        message: 'This order Id have not in the database',
        order: {},
      })
    }
  } catch (error) {
    res.status(400)
    return res.json(errorFunction(true, 400, 'Bad request'))
  }
}


const deleteCommentById = async (req, res, next) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comments.findByIdAndRemove(commentId);
    if (comment) {
      res.status(200).json({
        statuscode: 200,
        message: "Delete comment successfully",
      });
    } else {
      res.json({
        statuscode: 204,
        message: "this comment Id is have not in the database",
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};

const getAllComment = async (req, res, next) => {
    try {
      const allComments = await Comments.find();
      if (Comments.length > 0) {
        res.status(200).json({
          Comments: allComments.reverse(),
        });
      } else {
        res.status(200).json({
          message: "no results",
          Comments: [],
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Bab request",
      });
    }
  };

  const getCommentById = async (req, res, next) => {
    const commentId = req.params.commentId;
    try {
      const comment = await Comments.findById(commentId);
      if (comment) {
        res.status(200).json({
          statusCode: 200,
          comment,
        });
      } else {
        res.json({
          statusCode: 204,
          massage: "This  carts Id have not in the database",
          comments: {},
        });
      }
    } catch (error) {
      console.log("error", error);
      res.status(400).json({
        message: "Bad request",
      });
    }
  };

const updateCommentById = (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const isBodyEmpTy = Object.keys(req.body).length;
    if (isBodyEmpTy === 0) {
      return res.send({
        statuscode: 403,
        message: "Body request can not emty.",
      });
    }
    Comments.findByIdAndUpdate(commentId, req.body).then((data) => {
      if (data) {
        res.status(200).json({
          statuscode: 200,
          message: "Update comment successfully",
        });
      } else {
        res.json({
          statuscode: 204,
          message: "This comment Id is have not in the database ",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};
module.exports = {
  addCommentProduct,
  deleteCommentById,
  getAllComment,
  updateCommentById,
  getCommentById,
  getCommentByUserId
};
