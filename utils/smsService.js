const axios = require('axios');

/**
 * Sends OTP via Fast2SMS DLT route
 * @param {string} mobile - 10-digit mobile number
 * @param {string} otp - 6-digit OTP code
 */
exports.sendOtpViaSMS = async (mobile, otp) => {
  try {
    const normalizedMobile = String(mobile).replace(/\D/g, '').slice(-10);

    if (process.env.FAST2SMS_API_KEY) {
      const response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: "dlt",
          sender_id: process.env.FAST2SMS_SENDER_ID || "KHUSEM",
          message: "208502",
          variables_values: String(otp),
          numbers: normalizedMobile,
          entity_id: "1101516100000091790",
          template_id: "1107177010472380353"
        },
        {
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`[Fast2SMS] OTP sent to ${normalizedMobile}: ${otp}`, response.data);
      return true;
    }

    console.log(`[Dev Mode - Fast2SMS API Key missing] OTP for ${normalizedMobile}: ${otp}`);
    return true;
  } catch (e) {
    console.error('Fast2SMS error:', e.response?.data || e.message);
    return false;
  }
};
