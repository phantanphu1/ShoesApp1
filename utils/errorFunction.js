const errorFunction = (errorBit, statuscode, msg, data) => {
  if (errorBit) return { is_error: errorBit, statuscode, message: msg };
  else return { is_error: errorBit, statuscode, message: msg, data };
};
module.exports = { errorFunction };
