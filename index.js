const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const ProductsRouter = require("./routes/products");
const UsersRouter = require("./routes/users");
const OrderRouter = require("./routes/orders");
const CartRouter = require("./routes/carts");
const CommentRouter = require("./routes/comments");
const HistoryRouter = require("./routes/historys");

const connection = process.env.MONGOOSE_URL;

// const connection_string =
//     'mongodb+srv://ShopApp:ShopApp@cluster0.xpyvfsh.mongodb.net/ShopApp'

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

const app = express();

app.use(express.json());

// const PORT = 5000
const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log(`server is running on PORT ${PORT}`);
});
database.on("eror", (eror) => {
  console.log(eror);
});
database.once("connected", () => {
  console.log("Database Connected");
});
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api", ProductsRouter);
app.use("/api", UsersRouter);
app.use("/api", OrderRouter);
app.use("/api", CartRouter);
app.use("/api", CommentRouter);
app.use("/api", HistoryRouter);
