const joi = require("joi");
const {errorFunction} = require("../utils/errorFunction");
const patternPassword = /^[a-zA-Z0-9]{3,30}$/;
const patternPhone = /^[0]{1}[0-9]{9}/;

const validation = joi.object({
  username: joi.string().min(5).max(30).required(),
  password: joi
    .string()
    .min(5)
    .max(100)
    .pattern(new RegExp(patternPassword))
    .required(),
  firsName: joi.string().min(2).max(10).required(),
  lastName: joi.string().min(2).max(10).required(),
  phone: joi.string().length(10).pattern(new RegExp(patternPhone)).required(),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .allow(""),
  address: joi.string().min(10).max(100).allow(""),
  avatar: joi.string().allow(""),
  isAdmin: joi.boolean().required(),
});

const userValidation = async (req, res, next) => {
  const paylaod = {
    username: req.body.userName,
    password: req.body.password,
    firsName: req.body.firsName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    address: req.body.addRess,
    avatar: req.body.avatar,
    isAdmin: req.body.isAdmin,
  };
  const { error } = validation.validate(req.body);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, `Error in User Data : ${error.message}`)
    );
  } else {
    next();
  }
};

module.exports = { userValidation };
