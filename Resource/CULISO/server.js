const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const database = require("./database.js");

// 데이터베이스 연결
database.Connect();

app.listen(port, () => console.log(`Listening on port ${port}`));

// App 영역
app.post("/signUp", (req) => {
  const data = req.body;
  console.log("유저에게 받은 회원가입 데이터");
  console.log(data["id"]);
});

// Web 영역
// 회원 관리 초기 데이터
app.post("/adminMainMgrInitData", async (req, res) => {
  const adminID = "admin";

  const query = `select userID, userName, userNickName, createDate
                    from user
                    where adminID = ?`;

  const values = [adminID];

  const result = await database.Query(query, values);

  // console.log(result);

  // JSON 형식으로 데이터를 반환
  res.json(result);
});

// 게시판 관리 초기 데이터
app.post("/boardMgrInitData", async (req, res) => {
  const adminID = "admin";

  const query = `select userID, userName, userNickName, createDate
                    from user
                    where adminID = ?`;

  const values = [adminID];

  const result = await database.Query(query, values);

  console.log(result);

  // JSON 형식으로 데이터를 반환
  res.json(result);
});

// adminMain 상세보기 데이터 select
app.post("/adminMainViewDetails", (req, res) => {
  const { modalSendData } = req.body;
  console.log("adminMain 상세보기 데이터 : " + modalSendData);

  // JSON 형식으로 데이터를 반환
  res.json("adminMain 상세보기 데이터: " + modalSendData);
});

// adminMain 프로필카드 데이터 select
app.post("/profileViewDetails", (req, res) => {
  const { modalSendData } = req.body;
  console.log("adminMain 프로필카드 데이터 : " + modalSendData);

  // JSON 형식으로 데이터를 반환
  res.json("adminMain 프로필카드 데이터: " + modalSendData);
});

// boardMgr 상세보기 데이터 select
app.post("/boardMgrViewDetails", (req, res) => {
  const { modalSendData } = req.body;
  console.log("boardMgr 상세보기 데이터 : " + modalSendData);

  // JSON 형식으로 데이터를 반환
  res.json("boardMgr 상세보기 데이터: " + modalSendData);
});

// requestMgr 상세보기 데이터 select
app.post("/requestMgrViewDetails", (req, res) => {
  const { modalSendData } = req.body;
  console.log("requestMgr 상세보기 데이터 : " + modalSendData);

  // JSON 형식으로 데이터를 반환
  res.json("requestMgr 상세보기 데이터: " + modalSendData);
});
