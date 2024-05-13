const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.post("/signUp", (req) => {
  const data = req.body;
  console.log("유저에게 받은 회원가입 데이터");
  console.log(data['id']);
});


// Web 영역
app.post("/viewDetailsModalSendData", (req, res) => {
    const { modalSendData } = req.body;
    console.log("modalSendData : " + modalSendData);

    // JSON 형식으로 데이터를 반환
    res.json("Received modalSendData: " + modalSendData);
});