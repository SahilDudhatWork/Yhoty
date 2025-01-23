const { ObjectId } = require("mongoose").Types;
const Card = require("../../../models/card");
const Response = require("../../../helper/response");
const { addFundsToCard } = require("../../../utils/cardApis");
const { handleException } = require("../../../helper/exception");
const msWipeResponse = require("../../../helper/mswipe_constant");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const addFunds = async (req, res) => {
  let { logger, params, body } = req;
  try {
    const { amount, description } = body;
    const cardId = new ObjectId(params.id);

    const getDetails = await Card.findById(cardId);

    const payload = {
      walletId: getDetails.walletId,
      cardToken: getDetails.cardToken,
      amount,
      description: description || "Load Card",
    };

    const result = await addFundsToCard(payload);

    if (result.statusId != 100) {
      const errMsg = await msWipeResponse(result.statusId);
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: errMsg,
      };
      return Response.error(obj);
    }

    await Card.findByIdAndUpdate(
      cardId,
      { balance: result.balance },
      { new: true }
    );

    const obj = {
      res,
      status: STATUS_CODE.OK,
      msg: INFO_MSGS.UPDATED_SUCCESSFULLY,
      data: result,
    };
    return Response.success(obj);
  } catch (error) {
    console.error("error-->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addFunds,
};
