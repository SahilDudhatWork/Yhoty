const Response = require("../../../helper/response");
const { otpSent } = require("../../../utils/otpSent");
const { hendleModel } = require("../../../utils/hendleModel");
const { handleException } = require("../../../helper/exception");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const sentOtp = async (req, res) => {
  const { logger, params, body } = req;
  try {
    const { email } = body;
    const { type } = params;
    const Model = await hendleModel(type);

    const checkEmailExists = await Model.exists({ email });

    if (!checkEmailExists) {
      if (type === "admin") {
        return Response.error({
          res,
          status: STATUS_CODE.BAD_REQUEST,
          msg: ERROR_MSGS.PERMISSIONS_DENIED,
        });
      }
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.ACCOUNT_NOT_FOUND,
      });
    }

    await otpSent(email, "forgot");

    return Response.success({
      res,
      status: STATUS_CODE.CREATED,
      msg: INFO_MSGS.OTP_SENT_SUCC,
    });
  } catch (error) {
    console.error("Error:", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  sentOtp,
};
