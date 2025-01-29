// const { ObjectId } = require("mongoose").Types;
// const Card = require("../../../models/card");
// const Wallet = require("../../../models/wallet");
// const Transaction = require("../../../models/transaction");
// const Response = require("../../../helper/response");
// const { addFundsToCard } = require("../../../utils/cardApis");
// const { transferFunds } = require("../../../utils/walletApis");
// const { handleException } = require("../../../helper/exception");
// const msWipeResponse = require("../../../helper/mswipe_constant");
// const {
//   STATUS_CODE,
//   ERROR_MSGS,
//   INFO_MSGS,
// } = require("../../../helper/constant");

// const addFunds = async (req, res) => {
//   let { logger, params, body, userId } = req;
//   try {
//     const { balance, description } = body;
//     const cardId = new ObjectId(params.id);

//     const getDetails = await Card.findById(cardId);
//     const getWallet = await Wallet.findOne({ userId: new ObjectId(userId) });

//     // Admin Wallet to User Wallet

//     const wltPayload = {
//       userId,
//       walletIdFrom: getWallet.parentWalletId,
//       walletIdTo: getWallet.walletId,
//       balance: balance,
//       description: "Fund Transfer",
//     };

//     const tfResult = await transferFunds(wltPayload);
//     if (result.statusId != 100) {
//       const errMsg = await msWipeResponse(tfResult.statusId);
//       const obj = {
//         res,
//         status: STATUS_CODE.BAD_REQUEST,
//         msg: errMsg,
//       };
//       return Response.error(obj);
//     }
//     wltPayload.refTransId = result.refTransId;
//     wltPayload.status = "credit";
//     wltPayload.balance = Number(getWallet.balance) + Number(balance);
//     wltPayload.cardId = cardId;

//     await Promise.all([
//       Transaction.create(wltPayload),
//       Wallet.findByIdAndUpdate(getWallet._id, { balance }, { new: true }),
//     ]);

//     // User Wallet to User Card

//     const payload = {
//       walletId: getDetails.walletId,
//       cardToken: getDetails.cardToken,
//       balance,
//       description: description || "Load Card",
//     };

//     const result = await addFundsToCard(payload);

//     if (result.statusId != 100) {
//       const errMsg = await msWipeResponse(result.statusId);
//       const obj = {
//         res,
//         status: STATUS_CODE.BAD_REQUEST,
//         msg: errMsg,
//       };
//       return Response.error(obj);
//     }

//     await Card.findByIdAndUpdate(
//       cardId,
//       { balance: result.balance },
//       { new: true }
//     );

//     const obj = {
//       res,
//       status: STATUS_CODE.OK,
//       msg: INFO_MSGS.UPDATED_SUCCESSFULLY,
//       data: result,
//     };
//     return Response.success(obj);
//   } catch (error) {
//     console.error("error-->", error);
//     return handleException(logger, res, error);
//   }
// };

// module.exports = {
//   addFunds,
// };

const { ObjectId } = require("mongoose").Types;
const Card = require("../../../models/card");
const Transaction = require("../../../models/transaction");
const Wallet = require("../../../models/wallet");
const Response = require("../../../helper/response");
const { addFundsToCard } = require("../../../utils/cardApis");
const { transferFunds } = require("../../../utils/walletApis");
const { handleException } = require("../../../helper/exception");
const msWipeResponse = require("../../../helper/mswipe_constant");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const processTransferFunds = async (wltPayload) => {
  const tfResult = await transferFunds(wltPayload);
  if (tfResult.statusId !== 100) {
    const errMsg = await msWipeResponse(tfResult.statusId);
    throw new Error(errMsg);
  }
  return tfResult;
};

const updateWalletAndTransaction = async (
  getWallet,
  balance,
  cardId,
  refTransId
) => {
  const wltPayload = {
    userId: getWallet.userId,
    walletIdFrom: getWallet.parentWalletId,
    walletIdTo: getWallet.walletId,
    balance,
    description: "Fund Transfer",
    refTransId,
    status: "credit",
    cardId,
  };

  // Update Wallet and Transaction
  await Promise.all([
    Transaction.create(wltPayload),
    Wallet.findByIdAndUpdate(getWallet._id, { balance }, { new: true }),
  ]);
};

const loadCardFunds = async (cardDetails, balance, description) => {
  const payload = {
    walletId: cardDetails.walletId,
    cardToken: cardDetails.cardToken,
    balance,
    description: description || "Load Card",
  };

  const result = await addFundsToCard(payload);
  if (result.statusId !== 100) {
    const errMsg = await msWipeResponse(result.statusId);
    throw new Error(errMsg);
  }
  return result;
};

const addFunds = async (req, res) => {
  const { logger, params, body, userId } = req;
  try {
    const { balance, description } = body;
    const cardId = new ObjectId(params.id);

    // Fetch Card and Wallet Details
    const getDetails = await Card.findById(cardId);
    const getWallet = await Wallet.findOne({ userId: new ObjectId(userId) });

    // Admin Wallet to User Wallet Transfer
    const wltPayload = {
      userId,
      walletIdFrom: getWallet.parentWalletId,
      walletIdTo: getWallet.walletId,
      balance,
      description: "Fund Transfer",
    };

    const transferResult = await processTransferFunds(wltPayload);
    await updateWalletAndTransaction(
      getWallet,
      Number(getWallet.balance) + Number(balance),
      cardId,
      transferResult.refTransId
    );

    // User Wallet to Card Loading
    const cardUpdateResult = await loadCardFunds(
      getDetails,
      balance,
      description
    );
    await Card.findByIdAndUpdate(
      cardId,
      { balance: cardUpdateResult.balance },
      { new: true }
    );

    return Response.success({
      res,
      status: STATUS_CODE.OK,
      msg: INFO_MSGS.UPDATED_SUCCESSFULLY,
      data: cardUpdateResult,
    });
  } catch (error) {
    console.error("Error -->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addFunds,
};
