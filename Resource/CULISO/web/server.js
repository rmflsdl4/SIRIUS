const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5002;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.post("/modalSendData", (req, res) => {
    const { modalSendData } = req.body;
    console.log("modalSendData : " + modalSendData);

    res.send("Received modalSendData: " + modalSendData);
});