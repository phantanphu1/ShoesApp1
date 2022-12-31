const Products = require("../models/products");
const ProductValidation = require("../helpers/validation");
//CRUD
//CREATE-POST
const createProduct = async (req, res, next) => {
  try {
    // const {
    //   productName,
    //   productBrand,
    //   type,
    //   price,
    //   discount,
    //   quantity,
    //   images,
    // } = req.body;
    // if (
    //   !productName ||
    //   !productBrand ||
    //   !type ||
    //   !price ||
    //   !discount ||
    //   !quantity ||
    //   !images
    // ) {
    //   res.status(400).json({
    //     statuscode: 400,
    //     message: "Some fileds are not empty.",
    //   });
    // }

    const validBodyReq = await ProductValidation.addProductSchema.validateAsync(
      req.body
    );
    // let product = new Products(req.body);
    let product = new Products(validBodyReq);
    // product.save()
    product.save().then((response) => {
      res.json({
        message: "Added product successfully!",
      });
    });
  } catch (error) {
    console.log(" ERR", error);
    // res.status(400).json(
    //   {
    //     statuscode: 400,
    //     message: 'Bad request'
    //   }
    // )
    return res.status(400).json({
      statuscode: 400,
      message: "Bad request",
      errorsMessage: error.details[0].message,
    });
  }
};

// get all product

const getAllProducts = async (req, res, next) => {
  try {
    const {
      pageSize = 12,
      pageNumber = 1,
      totalProducts = "",
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
    const filterProduct = await Products.find(filter)
      .sort(`${orderByDirection === "asc" ? "" : "_"}${orderByColumn}`)
      .limit(pageSize * 1)
      .skip((pageNumber - 1) * pageSize);

    const allProducts = await Products.find(filter);
    let totalPage = 0;
    if (allProducts.length % pageSize === 0) {
      totalPage = allProducts.length / pageSize;
    } else {
      totalPage = parseInt(allProducts.length / pageSize) + 1;
    }

    if (Products.length > 0) {
      res.status(200).json({
        totalPage: totalPage,
        totalProducts: allProducts.length,
        products:
          orderByDirection && orderByColumn
            ? filterProduct
            : filterProduct.reverse(),
        // reverse: thêm vào đầu
      });
    } else {
      res.status(200).json({
        message: "no results",
        products: [],
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      message: "Bad request",
    });
  }
};

// get by id
const getProductById = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Products.findById(productId);
    if (product) {
      res.status(200).json({
        statuscode: 200,
        product,
      });
    } else {
      res.json({
        statuscode: 204,
        message: "this product Id is have not in the database",
        product: {},
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
//delete product by id

const deleteProductById = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Products.findByIdAndRemove(productId);
    if (product) {
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

//updata by id
const editProduct = (req, res, next) => {
  try {
    const productId = req.params.productId;
    const isBodyEmpTy = Object.keys(req.body).length;
    if (isBodyEmpTy === 0) {
      return res.send({
        statuscode: 403,
        message: "Body request can not emty.",
      });
    }
    Products.findByIdAndUpdate(productId, req.body).then((data) => {
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

//READ-GET  || POST
//UPDATE-PUT||PATCH
//DELETE-DELETE
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProductById,
  editProduct,
};
