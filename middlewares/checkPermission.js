const User = require("../models/user");
const Response = require("../helper/response");
const { handleException } = require("../helper/exception");
const { STATUS_CODE, ERROR_MSGS } = require("../helper/constant");

const checkPermission = async (req, res, next) => {
  const { logger, userId } = req;
  try {
    const getUser = await User.findById(userId);

    let { verifyByAdmin } = getUser;

    if (verifyByAdmin) {
      return next();
    }

    if (!verifyByAdmin) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.ACCESS_RESTRICTED_ADMIN,
      };
      return Response.error(obj);
    }
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  checkPermission,
};
