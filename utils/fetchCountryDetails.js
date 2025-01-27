const User = require("../models/user");

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
          "countryDetails.exchangeRate": 1,
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
  fetchCountryDetails,
};
