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

const CartController = require("../controllers/carts");
const {cartValidation} = require("../helpers/cartValidation");
route.post("/carts/create", cartValidation, CartController.createCart);
route.get("/cart/getAllCart", CartController.getAllCarts);
route.get("/cart/getAllCartById/:cartId", CartController.getCartById);
route.get("/cart/getCartByUserId/:userId", CartController.getCartByUserId);

route.delete("/cart/deleteCartById/:cartId", CartController.deleteCartById);
route.delete("/cart/deleteMultipleCart", CartController.deleteMultipleCart);

route.patch("/cart/updateCartById/:cartId", CartController.updateCart);

// app.use(cors({ origin: '*', credentials: true }))
app.use(allowCrossDomain);

module.exports = route;
