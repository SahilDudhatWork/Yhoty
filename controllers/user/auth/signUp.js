const User = require("../../../models/user");
const Wallet = require("../../../models/wallet");
const Response = require("../../../helper/response");
const upload = require("../../../middlewares/multer");
const { otpSent } = require("../../../utils/otpSent");
const { encrypt } = require("../../../helper/encrypt-decrypt");
const { createSubWallet } = require("../../../utils/walletApis");
const { handleException } = require("../../../helper/exception");
const msWipeResponse = require("../../../helper/mswipe_constant");
const { signUpSchemaValidate } = require("../../../helper/joi-validation");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const uploadmiddlewares = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "document_front", maxCount: 1 },
  { name: "document_back", maxCount: 1 },
]);

const signUp = async (req, res) => {
  const { logger, body, files, fileValidationError } = req;
  try {
    const {
      fullName,
      email,
      password,
      countryCode,
      phoneNumber,
      dob,
      address1,
      address2,
      country,
      city,
    } = body;

    const { error } = signUpSchemaValidate({
      fullName,
      email,
      password,
      countryCode,
      phoneNumber,
      dob,
      address1,
      address2,
      country,
      city,
    });

    if (error) {
      const firstErrorMessage = error.details[0].message;
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: firstErrorMessage,
      });
    }

    if (fileValidationError) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: fileValidationError,
      });
    }

    const userEmailExist = await User.findOne({ email });
    if (userEmailExist) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.ACCOUNT_EXISTS,
      });
    }

    const passwordHash = encrypt(password, process.env.PASSWORD_ENCRYPTION_KEY);
    body.password = passwordHash;

    body.profilePicture = files["profilePicture"]?.[0]?.path || null;
    body.document = {
      front: files["document_front"]?.[0]?.path || null,
      back: files["document_back"]?.[0]?.path || null,
    };

    const insertUser = await User.create(body);
    await otpSent(email, "signUp");
    const result = await createSubWallet();

    if (result.statusId != 100) {
      const errMsg = await msWipeResponse(result.statusId);
      await User.findByIdAndDelete(insertUser._id);
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: `${errMsg}. Please sign up again.`,
      };
      return Response.error(obj);
    }

    const walletPayload = {
      ...result,
      userId: insertUser._id,
      balance: 0,
    };

    await Wallet.create(walletPayload);

    return Response.success({
      res,
      status: STATUS_CODE.CREATED,
      msg: INFO_MSGS.OTP_SENT_SUCC,
    });
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  uploadmiddlewares,
  signUp,
};
