const axios = require("axios");
require("dotenv").config();

async function getAccessToken() {

    try {

        const consumerKey = process.env.CONSUMER_KEY;
        const consumerSecret = process.env.CONSUMER_SECRET;

        const auth = Buffer.from(
            `${consumerKey}:${consumerSecret}`
        ).toString("base64");

        const response = await axios.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            }
        );

        return response.data.access_token;

    } catch (error) {

        console.log("Authentication Failed");

        console.log(
            error.response
                ? error.response.data
                : error.message
        );

    }

}

module.exports = getAccessToken;