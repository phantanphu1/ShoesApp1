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

const OrderController=require("../controllers/orders");
const { orderValidation } = require("../helpers/orderValidation");
route.post("/orders/create",orderValidation,OrderController.createOrder);
route.post("/orders/addOrder",orderValidation,OrderController.addOrderProduct);
route.post("/orders/addMultipleOrders",OrderController.addMultipleOrders);

route.get("/order/getAllOrder", OrderController.getAllOrder);
route.get("/order/getOrderByUserId/:userId", OrderController.getOrderByUserId);

route.get("/order/getAllOrderById/:orderId", OrderController.getOrderById);

route.delete("/order/deleteOrderById/:orderId", OrderController.deleteOrderById);
route.patch("/order/updateOrderById/:orderId", OrderController.updateOrder);

// app.use(cors({ origin: '*', credentials: true }))
app.use(allowCrossDomain);



module.exports = route;
