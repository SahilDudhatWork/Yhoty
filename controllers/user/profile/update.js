const { ObjectId } = require("mongoose").Types;
const User = require("../../../models/user");
const upload = require("../../../middlewares/multer");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
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

const update = async (req, res) => {
  const { logger, userId, body, files, fileValidationError } = req;
  try {
    const { email, password } = body;

    if (fileValidationError) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: fileValidationError,
      });
    }

    if (password) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: `Password ${ERROR_MSGS.NOT_EDITABLE}`,
      });
    }

    const fetchUser = await User.findOne({ email });
    if (fetchUser && !fetchUser?._id.equals(userId)) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.EMAIL_EXIST,
      });
    }

    body.profilePicture =
      files["profilePicture"]?.[0]?.path || fetchUser?.profilePicture;
    body.document = {
      front: files["document_front"]?.[0]?.path || fetchUser?.document.front,
      back: files["document_back"]?.[0]?.path || fetchUser?.document.back,
    };

    const updateData = await User.findByIdAndUpdate(
      { _id: new ObjectId(userId) },
      body,
      { new: true }
    );

    updateData.save();

    const result = updateData.toObject();
    delete result.password;
    delete result.token;
    delete result.forgotPassword;
    delete result.__v;

    const statusCode = updateData ? STATUS_CODE.OK : STATUS_CODE.BAD_REQUEST;
    const message = updateData
      ? INFO_MSGS.UPDATED_SUCCESSFULLY
      : ERROR_MSGS.UPDATE_ERR;

    return Response[statusCode === STATUS_CODE.OK ? "success" : "error"]({
      req,
      res,
      status: statusCode,
      msg: message,
      data: result,
    });
  } catch (error) {
    console.error("error:", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  uploadmiddlewares,
  update,
};
