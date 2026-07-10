require('dotenv').config();
const axios = require('axios');
const moment = require('moment');

const { CONSUMER_KEY, CONSUMER_SECRET, SHORTCODE, PASSKEY } = process.env;

const getAccessToken = async () => {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: { Authorization: `Basic ${auth}` }
    });
    return response.data.access_token;
}

const stkPush = async (phone, amount) => {
    const token = await getAccessToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString("base64");

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: SHORTCODE,
            PhoneNumber: phone,
            CallBackURL: process.env.CALLBACK_URL,
            AccountReference: "Mor-Free",
            TransactionDesc: "Booking Payment"
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}

module.exports = stkPush;