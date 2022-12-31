const joi = require("joi");
const {errorFunction} = require("../utils/errorFunction")

const patternPhoneNumber = /[0]{1}[0-9]{9}/;

const validation = joi.object({
  username: joi.string().min(5).max(30).required(),
  productName: joi.string().min(5).max(100).required(),
  productId: joi.string().min(5).max(100).required(),
  productBrand: joi.string().required(),
  userId: joi.string().min(2).max(100).required(),
  orderStatus: joi.number().min(1).max(4).required(),
  type: joi.string().required(),
  phone: joi
    .string()
    .length(10)
    .pattern(new RegExp(patternPhoneNumber))
    .required(),
  price: joi.number().required(),
  address: joi.string().min(10).max(100).allow(""),
  quantity: joi.number().required(),
  images: joi.string().allow(""),
  cartId:joi.optional(),
});

const orderValidation = async (req, res, next) => {
  const { error } = validation.validate(req.body);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, 406, `Error in User Data: ${error.message}`)
    );
  } else {
    next();
  }
};
module.exports = {orderValidation};