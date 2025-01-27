const { ObjectId } = require("mongoose").Types;
const Wallet = require("../../../models/wallet");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const { viewWalletBalance } = require("../../../utils/walletApis");
const msWipeResponse = require("../../../helper/mswipe_constant");
const { fetchCountryDetails } = require("../../../utils/fetchCountryDetails");
const { STATUS_CODE, INFO_MSGS } = require("../../../helper/constant");

const getDetails = async (req, res) => {
  const { logger, userId } = req;
  try {
    const uId = new ObjectId(userId);

    const countryDetails = await fetchCountryDetails(uId);
    const getWallet = await Wallet.findOne({ userId: uId });
    const result = await viewWalletBalance(getWallet.walletId);

    if (result.statusId != 100) {
      const errMsg = await msWipeResponse(result.statusId);
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: errMsg,
      });
    }

    const response = {
      countryName: countryDetails.countryName,
      code: countryDetails.code,
      isoCode: countryDetails.isoCode,
      currency: countryDetails.currency,
      balance: result.balance * countryDetails.exchangeRate,
    };

    return Response.success({
      res,
      status: STATUS_CODE.OK,
      msg: INFO_MSGS.SUCCESS,
      data: response,
    });
  } catch (error) {
    console.error("Error in getDetails:", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  getDetails,
};
