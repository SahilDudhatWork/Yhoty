const User = require("../models/user");
const Admin = require("../models/admin");

const hendleModel = async (type) => {
  try {
    let Model;
    if (type === "user") {
      Model = User;
    } else if (type === "admin") {
      Model = Admin;
    }
    return Model;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  hendleModel,
};
