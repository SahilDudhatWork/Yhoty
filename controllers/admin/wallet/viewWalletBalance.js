const Response = require("../../../helper/response");
const msWipeResponse = require("../../../helper/mswipe_constant");
const { viewWalletBalance } = require("../../../utils/walletApis");
const { handleException } = require("../../../helper/exception");
const { STATUS_CODE, INFO_MSGS } = require("../../../helper/constant");

const viewWalletBal = async (req, res) => {
  const { logger } = req;
  try {
    const result = await viewWalletBalance(process.env.PARENT_WALLET_ID);
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
