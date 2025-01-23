const { ObjectId } = require("mongoose").Types;
const User = require("../../../models/user");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const { STATUS_CODE, INFO_MSGS } = require("../../../helper/constant");

const verifyOrUnverify = async (req, res) => {
  const { logger, params } = req;
  try {
    const { type } = params;
    const id = new ObjectId(params.id);

    const verifyByAdmin = type === "verify";

    await User.findOneAndUpdate(
      { _id: id },
      { $set: { verifyByAdmin } },
      { new: true }
    );

    const message =
      type === "verify"
        ? INFO_MSGS.VERIFY_SUCCESSFULLY
        : INFO_MSGS.UNVERIFY_SUCCESSFULLY;

    return Response.success({
      req,
      res,
      status: STATUS_CODE.OK,
      msg: message,
    });
  } catch (error) {
    console.error("error:", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  verifyOrUnverify,
};
