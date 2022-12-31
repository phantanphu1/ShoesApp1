const joi = require("joi");
const {errorFunction} = require("../utils/errorFunction")

const validation = joi.object({
    productId: joi.string().min(5).max(100).required(),
    content: joi.string().required(),
    productName: joi.string().min(5).max(100).required(),
    productBrand: joi.string().required(),
    images: joi.string().allow(""),
    userId: joi.string().min(2).max(100).required(),
    username: joi.string().min(5).max(30).required(),
});

const commentValidation = async (req, res, next) => {
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
module.exports = {commentValidation};