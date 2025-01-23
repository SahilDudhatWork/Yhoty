const jwt = require("jsonwebtoken");
const Otp = require("../../../models/otp");
const User = require("../../../models/user");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const { encrypt } = require("../../../helper/encrypt-decrypt");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const verifyOtp = async (req, res) => {
  const { logger, body } = req;
  try {
    const { email, otp } = body;

    const otpData = await Otp.findOne({ email });

    if (!otpData) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.EXPIRED_OTP,
      };
      return Response.error(obj);
    }

    if (otpData.otp !== otp) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.INVALID_OTP,
      };
      return Response.error(obj);
    }

    const currentTime = new Date();
    const createdAtTime = new Date(otpData.createdAt);
    const timeDifferenceMinutes = (currentTime - createdAtTime) / (1000 * 60);

    if (timeDifferenceMinutes > 5) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.EXPIRED_OTP,
      };
      return Response.error(obj);
    }

    await Otp.findOneAndDelete({ email, otp });
    let fetchData = await User.aggregate([{ $match: { email: email } }]);
    fetchData = fetchData[0];

    const encryptUser = encrypt(fetchData._id, process.env.USER_ENCRYPTION_KEY);
    const accessToken = await commonAuth(
      encryptUser,
      process.env.USER_ACCESS_TIME,
      process.env.USER_ACCESS_TOKEN,
      "Access"
    );

    await User.findByIdAndUpdate(
      fetchData._id,
      {
        lastLogin: new Date(),
        "token.accessToken": accessToken,
        "token.type": "Access",
        "token.createdAt": new Date(),
      },
      { new: true }
    );

    let obj = {
      res,
      msg: INFO_MSGS.SUCCESSFUL_LOGIN,
      status: STATUS_CODE.OK,
      data: { accessToken },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

// Common Auth function for 2FA checking and JWT token generation
const commonAuth = async (encryptUser, ACCESS_TIME, ACCESS_TOKEN, type) => {
  try {
    const payload = {
      encryptUser,
      expiresIn: ACCESS_TIME,
      accessToken: ACCESS_TOKEN,
      type,
      role: "User",
    };
    const accessToken = await generateJWTToken(payload);
    return accessToken;
  } catch (error) {
    console.log("commonAuth Error:", error);
    throw error;
  }
};

// Generate JWT Token
const generateJWTToken = async (payload) => {
  try {
    const { encryptUser, expiresIn, accessToken, type, role } = payload;
    const token = jwt.sign({ userId: encryptUser, type, role }, accessToken, {
      expiresIn,
    });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  verifyOtp,
};
