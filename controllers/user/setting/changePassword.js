const User = require("../../../models/user");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const { encrypt, decrypt } = require("../../../helper/encrypt-decrypt");
const { validateResetPassword } = require("../../../helper/joi-validation");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const changePassword = async (req, res) => {
  const { logger, userId, body } = req;
  try {
    const { oldPassword, password } = body;

    const { error } = validateResetPassword({ password });
    if (error) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }
    if (password === oldPassword) {
      let obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.OLD_NEW_PASSWORD_SAME,
      };
      return Response.error(obj);
    }

    const fetchUser = await User.findById(userId);
    const decryptPassword = decrypt(
      fetchUser.password,
      process.env.PASSWORD_ENCRYPTION_KEY
    );

    if (decryptPassword !== oldPassword) {
      let obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.INCORRECT_PASSWORD,
      };
      return Response.error(obj);
    }

    const passwordHash = encrypt(password, process.env.PASSWORD_ENCRYPTION_KEY);

    await User.findByIdAndUpdate(
      { _id: fetchUser._id },
      {
        password: passwordHash,
        "forgotPassword.createdAt": Date.now(),
      },
      { new: true }
    );

    const obj = {
      res,
      status: STATUS_CODE.OK,
      msg: INFO_MSGS.PASSWORD_CHANGED,
    };
    return Response.error(obj);
  } catch (error) {
    console.log("Error :>>", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  changePassword,
};
