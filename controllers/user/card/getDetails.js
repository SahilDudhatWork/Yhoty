const { ObjectId } = require("mongoose").Types;
const Card = require("../../../models/card");
const Response = require("../../../helper/response");
const { getCardDetails } = require("../../../utils/cardApis");
const { handleException } = require("../../../helper/exception");
const msWipeResponse = require("../../../helper/mswipe_constant");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const getDetails = async (req, res) => {
  let { logger, params } = req;
  try {
    const cardId = new ObjectId(params.id);

    const getDetails = await Card.findById(cardId);
    const result = await getCardDetails(
      getDetails.walletId,
      getDetails.cardToken
    );

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
      data: { getDetails, result },
    };
    return Response.success(obj);
  } catch (error) {
    console.error("error-->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  getDetails,
};
