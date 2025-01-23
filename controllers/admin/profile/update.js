const { ObjectId } = require("mongoose").Types;
const Admin = require("../../../models/admin");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const update = async (req, res) => {
  const { logger, adminId, body } = req;
  try {
    const { password } = body;

    if (password) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: `Password ${ERROR_MSGS.NOT_EDITABLE}`,
      });
    }

    const updateData = await Admin.findByIdAndUpdate(
      { _id: new ObjectId(adminId) },
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
  update,
};
