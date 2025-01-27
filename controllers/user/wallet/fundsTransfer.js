const { ObjectId } = require("mongoose").Types;
const Wallet = require("../../../models/wallet");
const WalletTransFunds = require("../../../models/walletTransFunds");
const Response = require("../../../helper/response");
const { transferFunds } = require("../../../utils/walletApis");
const { handleException } = require("../../../helper/exception");
const msWipeResponse = require("../../../helper/mswipe_constant");
const { STATUS_CODE, INFO_MSGS } = require("../../../helper/constant");

const fundsTransfer = async (req, res) => {
  const { logger, userId, body } = req;
  try {
    const uId = new ObjectId(userId);
    const getWallet = await Wallet.findOne({ userId: uId });

    const payload = {
      userId,
      walletIdFrom: getWallet.parentWalletId,
      walletIdTo: getWallet.walletId,
      amount: body.amount,
      description: "Fund Transfer",
    };

    const result = await transferFunds(payload);
    if (result.statusId != 100) {
      const errMsg = await msWipeResponse(result.statusId);
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: errMsg,
      };
      return Response.error(obj);
    }
    payload.refTransId = result.refTransId;
    payload.statusId = result.statusId;
    payload.status = "credit";
    const balance = Number(getWallet.balance) + Number(body.amount);
    payload.balance = balance;

    await Promise.all([
      WalletTransFunds.create(payload),
      Wallet.findByIdAndUpdate(getWallet._id, { balance }, { new: true }),
    ]);

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
  fundsTransfer,
};
