const joi = require("joi");

const addProductSchema = joi.object({
  productName: joi.string().min(5).max(100).required(),
  productBrand: joi.string().required(),
  type: joi.string().required(),
  info: joi.string(),
  price: joi.number().required(),
  discount: joi.number(),
  quantity: joi.number().required(),
  images: joi.array().items(joi.string().required()),
});
const patternPassword = /^[a-zA-Z0-9]{3,30}$/
const addUsersSchema = joi.object({
    username: joi.string().min(5).max(30).required(),
    password: joi.string().min(5).max(100).pattern(new RegExp(patternPassword)).required(),
    firsName: joi.string().min(2).max(10).required(),
    lastName: joi.string().min(2).max(10).required(),
    phone:joi.string().max(10).required(),
    email: joi.string().email({ tlds: { allow: false } }),
    address: joi.string().min(10).max(100).required(),
    avatar: joi.string().allow(""),
  });

module.exports = { addProductSchema, addUsersSchema };