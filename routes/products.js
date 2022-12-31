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

const ProductsController = require("../controllers/products");

// app.use(cors({ origin: '*', credentials: true }))
app.use(allowCrossDomain);

route.post("/products/create", ProductsController.createProduct);
route.get("/products/getAllProducts", ProductsController.getAllProducts);
route.get(
  "/products/getProductById/:productId",
  ProductsController.getProductById
);
route.delete(
  "/products/deleteProductById/:productId",
  ProductsController.deleteProductById
);
route.patch(
  "/products/editProductById/:productId",
  ProductsController.editProduct
);

module.exports = route;
