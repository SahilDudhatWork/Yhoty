const Country = require("../../../models/country");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const { paginationResponse } = require("../../../utils/paginationFormate");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const getAll = async (req, res) => {
  let { logger, query } = req;
  try {
    let { keyWord, page, limit } = query;

    let qry = {};

    if (keyWord) {
      qry = {
        $or: [
          { countryName: { $regex: keyWord, $options: "i" } },
          { code: { $regex: keyWord, $options: "i" } },
          { isoCode: { $regex: keyWord, $options: "i" } },
        ],
      };
    }

    const offset = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = limit * (offset - 1);

    let [result] = await Country.aggregate([
      { $match: qry },
      {
        $facet: {
          paginatedResult: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                __v: 0,
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
