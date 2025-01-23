const { ObjectId } = require("mongoose").Types;
const Wallet = require("../../../models/wallet");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const { viewWalletBalance } = require("../../../utils/walletApis");
const msWipeResponse = require("../../../helper/mswipe_constant");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const viewWalletBal = async (req, res) => {
  const { logger, userId } = req;
  try {
    const uId = new ObjectId(userId);
    const getWallet = await Wallet.findOne({ userId: uId });

    const result = await viewWalletBalance(getWallet.walletId);
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
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  viewWalletBal,
};
