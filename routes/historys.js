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

const HistoryController=require("../controllers/historys");
const { historyValidation } = require("../helpers/historyValidation");
route.post("/historys/create",historyValidation,HistoryController.orderHistory);
// route.post("/orders/addOrder",orderValidation,OrderController.addOrderProduct);

route.get("/history/getAllHistory", HistoryController.getAllHistory);
route.get("/history/getHistoryByUserId/:userId", HistoryController.getHistoryByUserId);

route.get("/history/getAllHistoryById/:historyId", HistoryController.getHistoryById);

route.delete("/history/deleteHistoryById/:historyId", HistoryController.deleteHistoryById);
route.patch("/history/updateHistoryById/:historyId", HistoryController.updateHistory);

app.use(allowCrossDomain);



module.exports = route;
