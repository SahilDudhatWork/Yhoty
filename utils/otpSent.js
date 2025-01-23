const Otp = require("../models/otp");
const { VerificationEmail } = require("./nodemailerOtp");

const otpSent = async (email, OtpType) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpData = { email, otp };

    await VerificationEmail(email, otp, OtpType);

    await Otp.findOneAndDelete({ email });
    await Otp.create(otpData);

    setTimeout(
      async () => {
        await Otp.findOneAndDelete({ otp });
      },
      5 * 60 * 1000
    ); // 5 minutes
    return;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  otpSent,
};
