const { ObjectId } = require("mongoose").Types;
const Card = require("../../../models/card");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const msWipeResponse = require("../../../helper/mswipe_constant");
const { viewCardTransactions } = require("../../../utils/cardApis");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const transactions = async (req, res) => {
  let { logger, params, query } = req;
  try {
    const { startDate } = query;
    const cardId = new ObjectId(params.id);

    const getDetails = await Card.findById(cardId);

    const payload = {
      walletId: getDetails.walletId,
      cardToken: getDetails.cardToken,
      startDate,
    };
    const result = await viewCardTransactions(payload);

    if (result.statusId != 100) {
      const errMsg = await msWipeResponse(result.statusId);
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: errMsg,
      };
      return Response.error(obj);
    }

    const obj = {
      res,
      status: STATUS_CODE.OK,
      msg: INFO_MSGS.SUCCESS,
      data: result,
    };
    return Response.success(obj);
  } catch (error) {
    console.error("error-->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  transactions,
};
