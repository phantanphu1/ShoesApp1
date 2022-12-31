const joi = require("joi");
const {errorFunction} = require("../utils/errorFunction");

const validation = joi.object({
  userId: joi.string().min(2).max(100).required(),
  productName: joi.string().min(5).max(100).required(),
  productId: joi.string().min(5).max(100).required(),
  productBrand: joi.string().required(),
  type: joi.string().required(),
  price: joi.number().required(),
  quantity: joi.number().required(),
  images: joi.string().allow(""),
});

const cartValidation = async (req, res, next) => {
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
module.exports = {cartValidation};
