const User = require("../../../models/user");
const Response = require("../../../helper/response");
const { otpSent } = require("../../../utils/otpSent");
const { decrypt } = require("../../../helper/encrypt-decrypt");
const { handleException } = require("../../../helper/exception");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

// Login
const logIn = async (req, res) => {
  const { logger, body } = req;
  try {
    const { email, password } = body;

    const [userInfo] = await User.aggregate([{ $match: { email: email } }]);
    if (!userInfo) {
      let obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.ACCOUNT_NOT_FOUND,
      };
      return Response.error(obj);
    }

    const decryptPassword = decrypt(
      userInfo.password,
      process.env.PASSWORD_ENCRYPTION_KEY
    );

    if (password !== decryptPassword) {
      let obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.INVALID_LOGIN,
      };
      return Response.error(obj);
    }

    await otpSent(email, "login");
    return Response.success({
      res,
      status: STATUS_CODE.CREATED,
      msg: INFO_MSGS.OTP_SENT_SUCC,
    });
  } catch (error) {
    console.log("Login Error : ", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  logIn,
};
