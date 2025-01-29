const { ObjectId } = require("mongoose").Types;
const User = require("../../../models/user");
const Card = require("../../../models/card");
const Response = require("../../../helper/response");
const { handleException } = require("../../../helper/exception");
const {
  STATUS_CODE,
  INFO_MSGS,
  ERROR_MSGS,
} = require("../../../helper/constant");

const getDetails = async (req, res) => {
  const { logger, userId, query } = req;
  try {
    const { country } = query;
    const uId = new ObjectId(userId);

    if (!country) {
      return Response.error({
        res,
        status: STATUS_CODE.BAD_REQUEST,
        msg: `Country ${ERROR_MSGS.KEY_REQUIRED}`,
      });
    }

    const countryDetails = await fetchCountryDetails(uId);
    const cardDetails = await Card.findOne({
      code: countryDetails.code,
      userId: uId,
    });
    const cardBalance = cardDetails?.balance ?? 0;

    let balance = 0;
    if (country === "UK") {
      balance = cardBalance * countryDetails.ukRate;
    } else if (country === "USA") {
      balance = cardBalance * countryDetails.usaRate;
    } else if (country === "FRANCE") {
      balance = cardBalance * countryDetails.franceRate;
    }

    const response = {
      countryName: countryDetails.countryName,
      code: countryDetails.code,
      isoCode: countryDetails.isoCode,
      currency: countryDetails.currency,
      balance,
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

const fetchCountryDetails = async (userId) => {
  try {
    const userDetails = await User.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $lookup: {
          from: "countries",
          localField: "country",
          foreignField: "code",
          as: "countryDetails",
        },
      },
      {
        $unwind: {
          path: "$countryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "countryDetails.countryName": 1,
          "countryDetails.code": 1,
          "countryDetails.isoCode": 1,
          "countryDetails.currency": 1,
          "countryDetails.usaRate": 1,
          "countryDetails.usaRate": 1,
          "countryDetails.franceRate": 1,
          "countryDetails.ukRate": 1,
        },
      },
    ]);

    const { countryDetails } = userDetails[0];

    return countryDetails;
  } catch (error) {
    console.error("Error in fetchCountryDetails:", error);
  }
};

module.exports = {
  getDetails,
};
