const { ObjectId } = require("mongoose").Types;
const User = require("../../../models/user");
const Response = require("../../../helper/response");
const { decrypt } = require("../../../helper/encrypt-decrypt");
const { handleException } = require("../../../helper/exception");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const getDetails = async (req, res) => {
  const { logger, params } = req;
  try {
    const id = new ObjectId(params.id);

    let [getData] = await User.aggregate([
      { $match: { _id: id } },
      {
        $project: {
          __v: 0,
          token: 0,
        },
      },
    ]);

    const decryptPassword = decrypt(
      getData.password,
      process.env.PASSWORD_ENCRYPTION_KEY
    );
    getData.password = decryptPassword;

    const statusCode = getData ? STATUS_CODE.OK : STATUS_CODE.OK;
    const message = getData ? INFO_MSGS.SUCCESS : ERROR_MSGS.DATA_NOT_FOUND;

    return Response[statusCode === STATUS_CODE.OK ? "success" : "error"]({
      req,
      res,
      status: statusCode,
      msg: message,
      data: getData || null,
    });
  } catch (error) {
    console.error("error:", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  getDetails,
};
