const Carts = require("../models/carts");
const Products = require("../models/products");
const Users = require("../models/users");
const { errorFunction } = require("../utils/errorFunction");
// CRUD
// CREATE - POST
const createCart = async (req, res, next) => {
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
    const newCart = await Carts.create(req.body);
    if (newCart) {
      return res
        .status(201)
        .json(errorFunction(false, 201, "Cart Created", newCart));
    } else {
      return res.status(403).json(errorFunction(true, "Error Creating Cart"));
    }
  } catch (error) {
    console.log("ERRORS:", error);
    return res.status(403).json(errorFunction(true, "Error Creating Cart"));
  }
};

const getAllCarts = async (req, res, next) => {
  try {
    const {
      pageSize = 12,
      pageNumber = 1,
      productName = "",
      productBrand = "",
      cartByColumn,
      cartByDirection = "desc",
    } = req.query;
    const filter = {
      $and: [
        {
          productName: {
            $regex: productName,
            $options: "$i",
          },
        },
        {
          productBrand: {
            $regex: productBrand,
            $options: "$i",
          },
        },
      ],
    };
    const filterCarts = await Carts.find(filter)
      .sort(`${cartByDirection === "asc" ? "" : "-"}${cartByColumn}`)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize);

    const allCarts = await Carts.find(filter);

    let totalPage = 0;
    if (allCarts.length % pageSize === 0) {
      totalPage = allCarts.length / pageSize;
    } else {
      totalPage = parseInt(allCarts.length / pageSize) + 1;
    }

    if (allCarts.length > 0) {
      res.status(200).json({
        totalPage: totalPage,
        totalCarts: allCarts.length,
        carts:
          cartByDirection && cartByColumn ? filterCarts : filterCarts.reverse(),
      });
    } else {
      res.status(200).json({
        message: "No results",
        carts: [],
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

//get by id
const getCartById = async (req, res, next) => {
  const cartId = req.params.cartId;
  try {
    const cart = await Carts.findById(cartId);
    if (cart) {
      res.status(200).json({
        statusCode: 200,
        cart,
      });
    } else {
      res.json({
        statusCode: 204,
        massage: "This  carts Id have not in the database",
        carts: {},
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

// get by user id
const getCartByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const filter = {
      $and: [
        {
          userId: {
            $regex: userId,
            $options: "$i",
          },
        },
      ],
    };
    const carts = await Carts.find(filter);
    if (carts) {
      res.status(200).json({
        statusCode: 200,
        total: carts.length,
        carts: carts.reverse(),
      });
    } else {
      res.json({
        statusCode: 204,
        message: "This cart Id have not in the database",
        carts: {},
      });
    }
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};
//delete product by id
const deleteCartById = async (req, res, next) => {
  const cartId = req.params.cartId;

  try {
    const cart = await Carts.findByIdAndRemove(cartId);
    if (cart) {
      res.status(200).json({
        statusCode: 200,
        massage: "Delete cart successfully",
      });
    } else {
      res.json({
        statusCode: 204,
        massage: "This  cart Id have not in the database",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

const updateCart = (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const isBodyEmpTy = Object.keys(req.body).length;
    if (isBodyEmpTy === 0) {
      return res.send({
        statuscode: 403,
        message: "Body request can not emty.",
      });
    }
    Carts.findByIdAndUpdate(cartId, req.body).then((data) => {
      if (data) {
        res.status(200).json({
          statuscode: 200,
          message: "Update cart successfully",
        });
      } else {
        res.json({
          statuscode: 204,
          message: "This cart Id is have not in the database ",
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

//delete Multiple Cart
const deleteMultipleCart = async (req, res, next) => {
  const listProductsId = req.body;
  try {
    Promise.all(
      listProductsId.map((productId) => Carts.findByIdAndRemove(productId))
    ).then((response) => {
      res.status(200);
      return res.json(errorFunction(false, 200, "Delete Product In Cart Successfully"));
    });
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};
// READ - GET || POST
// UPDATE - PUT || PATCH
// DELETE - DELETE

module.exports = {
  createCart,
  getAllCarts,
  deleteCartById,
  updateCart,
  getCartById,
  getCartByUserId,
  deleteMultipleCart,
};
