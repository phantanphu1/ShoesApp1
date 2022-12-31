const express = require("express");
const route = express.Router();
const app = express();
const {userValidation} = require("../helpers/userValidation")
const {allowCrossDomain}= require("../utils/corsMiddleware")


// var allowCrossDomain = function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
//   res.header("Access-Control-Allow-Headers", "Content-Type");

//   next();
// };

const UsersController = require("../controllers/users");
app.use(allowCrossDomain);
route.post("/users/create",userValidation, UsersController.createUser);
route.post("/user/login",UsersController.login);
route.post("/user/changePassword",UsersController.changePassword);
route.post("/user/forgotPassword",UsersController.forgotPassword);
route.get("/users/getAllUsers", UsersController.getAllUser);
route.get("/users/getUserById/:userId", UsersController.getUserById);
route.delete("/users/deleteUserById/:userId", UsersController.deleteUserById);
route.patch("/users/updateUserById/:userId", UsersController.updateUser);

module.exports = route;
