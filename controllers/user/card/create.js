const { ObjectId } = require("mongoose").Types;
const Card = require("../../../models/card");
const User = require("../../../models/user");
const Wallet = require("../../../models/wallet");
const Response = require("../../../helper/response");
const { createNewCard } = require("../../../utils/cardApis");
const { handleException } = require("../../../helper/exception");
const msWipeResponse = require("../../../helper/mswipe_constant");
const {
  STATUS_CODE,
  INFO_MSGS,
  ERROR_MSGS,
} = require("../../../helper/constant");

const create = async (req, res) => {
  const { logger, userId, body } = req;
  try {
    const uId = new ObjectId(userId);

    const [getUser, getWallet, cardExists] = await Promise.all([
      User.findById(uId),
      Wallet.findOne({ userId: uId }),
      await Card.countDocuments({ userId: uId, code: body.country }),
    ]);
    
    if (cardExists > 0) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: ERROR_MSGS.CARD_ALREADY_EXIST,
      };
      return Response.error(obj);
    }

    const result = await createNewCard(getUser, getWallet, body);
    if (result.statusId != 100) {
      const errMsg = await msWipeResponse(result.statusId);
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: errMsg,
      };
      return Response.error(obj);
    }
    await Card.create(result);
    const obj = {
      res,
      status: STATUS_CODE.CREATED,
      msg: INFO_MSGS.CREATED_SUCCESSFULLY,
      data: result,
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
