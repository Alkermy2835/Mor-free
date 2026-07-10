
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stkPush = require("./stkpush");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {

    res.send("Mor-Free Booking API is Running");

});

app.post("/book", async (req, res) => {

    const booking = req.body;

    console.log(booking);

    res.json({
        success:true,
        message:"Booking received successfully.",
        booking
    });

});

const PORT = process.env.PORT || 5000;
app.get("/token", async (req, res) => {

    const token = await getAccessToken();

    res.json({
        access_token: token
    });

});

app.post("/stk-push", async (req, res) => {

    const { phone, amount } = req.body;

    const response = await stkPush(phone, amount);

    res.json(response);

});

app.post('/stk-push', async (req, res) => {
    try {
        const { phone, amount, bookingId } = req.body;
        const stkResponse = await stkPush(phone, amount);
        res.json({ success: true, data: stkResponse });
    } catch (error) {
        console.error("STK ERROR:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});








app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`);

});
const getAccessToken = require("./auth");



// Route to trigger STK Push
app.post('/stk-push', async (req, res) => {
    const { phone, amount, bookingId } = req.body;
    try {
        const response = await stkPush(phone, amount);
        res.json(response);
    } catch (error) {
    console.log("STK PUSH ERROR:", error); // ADD THIS LINE
    res.status(500).json({ error: error.message });
}
});

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
});
