const { ObjectId } = require("mongoose").Types;
const Report = require("../../../models/report");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const create = async (req, res) => {
  const { logger, userId, body } = req;
  try {
    body.userId = userId;
    const cardId = new ObjectId(body.cardId);

    const cardExists = await Report.findOne({ cardId: cardId });
    if (cardExists) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.REPORT_ALREADY_ADDED,
      });
    }

    await Report.create(body);
    const obj = {
      res,
      status: STATUS_CODE.CREATED,
      msg: INFO_MSGS.REPORT_ADDED,
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  create,
};
