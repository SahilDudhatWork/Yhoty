const Response = require("../../../helper/response");
const { hendleModel } = require("../../../utils/hendleModel");
const { encrypt } = require("../../../helper/encrypt-decrypt");
const { handleException } = require("../../../helper/exception");
const { validateResetPassword } = require("../../../helper/joi-validation");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const resetPassword = async (req, res) => {
  const { logger, params, body } = req;
  try {
    const { password } = body;
    const { email } = req;
    const { type } = params;

    const { error } = validateResetPassword({ password });
    if (error) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }

    const Model = await hendleModel(type);

    const checkEmailExist = await Model.findOne({
      email: email,
    });
    if (!checkEmailExist) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.ACCOUNT_NOT_EXISTS,
      };
      return Response.error(obj);
    }

    const passwordHash = encrypt(password, process.env.PASSWORD_ENCRYPTION_KEY);
    await Model.findByIdAndUpdate(
      { _id: checkEmailExist._id },
      {
        password: passwordHash,
        "forgotPassword.createdAt": Date.now(),
      },
      { new: true }
    );

    const obj = {
      res,
      status: STATUS_CODE.OK,
      msg: INFO_MSGS.FORGOT_PASSWORD,
    };
    return Response.error(obj);
  } catch (error) {
    console.log("resetPassword Error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  resetPassword,
};
