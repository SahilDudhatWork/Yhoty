const { ObjectId } = require("mongoose").Types;
const WalletTransFunds = require("../../../models/walletTransFunds");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const { paginationResponse } = require("../../../utils/paginationFormate");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const getAll = async (req, res) => {
  let { logger, query, userId } = req;
  try {
    let { keyWord, page, limit } = query;

    let qry = { userId: new ObjectId(userId) };

    if (keyWord) {
      qry = {
        $or: [
          { status: { $regex: keyWord, $options: "i" } },
          { refTransId: { $regex: keyWord, $options: "i" } },
        ],
      };
    }

    const offset = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = limit * (offset - 1);

    let [result] = await WalletTransFunds.aggregate([
      { $match: qry },
      {
        $facet: {
          paginatedResult: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                __v: 0,
                token: 0,
                password: 0,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    let response = await paginationResponse(req, res, offset, limit, result);

    const statusCode =
      response.response.length > 0 ? STATUS_CODE.OK : STATUS_CODE.OK;
    const message =
      response.response.length > 0
        ? INFO_MSGS.SUCCESS
        : ERROR_MSGS.DATA_NOT_FOUND;

    return Response[statusCode === STATUS_CODE.OK ? "success" : "error"]({
      req,
      res,
      status: statusCode,
      msg: message,
      data: response,
    });
  } catch (error) {
    console.error("error-->", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  getAll,
};
