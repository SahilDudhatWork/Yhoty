const Response = require("../helper/response");
const { emailAndPassVerification } = require("../helper/joi-validation");
const { STATUS_CODE, ERROR_MSGS } = require("../helper/constant");

const validateEmailAndPass = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const message = !email
      ? `Email ${ERROR_MSGS.KEY_REQUIRED}`
      : `Password ${ERROR_MSGS.KEY_REQUIRED}`;
    let obj = {
      res,
      status: STATUS_CODE.BAD_REQUEST,
      msg: message,
    };
    return Response.error(obj);
  }

  const { error } = emailAndPassVerification({ email, password });
  if (error) {
    return Response.error({
      res,
      status: STATUS_CODE.BAD_REQUEST,
      msg: error.details[0].message,
    });
  }

  next();
};

module.exports = {
  validateEmailAndPass,
};
