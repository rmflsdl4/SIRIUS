const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const database = require("./database.js");
const signUp = require("./SignUp.js");
const login = require("./Login.js");
const returnData = require("./ReturnDatas.js");
// 데이터베이스 연결
database.Connect();
// app 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 세션 설정
const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "siriusDB",
  port: "3306",
  charset: "UTF8MB4",
  expiration: 24 * 60 * 60 * 1000,
});
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
  })
);
app.listen(port, () => console.log(`Listening on port ${port}`));
// App 영역

app.post("/signUp", (req) => {
  const data = req.body;
  console.log("유저에게 받은 회원가입 데이터");
  console.log(data);
  signUp.Add_NewUser(
    data.id,
    data.pw,
    data.name,
    data.nickName,
    data.sex,
    data.phoneNum,
    data.address,
    data.postNum
  );
});
app.post("/login", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await login.Check(data.id, data.pw);
  console.log(result);
  if (result) {
    res
      .status(200)
      .json({ success: true, message: "큐리소에 오신 것을 환영합니다 !" });
    req.session.userID = data.id;
    console.log("로그인 했음 현재 세션: " + req.session.userID);
  } else {
    res.status(401).json({
      success: false,
      message: "아이디 또는 비밀번호가 올바르지 않습니다.",
    });
  }
});
app.post("/addrReq", async (req, res) => {
  console.log("로그인 다음 화면으로 넘어옴 현재 세션: " + req.session.userID);
  console.log(req.body.t);
  const result = await returnData.ReqResData(req.session.userID);
  res.status(200).json({ success: true, address: result });
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
app.post("/adminMainViewDetails", async (req, res) => {
  const { userID } = req.body;
  const adminID = "admin";

  const query = `select 
                        b.boardName as boardName,
                        c.content as content,
                        c.contentsDate as contentsDate,
                        c.recommend as recommend
                    from board as b inner join contents as c
                        on b.boardID = c.boardID
                    where adminID = ? and userID = ?`;

  const values = [adminID, userID];

  const result = await database.Query(query, values);

  // console.log("adminMain 상세보기 데이터 : " + userID);

  // JSON 형식으로 데이터를 반환
  res.json(result);
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
