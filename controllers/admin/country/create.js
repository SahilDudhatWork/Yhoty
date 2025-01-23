const Country = require("../../../models/country");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const {
  STATUS_CODE,
  ERROR_MSGS,
  INFO_MSGS,
} = require("../../../helper/constant");

const create = async (req, res) => {
  const { logger, body } = req;
  try {
    const { countryName } = body;
    const checkDuplicate = await Country.findOne({ countryName });

    if (checkDuplicate) {
      const obj = {
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: `Country Name ${ERROR_MSGS.DATA_EXISTS}`,
      };
      return Response.success(obj);
    }
    const saveData = await Country.create(body);

    const obj = {
      res,
      status: STATUS_CODE.CREATED,
      msg: INFO_MSGS.CREATED_SUCCESSFULLY,
      data: saveData,
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
