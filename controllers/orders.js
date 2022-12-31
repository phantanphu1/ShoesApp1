const Orders = require("../models/orders");
const Products = require("../models/products");
const Users = require("../models/users");
const Carts = require("../models/carts");
const { errorFunction } = require("../utils/errorFunction");
const createOrder = async (req, res, next) => {
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
    const newOrder = await Orders.create(req.body);

    if (newOrder) {
      return res
        .status(201)
        .json(errorFunction(false, 201, "Order Created", newOrder));
    } else {
      return res.status(403).json(errorFunction(true, "Error Creating Order"));
    }
  } catch (error) {
    console.log("ERRORS:", error);
    return res.status(403).json(errorFunction(true, "Error Creating Order"));
  }
};
//add
const addOrderProduct = async (req, res, next) => {
  //get userId frm body request
  //get user by UserId and check in DB
  // if-else
  //get ProductId from body request
  // get product by productId from body request
  //if - else
  //if product => check quantity of this product(10)
  // if quantity of body request(2)<= quantity of thí product in stock=> ok
  // update quantity of product in stock(8)
  // else=> show mesage
  const quantity = req.body.quantity;
  try {
    const user = await Users.findById(req.body.userId);
    const product = await Products.findById(req.body.productId);
    const requestProduct = { quantity: product.quantity - quantity };
    //check is this product from cart?
    const isProductFromCart = req.body?.cartId;
    const cartId = req.body?.cartId;
    //remove cartId in body request if you want
    delete req.body?.cartId;

    // console.log('cart',cartId);
    // console.log('body',req.body);

    if (!user) {
      return res.json(
        errorFunction(true, 204, "This user Id have not in the database")
      );
    }
    if (!product) {
      return res.json(
        errorFunction(true, 204, "This product Id have not in the database")
      );
    } else {
      //check quantity
      if (quantity <= product.quantity) {
        //mua
        const newOrder = await Orders.create(req.body);

        if (newOrder) {
          Products.findByIdAndUpdate(req.body.productId, requestProduct).then(
            (data) => {
              if (data) {
                // if (isProductFromCart) {
                //   deleteProductByIdInCart(cartId);
                // }
                res.status(201);
                return res.json(
                  errorFunction(false, 201, "Order Created", newOrder)
                );
              } else {
                return res.json(errorFunction(true, 403, "Bad request"));
              }
            }
          );
          if (isProductFromCart) {
            await deleteProductByIdInCart(cartId);
          }
        } else {
          res.status(403);
          return res.json(errorFunction(true, 403, "Error Creating Orrder"));
        }
      } else {
        //show mess
        return res.json(
          errorFunction(
            true,
            206,
            "The quantity is greater than quantity in the stock"
          )
        );
      }
    }
  } catch (error) {
    console.log("ERRORS:", error);
    return res.status(403).json(errorFunction(true, "Bad request"));
  }
};

// const getAllOrder = async (req, res, next) => {
//   try {
//     const {
//       pageSize = 12,
//       pageNumber = 1,
//       totalOrders = "",
//       productName = "",
//       productBrand = "",
//       orderByColumn,
//       orderByDirection = "desc",
//       orderStatus,
//       type = "",
//     } = req.query;
//     const filter = {
//       $and: [
//         {
//           productName: {
//             $regex: productName,
//             $options: "$i",
//           },
//         },
//         {
//           productBrand: {
//             $regex: productBrand,
//             $options: "$i",
//           },
//         },
//         {
//           type: {
//             $regex: type,
//             $options: "$i",
//           },
//         },
//         {
//           orderStatus: orderStatus,
//         },
//       ],
//     };
//     const filterOrder = await Orders.find(filter)
//       .sort(`${orderByDirection === "asc" ? "" : "_"}${orderByColumn}`)
//       .limit(pageSize * 1)
//       .skip((pageNumber - 1) * pageSize);

//     const allOrders = await Orders.find(filter);
//     let totalPage = 0;
//     if (allOrders.length % pageSize === 0) {
//       totalPage = allOrders.length / pageSize;
//     } else {
//       totalPage = parseInt(allOrders.length / pageSize) + 1;
//     }

//     if (allOrders.length > 0) {
//       res.status(200).json({
//         totalPage: totalPage,
//         totalOrders: allOrders.length,
//         orders:
//           orderByDirection && orderByColumn
//             ? filterOrder
//             : filterOrder.reverse(),
//         // reverse: thêm vào đầu
//       });
//     } else {
//       res.status(200).json({
//         message: "no results",
//       });
//     }
//   } catch (error) {
//     console.log("error: ", error);
//     res.status(400).json({
//       message: "Bad request",
//     });
//   }
// };

const getAllOrder = async (req, res, next) => {
  try {
    const {
      pageSize = 12,
      pageNumber = 1,
      productName = "",
      productBrand = "",
      orderByColumn,
      orderByDirection = "desc",
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
    const filterOrders = await Orders.find(filter)
      .sort(`${orderByDirection === "asc" ? "" : "-"}${orderByColumn}`)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize);

    const allOrders = await Orders.find(filter);

    let totalPage = 0;
    if (allOrders.length % pageSize === 0) {
      totalPage = allOrders.length / pageSize;
    } else {
      totalPage = parseInt(allOrders.length / pageSize) + 1;
    }

    if (allOrders.length > 0) {
      res.status(200).json({
        totalPage: totalPage,
        totalOrders: allOrders.length,
        orders:
          orderByDirection && orderByColumn
            ? filterOrders
            : filterOrders.reverse(),
      });
    } else {
      res.status(200).json({
        message: "No results",
        orders: [],
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

const getOrderById = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Orders.findById(orderId);
    if (order) {
      res.status(200).json({
        statuscode: 200,
        order,
      });
    } else {
      res.json({
        statuscode: 204,
        message: "this product Id is have not in the database",
        order: {},
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

// get by user id
const getOrderByUserId = async (req, res, next) => {
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
    const orders = await Orders.find(filter);
    if (orders) {
      res.status(200).json({
        statusCode: 200,
        total: orders.length,
        orders: orders.reverse(),
      });
    } else {
      res.json({
        statusCode: 204,
        message: "This order Id have not in the database",
        order: {},
      });
    }
  } catch (error) {
    res.status(400);
    return res.json(errorFunction(true, 400, "Bad request"));
  }
};

const deleteOrderById = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Orders.findByIdAndRemove(orderId);
    if (order) {
      res.status(200).json({
        statuscode: 200,
        message: "Delete product successfully",
      });
    } else {
      res.json({
        statuscode: 204,
        message: "this product Id is have not in the database",
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

const updateOrder = (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const isBodyEmpTy = Object.keys(req.body).length;
    if (isBodyEmpTy === 0) {
      return res.send({
        statuscode: 403,
        message: "Body request can not emty.",
      });
    }
    Orders.findByIdAndUpdate(orderId, req.body).then((data) => {
      if (data) {
        res.status(200).json({
          statuscode: 200,
          message: "Update product successfully",
        });
      } else {
        res.json({
          statuscode: 204,
          message: "This product Id is have not in the database ",
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
const deleteProductByIdInCart = async (cartId) => {
  try {
    await Carts.findByIdAndRemove(cartId);
  } catch (error) {
    console.log("ERR");
    return null
  }
};

//add multiple orders
const addMultipleOrders = async (req, res, next) => {
  try {
    const items = req.body.map((item)=> new Orders(item))
    Promise.all(
      items.map((item)=>{
        if(item?.cartId){
          deleteProductByIdInCart(item?.cartId)
        // Carts.findByIdAndRemove(item?.cartId)
        }
        item.save()
      })
    ) 
    .then((result)=>{
      res.status(201)
      return res.json(errorFunction(false,201,'Orders Create'))
    })
    .catch((error)=>{
      res.status(400)
      return res.json(errorFunction(true,400,'Bad request'))
    })
  } catch (error) {
    res.status(400)
      return res.json(errorFunction(true,400,'Bad request'))
  }
};



const deleteMultipleOrders = async (req, res, next) => {
  const listOrderId = req.body
  try {
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: "Bad request",
    });
  }
};

//delete Multiple Orders




module.exports = {
  createOrder,
  getAllOrder,
  getOrderById,
  deleteOrderById,
  updateOrder,
  addOrderProduct,
  getOrderByUserId,
  deleteProductByIdInCart,
  addMultipleOrders,
  deleteMultipleOrders,
};
