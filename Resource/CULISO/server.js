
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const app = express();
const http = require("http");
const https = require("https");
const expressSanitizer = require("express-sanitizer");
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const port = process.env.PORT || 443;
const cors = require("cors");
const util = require("util");
const database = require("./database.js");
const signUp = require("./SignUp.js");
const login = require("./Login.js");
const returnData = require("./ReturnDatas.js");
const profile = require("./Profile.js");
const ChatGPT = require("./ChatGPT.js");
const axios = require('axios');
const findingID = require('./FindingID.js');
const findingPW = require('./FindingPW.js');
const path = require('path');
const multer = require('multer');
var fs = require('fs');

// 플래그로 https 설정
const flag = true;
const keyPath = flag ? fs.readFileSync("./config/privkey.pem") : null;
const certPath = flag ? fs.readFileSync("./config/fullchain.pem") : null;
// private key 가져오기
const options = {
  key: keyPath,
  cert: certPath,
};
app.use(cors());
// **이미지 파일 폴더에 저장**
const imagePath = './application/public/';
// 정적 파일 제공 설정
app.use(express.static(imagePath));
// 웹앱 테스트
app.use(express.static(path.join(__dirname, './application/build')));

// 리액트 빌드 파일을 서빙
app.use(express.static(path.join(__dirname, 'build')));

// API 요청을 리액트 서버로 프록시
app.use('/api', createProxyMiddleware({ target: 'http://13.209.80.79:3000', changeOrigin: true }));

// 나머지 요청을 리액트 애플리케이션으로 전달
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// 데이터베이스 연결
database.Connect();
// app 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitizer());
// 세션 설정
const sessionStore = new MySQLStore({
  host: "siriusdb.cmf8kaym3rs4.ap-northeast-2.rds.amazonaws.com",
  user: "dbuser192352",
  password: "ce123456",
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
if(options.key && options.cert){
  https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS Listening on ${port}`);
  });
}
else{
  http.createServer(app).listen(port, () => {
    console.log(`HTTP Listening on ${port}`);
  });
}


// 토큰으로 아이디 가져오기
async function GetUserID(token){
  try{
    const session = await sessionStore.get(token);
    console.log("요청한 아이디: " + session.userID);
    if(session) return session.userID;
  }
  catch(error){
    return error;
  }
}

// App 영역
app.get("/",function(req,res){
  res.render('index');
});
app.post("/signUp", (req) => {
  const data = req.body;
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
  console.log("로그인 경로 ");
  const data = req.body;
  const result = await login.Check(data.id, data.pw);
  if (result) {
    res.status(200).json({
      success: true,
      message: "큐리소에 오신 것을 환영합니다 !",
      token: req.sessionID,
    });
    req.session.userID = data.id;
  } else {
    res.status(401).json({
      success: false,
      message: "아이디 또는 비밀번호가 올바르지 않습니다.",
    });
  }
});
app.post("/addrReq", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  
  try {
    const userID = await GetUserID(token);

    const addr = await returnData.GetAddr(userID);
    if (addr) res.status(200).json({ success: true, address: addr });
    else
      res
        .status(404)
        .json({ success: false, message: "주소를 찾을 수 없습니다." });
  } catch (error) {
    console.error("서버 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});
app.post("/sexReq", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  // 세션 스토어에서 토큰으로 세션을 가져오기
  try {
    const userID = await GetUserID(token);

    const sex = await returnData.GetSex(userID);
    if (sex) res.status(200).json({ success: true, sex: sex });
    else
      res
        .status(404)
        .json({ success: false, message: "주소를 찾을 수 없습니다." });
  } catch (error) {
    console.error("서버 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});
app.post("/nameReq", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  // 세션 스토어에서 토큰으로 세션을 가져오기
  try {
    const userID = await GetUserID(token);

    const name = await returnData.GetName(userID);
    if (name) res.status(200).json({ success: true, name: name });
    else
      res
        .status(404)
        .json({ success: false, message: "주소를 찾을 수 없습니다." });
  } catch (error) {
    console.error("서버 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});
app.post("/updateProfile", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const {pw} = req.body;
  try {
    const userID = await GetUserID(token);
    
    const result = await profile.InUpdatePage(userID, pw);
    res.status(200).json({success: true, flag: result});
  } catch (error) {
    console.error("서버 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});
app.post("/getUserData", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const userID = await GetUserID(token);

    const result = await profile.GetInfo(userID);
    res.status(200).json({success: true, row: result});
  } catch (error) {
    console.error("서버 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
})
app.post("/updateProfileData", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const data = req.body;
  try {
    const userID = await GetUserID(token);
    
    const result = profile.UpdateInfo(
      data.name,
      data.nickName,
      data.sex,
      data.phoneNum,
      data.address,
      data.postNum,
      userID
    );
    if(result){
      console.log(`${userID}님의 회원정보 업데이트 성공`);
      res.status(200).json({success: true});
    }
    else{
      console.log(`${userID}님의 회원정보 업데이트 실패`);
      res.status(401).json({success: false});
    }
  } catch (error) {
    console.error("서버 오류 발생:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
})






// Web 영역
// 회원 관리 초기 데이터
app.post("/adminMainInitData", async (req, res) => {
  const adminID = "admin";

  const query = `select userID, userName, userNickName, createDate
                    from user
                    where adminID = ? and deleteFlag = ?`;

  const values = [adminID, "FALSE"];

  const result = await database.Query(query, values);

  // JSON 형식으로 데이터를 반환
  res.json(result);
});

// 게시판 관리 초기 데이터
app.post("/boardMgrInitData", async (req, res) => {
  const adminID = "admin";

  const query = `SELECT 
                        b.boardID as boardID,
                        b.boardName as boardName,
                        COALESCE(count(c.content), 0) as contentTotal,
                        b.boardDate
                    FROM board as b 
                    LEFT JOIN contents as c
                        ON b.boardID = c.boardID
                    WHERE b.adminID = ?
                    GROUP BY b.boardID, b.boardName, b.boardDate`;

  const values = [adminID];

  const result = await database.Query(query, values);

  // JSON 형식으로 데이터를 반환
  res.json(result);
});

// 기기관리 초기 데이터
app.post("/deviceMgrInitData", async (req, res) => {
  const adminID = "admin";

  const query = `SELECT 
                        productNum,
                        modelName,
                        CASE 
                            WHEN type = 1 THEN '전등'
                            WHEN type = 2 THEN '커튼'
                            WHEN type = 3 THEN '에어컨'
                            WHEN type = 4 THEN 'TV'
                            WHEN type = 5 THEN '보일러'
                            ELSE '등록되지 않은 가전제품' -- 예기치 않은 값을 처리하기 위한 기본값
                        END AS type,
                        company,
                        registrationDate,
                        productImgUrl
                    FROM product
                    `;

  const result = await database.Query(query);

  console.log(result);

  // JSON 형식으로 데이터를 반환
  res.json(result);
});

// 요청관리 초기 데이터
app.post("/requestMgrInitData", async (req, res) => {
  const adminID = "admin";

  const requestCompletedQuery = `select 
                                        d.id as deviceRequestID,
                                        u.userID as userID,
                                        u.userName as userName,
                                        u.userNickName as userNickName,
                                        CASE 
                                            WHEN d.state = 'T' THEN '요청 완료'
                                            WHEN d.state = 'F' THEN '요청 미완료'
                                            ELSE '상태 미정의'
                                        END AS state,
                                        d.requestTime as requestTime
                                    from user as u inner join deviceRequest as d
                                        on u.userID = d.userID
                                    where d.state = 'T' and u.adminID = ?`;

  const requestNotCompletedQuery = `select 
                                        d.id as deviceRequestID,
                                        u.userID as userID,
                                        u.userName as userName,
                                        u.userNickName as userNickName,
                                        CASE 
                                            WHEN d.state = 'T' THEN '요청 완료'
                                            WHEN d.state = 'F' THEN '요청 미완료'
                                            ELSE '상태 미정의'
                                        END AS state,
                                        d.requestTime as requestTime
                                    from user as u inner join deviceRequest as d
                                        on u.userID = d.userID
                                    where d.state = 'F' and u.adminID = ?`;

  const values = [adminID];

  // JSON 형식으로 데이터를 반환
  try {
    // 세 개의 쿼리를 각각 실행
    const requestCompletedResult = await database.Query(
      requestCompletedQuery,
      values
    );
    const requestNotCompletedResult = await database.Query(
      requestNotCompletedQuery,
      values
    );

    // 두 결과를 객체로 묶어 JSON 형식으로 반환
    res.json({
      requestCompletedResult: requestCompletedResult,
      requestNotCompletedResult: requestNotCompletedResult,
    });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ***** 상세보기 데이터******
// adminMain 상세보기 데이터 select
app.post("/adminMainViewDetails", async (req, res) => {
  const { modalSendData } = req.body;
  const adminID = "admin";

  console.log("modalSendData : " + modalSendData);

  const contentListQuery = `select 
                                c.contentsNum as contentsNum,
                                b.boardName as boardName,
                                c.content as content,
                                c.contentsDate as contentsDate,
                                c.views as views,
                                c.recommend as recommend
                            from board as b inner join contents as c
                                on b.boardID = c.boardID
                            where adminID = ? and userID = ?`;

  const deviceRequestListQuery = `SELECT 
                                        productName, 
                                        CASE 
                                            WHEN type = 1 THEN '전등'
                                            WHEN type = 2 THEN '커튼'
                                            WHEN type = 3 THEN '에어컨'
                                            WHEN type = 4 THEN 'TV'
                                            WHEN type = 5 THEN '보일러'
                                            ELSE '등록되지 않은 가전제품' -- 예기치 않은 값을 처리하기 위한 기본값
                                        END AS type, 
                                        company, 
                                        title, 
                                        requestTime, 
                                        productImgUrl
                                    FROM 
                                        deviceRequest
                                    where adminID = ? and userID = ?`;

  const contentBoardListQuery = `select b.boardID, b.boardName
                                    from board as b inner join contents as c
                                        on b.boardID = c.boardID
                                    where adminID = ? and userID = ?`;

  const values = [adminID, modalSendData];

  // console.log("adminMain 상세보기 데이터 : " + userID);

  // JSON 형식으로 데이터를 반환
  try {
    // 세 개의 쿼리를 각각 실행
    const contentListResult = await database.Query(contentListQuery, values);
    const deviceRequestListResult = await database.Query(
      deviceRequestListQuery,
      values
    );
    const contentBoardListResult = await database.Query(
      contentBoardListQuery,
      values
    );

    // console.log(contentListResult);
    // console.log(deviceRequestListResult);

    // 두 결과를 객체로 묶어 JSON 형식으로 반환
    res.json({
      contentListResult: contentListResult,
      deviceRequestListResult: deviceRequestListResult,
      contentBoardListResult: contentBoardListResult,
    });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// adminMain 프로필카드 데이터 select
app.post("/profileViewDetails", async (req, res) => {
  const { modalSendData } = req.body;
  const adminID = "admin";
  // console.log("adminMain 프로필카드 데이터 : " + modalSendData);

  const query = `select 
                        u.userName as userName, 
                        u.userNickName as userNickName,
                        z.hubID as hubID,
                        u.address as address,
                        u.postNum as postNum,
                        u.userPhoneNum as userPhoneNum
                    from user as u inner join zigbeeHub as z
                        on u.userID = z.userID
                    where adminID = ? and u.userID = ?`;

  const values = [adminID, modalSendData];

  try {
    const result = await database.Query(query, values);

    console.log(result);

    // JSON 형식으로 데이터를 반환
    res.json(result);
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// boardMgr 상세보기 데이터 select
app.post("/boardMgrViewDetails", async (req, res) => {
  const { modalSendData } = req.body;
  const adminID = "admin";
  // console.log("adminMain 프로필카드 데이터 : " + modalSendData);

  const query = `select 
                        c.contentsNum as contentsNum,
                        b.boardName as boardName,
                        c.content as content,
                        c.contentsDate as contentsDate,
                        c.recommend as recommend,
                        c.views as views
                    from board as b inner join contents as c
                        on b.boardID = c.boardID
                    where b.adminID = ? and b.boardID = ?`;

  const values = [adminID, modalSendData];

  try {
    const result = await database.Query(query, values);

    console.log(result);

    // JSON 형식으로 데이터를 반환
    res.json(result);
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// requestMgr 상세보기 데이터 select
app.post("/requestMgrViewDetails", async (req, res) => {
  const { modalSendData } = req.body;
  const adminID = "admin";
  // console.log("adminMain 프로필카드 데이터 : " + modalSendData);

  const query = `select 
                        productImgUrl,
                        company,
                        productName,
                        CASE 
                            WHEN type = 1 THEN '전등'
                            WHEN type = 2 THEN '커튼'
                            WHEN type = 3 THEN '에어컨'
                            WHEN type = 4 THEN 'TV'
                            WHEN type = 5 THEN '보일러'
                            ELSE '등록되지 않은 가전제품'
                        END AS type,
                        title
                    from deviceRequest
                    where ID = ? and adminID = ?`;

  const values = [modalSendData, adminID];

  try {
    const result = await database.Query(query, values);

    console.log(result);

    // JSON 형식으로 데이터를 반환
    res.json(result);
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 테이블 Delete
app.post("/deleteTable", async (req, res) => {
  const { modalSendData, buttonId } = req.body;
  // const adminID = 'admin';

  let modalSendDataArray;

  // modalSendData가 문자열인 경우와 배열인 경우를 구분하여 처리
  if (typeof modalSendData === "string") {
    modalSendDataArray = modalSendData.split(",");
  } else if (Array.isArray(modalSendData)) {
    modalSendDataArray = modalSendData;
  } else {
    console.error("Invalid modalSendData format:", modalSendData);
    res.status(400).json({ error: "Invalid modalSendData format" });
    return;
  }

  let query;

  switch (buttonId) {
    case "AdminMainDelete":
      query = `UPDATE user
                    SET deleteFlag = TRUE
                    WHERE userID IN (?)`;
      break;
    case "AdminMainDetailDelete":
      query = `DELETE FROM contents
                    WHERE contentsNum IN (?)`;
      break;
    case "BoardMgrDelete":
      query = `DELETE FROM board
                    WHERE boardID IN (?)`;
      break;
    case "BoardMgrDetailDelete":
      query = `DELETE FROM contents
                    WHERE contentsNum IN (?)`;
      break;
    case "DeviceMgrDelete":
      query = `DELETE FROM product
                WHERE productNum IN (?)`;
      break;
  }

  try {
    await Promise.all(
      modalSendDataArray.map(async (deleteID) => {
        await database.Query(query, [deleteID]);
      })
    );
    res.status(200).json({ message: "Successfully deleted users" });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// boardMgr 상세보기 데이터 update
app.post("/updateTable", async (req, res) => {
  const { modalSendData, formData } = req.body;
  const adminID = "admin";

  const query = `UPDATE board
                    SET 
                        boardName = ?,
                        boardIntro = ?,
                        boardRead = ?, 
                        boardWrite = ?, 
                        boardComWrite = ? 
                    WHERE
                        boardID = ?`;

  const values = [];

  // formData의 속성들을 순회하면서 value 배열에 추가합니다.
  formData.forEach((value) => {
    values.push(value);
  });
  values.push(modalSendData);

  try {
    await database.Query(query, values);
    res.status(200).json({ message: "Update successful" }); // 성공 응답 추가
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// boardMgr 상세보기 데이터 insert
app.post("/insertTable", async (req, res) => {
  const { formData, buttonId } = req.body;
  const adminID = "admin";

  switch (buttonId) {
    case "boardMgrInsertBtn":
      query = `INSERT INTO board (boardName, boardIntro, boardRead, boardWrite, boardComWrite, adminID) 
                    VALUES (?, ?, ?, ?, ?, ?)`;
      break;
  }

  const values = [];

  // formData의 속성들을 순회하면서 value 배열에 추가합니다.
  formData.forEach((value) => {
    values.push(value);
  });
  values.push(adminID);

  try {
    await database.Query(query, values);
    res.status(200).json({ message: "Insert successful" }); // 성공 응답 추가
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// AI


let openaiApiKey = process.env.OPENAI_API_KEY;


app.post('/chat', async (req, res) => {
  const { message, latitude, longitude } = req.body;
  const session = req.session;
  
  if (!session.messages) {
    session.messages = [];
  }

  const token = req.headers.authorization.replace("Bearer ", "");
  // 세션 스토어에서 토큰으로 세션을 가져오기
  const userID = await GetUserID(token);

  session.messages.push({ role: 'user', content: message });
  const cityMatch = message.match(/서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주/);
  const timeMatch = message.match(/(\d{1,2})시/);

  const specificTime = timeMatch ? parseInt(timeMatch[1], 10) : undefined;

  if (message.toLowerCase().includes('날씨')) {
    if (cityMatch) {
      const city = cityMatch[0];
      if (specificTime !== undefined) {
        try {
          const weatherMessage = await ChatGPT.getWeatherForecastByCityWithMessage(city, specificTime);
          session.messages.push({ role: 'assistant', content: weatherMessage });
          res.json({ response: weatherMessage });
        } catch (error) {
          console.error('Error in /chat endpoint:', error.message);
          res.status(500).send('날씨 예보 정보를 가져오는 데 문제가 발생했습니다.');
        }
        return;
      } else if (message.toLowerCase().includes('예보')) {
        try {
          const weatherMessage = await ChatGPT.getWeatherForecastByCityWithMessage(city);
          session.messages.push({ role: 'assistant', content: weatherMessage });
          res.json({ response: weatherMessage });
        } catch (error) {
          console.error('Error in /chat endpoint:', error.message);
          res.status(500).send('날씨 예보 정보를 가져오는 데 문제가 발생했습니다.');
        }
        return;
      } else {
        try {
          const weatherMessage = await ChatGPT.getCurrentWeatherByCityWithMessage(city);
          session.messages.push({ role: 'assistant', content: weatherMessage });
          res.json({ response: weatherMessage });
        } catch (error) {
          console.error('Error in /chat endpoint:', error.message);
          res.status(500).send('현재 날씨 정보를 가져오는 데 문제가 발생했습니다.');
        }
        return;
      }
    } else if (latitude && longitude) {
      if (specificTime !== undefined) {
        try {
          const weatherMessage = await ChatGPT.getWeatherForecastByLocationWithMessage(latitude, longitude, specificTime);
          session.messages.push({ role: 'assistant', content: weatherMessage });
          res.json({ response: weatherMessage });
        } catch (error) {
          console.error('Error in /chat endpoint:', error.message);
          res.status(500).send('날씨 예보 정보를 가져오는 데 문제가 발생했습니다.');
        }
        return;
      } else if (message.toLowerCase().includes('예보')) {
        try {
          const weatherMessage = await ChatGPT.getWeatherForecastByLocationWithMessage(latitude, longitude);
          session.messages.push({ role: 'assistant', content: weatherMessage });
          res.json({ response: weatherMessage });
        } catch (error) {
          console.error('Error in /chat endpoint:', error.message);
          res.status(500).send('날씨 예보 정보를 가져오는 데 문제가 발생했습니다.');
        }
        return;
      } else {
        try {
          const weatherMessage = await ChatGPT.getCurrentWeatherByLocationWithMessage(latitude, longitude);
          session.messages.push({ role: 'assistant', content: weatherMessage });
          res.json({ response: weatherMessage });
        } catch (error) {
          console.error('Error in /chat endpoint:', error.message);
          res.status(500).send('현재 날씨 정보를 가져오는 데 문제가 발생했습니다.');
        }
        return;
      }
    } else {
      const noLocationMessage = '위치 정보를 가져올 수 없습니다.';
      session.messages.push({ role: 'assistant', content: noLocationMessage });
      res.json({ response: noLocationMessage });
      return;
    }
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: session.messages,
        max_tokens: 1500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        }
      }
    );

    const botMessage = response.data.choices[0].message.content.trim();
    session.messages.push({ role: 'assistant', content: botMessage });
    res.json({ response: botMessage });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
  }


  let insertQuery = `INSERT INTO chat(userID, userChatContext, senderType) VALUES`;

  for(let idx = 0; idx < session.messages.length; idx++){
    insertQuery += "(";
    if(session.messages[idx].role === "user"){
      insertQuery += `'${userID}', '${session.messages[idx].content}', 'U'`;
    }
    else{
      insertQuery += `'${userID}', '${session.messages[idx].content}', 'A'`;
    }
    insertQuery += ")";
    if(idx < session.messages.length - 1){
      insertQuery += ", ";
    }
  }
  try{
    await database.Query(insertQuery);

    console.log("채팅 기록에 성공했습니다.");
  }
  catch(error){
    console.log("채팅 기록에 실패했습니다: ", error.message);
  }
  
});
app.post("/getChatLog", async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  // 세션 스토어에서 토큰으로 세션을 가져오기
  try {
    const userID = await GetUserID(token);

    const logData = await returnData.GetChatLog(userID);
    res.status(200).json({success: true, log : logData});
  }
  catch(err){
    res.status(401).json({success: false});
    console.log(err);
  }
    
});
// ************커뮤니티************
// 커뮤니티 메인 메뉴
// **이미지 파일 폴더에 저장**
let folderHeadUrl = "./application/public/uploadFile";
let folder;

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1이 필요하며, 두 자리로 포맷
        const day = date.getDate().toString().padStart(2, '0'); // 일은 두 자리로 포맷
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const token = req.headers.authorization.replace("Bearer ", "");
        const userId = await GetUserID(token);
        
        folder = `${folderHeadUrl}/${userId}/`;

        // uploadFile 폴더가 없으면 생성
        if (!fs.existsSync(folderHeadUrl)) {
            fs.mkdirSync(folderHeadUrl, { recursive: true });
        }

        // 해당 유저 아이디 폴더가 없으면 생성
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        // 이미지 파일을 해당 날짜 폴더에 저장
        cb(null, folder);
    }, 
    filename: (req, file, cb) => {
        // 이미지 번호 증가
        console.log(file)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

// app.use('/images', express.static('./application/public/uploadFile/'));

// ************커뮤니티************
// 커뮤니티 메인 메뉴
app.post("/MenuBarValue", async (req, res) => {
    const query = `select 
                        boardID,
                        boardName
                    from board
                    where boardRead = 'A' or boardRead = 'U'`;

    const result = await database.Query(query);

    // JSON 형식으로 데이터를 반환
    res.json(result);
});

// 유저 정보 select
app.post("/UserInfoValue", async (req, res) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);
    
    const query = `select 
                        userID,
                        userName,
                        userNickName, 
                        createDate,
                        profileUrl
                    from user
                    where deleteFlag = false and userID = ?`;

    const value = [userID];
    const result = await database.Query(query, value);

    // JSON 형식으로 데이터를 반환
    res.json(result);
});

// 커뮤니티 select
app.post("/ContentsValue", async (req, res) => {
  const { boardID } = req.body;
  let result;

  if(boardID === 1){
      const query = `SELECT 
                      b.boardName as boardName, 
                      c.contentsNum as contentsNum, 
                      c.contentsTitle as contentsTitle, 
                      c.content as content, 
                      c.recommend as recommend, 
                      c.views as views,
                      c.contentsDate as contentsDate
                  FROM board AS b
                  INNER JOIN contents AS c ON b.boardID = c.boardID
                  INNER JOIN (
                      SELECT b.boardName, MAX(c.recommend) AS max_recommend
                      FROM board AS b
                      INNER JOIN contents AS c ON b.boardID = c.boardID
                      GROUP BY b.boardName
                  ) AS maxContents 
                      ON b.boardName = maxContents.boardName AND c.recommend = maxContents.max_recommend
                  order by contentsDate desc`;
      
      result = await database.Query(query);
  }
  else {
      const query = `select 
                          c.contentsNum as contentsNum, 
                          b.boardName as boardName,
                          c.contentsTitle as contentsTitle, 
                          c.content as content, 
                          c.recommend as recommend, 
                          c.views as views,
                          c.contentsDate as contentsDate
                      from board as b inner join contents as c
                          on b.boardID = c.boardID
                      where b.boardID = ?
                      order by contentsDate desc`;

      const value = [boardID];
      result = await database.Query(query, value);
  }

  for (let i = 0; i < result.length; i++) {
      const contentsNum = result[i].contentsNum;
      const fileQuery = `SELECT fileUrl, fileName 
                          FROM file 
                          WHERE contentsNum = ? 
                          ORDER BY fileUploadNum ASC 
                          LIMIT 1`;
      const fileResult = await database.Query(fileQuery, [contentsNum]);

      if (fileResult.length > 0) {
          result[i].fileUrl = fileResult[0].fileUrl;
          result[i].fileName = fileResult[0].fileName;
      } else {
          result[i].fileUrl = null;
          result[i].fileName = null;
      }
      console.log(result[i].fileUrl);
  }
  // JSON 형식으로 데이터를 반환
  res.json(result);
});


// 커뮤니티 게시글 select
app.post("/BoardContentsValue", async (req, res) => {
    const { contentsNum } = req.body;
    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);
    console.log("userID : " + userID);

    const contentsQuery = `select 
                                u.userID as userID,
                                u.userName as userName,
                                u.createDate as createDate,
                                u.profileUrl as profileUrl,
                                c.contentsNum as contentsNum,
                                c.contentsTitle as contentsTitle,
                                c.content as content,
                                c.recommend as recommend,
                                c.contentsDate as contentsDate,
                                c.views as views,
                                b.boardID as boardID,
                                b.boardName as boardName
                            from contents as c 
                            inner join user as u on c.userID = u.userID
                            inner join board as b on c.boardID = b.boardID
                            where c.contentsNum = ?`;

    const commentQuery = `select 
                                u.userID as userID,
                                u.userName as userName,
                                u.createDate as createDate,
                                u.profileUrl as profileUrl,
                                c.commentNum as commentNum,
                                c.commentContent as commentContent,
                                c.commentDate as commentDate
                            from comment as c inner join user as u
                                on c.userID = u.userID
                            where c.contentsNum = ?`;

    const fileQuery = `select 
                            fileUploadNum,
                            fileUrl,
                            fileName
                        from file
                        where contentsNum = ?`;

    const contentsRecommendQuery = `select count(userID) as count from contentsRecommend
                                    where userID = ? and contentsNum = ?`;
    
    const value = [contentsNum];
    const contentsRecommendvalue = [userID, contentsNum];

    try {
        // 두 개의 쿼리를 각각 실행
        const contentsResult = await database.Query(contentsQuery, value);
        const commentResult = await database.Query(commentQuery, value);
        const fileResult = await database.Query(fileQuery, value);
        const contentsRecommendResult = await database.Query(contentsRecommendQuery, contentsRecommendvalue);

        // 두 결과를 객체로 묶어 JSON 형식으로 반환
        res.json({
            contentsResult: contentsResult,
            commentResult: commentResult,
            fileResult: fileResult,
            contentsRecommendResult: contentsRecommendResult,
            sessionUserID: { userID: userID },
        });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 댓글 select
app.post("/CommentSelectValue", async (req, res) => {
    const { contentsNum } = req.body;

    const query = `select 
                        u.userID as userID,
                        u.userName as userName,
                        u.createDate as createDate,
                        u.profileUrl as profileUrl,
                        c.commentNum as commentNum,
                        c.commentContent as commentContent,
                        c.commentDate as commentDate
                    from comment as c inner join user as u
                        on c.userID = u.userID
                    where c.contentsNum = ?`;
    
    const value = [contentsNum];

    try {
        // 두 개의 쿼리를 각각 실행
        const result = await database.Query(query, value);

        // 두 결과를 객체로 묶어 JSON 형식으로 반환
        res.json(result);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 댓글 insert
app.post("/CommentInsertValue", async (req, res) => {
    const { comment, contentsNum } = req.body;
    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);
    console.log("userID : " + userID);

    const query = `insert into comment(commentContent, userID, contentsNum)
                    values(?, ?, ?)`;
    
    const value = [comment, userID, contentsNum];

    try {
        await database.Query(query, value);
        res.status(200).json({ message: 'Successfully deleted users' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 댓글 delete
app.post("/CommentDeleteValue", async (req, res) => {
    const { commentNum } = req.body;
    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);
    console.log("userID : " + userID);

    const query = `delete from comment
                    where commentNum = ?`;
    
    const value = [commentNum];

    try {
        await database.Query(query, value);
        res.status(200).json({ message: 'Successfully deleted users' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 Update
app.post("/PrevPageValue", async (req, res) => {
    const { contentsNum } = req.body;

    const contentsQuery = `select 
                                contentsNum,
                                contentsTitle,
                                content
                            from contents
                            where contentsNum = ?`;

    const fileQuery = `select 
                            fileUploadNum,
                            fileUrl,
                            fileName
                        from file
                        where contentsNum = ?`;
    
    const value = [contentsNum];

    try {
        // 두 개의 쿼리를 각각 실행
        const contentsResult = await database.Query(contentsQuery, value);
        const fileResult = await database.Query(fileQuery, value);

        // 두 결과를 객체로 묶어 JSON 형식으로 반환
        res.json({
            contentsResult: contentsResult,
            fileResult: fileResult
        });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 쓰기 게시판 목록
app.post("/CheckBoard", async (req, res) => {
    const query = `SELECT 
                        boardID,
                        boardName
                    FROM 
                        board
                    WHERE 
                        boardName != '모아보기' AND
                        (boardWrite = 'A' OR boardWrite = 'U')
                    order by boardID`;

    try {
        const result = await database.Query(query);
        res.json(result);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 수정
app.post("/ContentsUpdate", upload.array('images', 10), async (req, res) => {
    const { title, contents, contentsNum, imgUrl, delImgName } = req.body;
    const files = req.files;
    let fileUrl;
    let dirname = "./application/public/uploadFile/";

    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);
    fileUrl = `uploadFile/${userID}/`;
    console.log("userID : " + userID);

    console.log("title, contents, contentsNum, imgUrl === " + title + ", " + contents + ", " + contentsNum + ", " + imgUrl);
    console.log("imgUrl === " + imgUrl + " | ");
    console.log("delImgName === " + delImgName + " | ");

    // 파일 정보 저장 로직 추가
    const fileInfos = files.map(file => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
    }));

    console.log("Number of files uploaded: " + fileInfos.length);

    // 데이터베이스 쿼리
    const contentQuery = `UPDATE contents SET contentsTitle = ?, content = ? WHERE contentsNum = ?`;
    const fileInsertQuery = `INSERT INTO file (fileUrl, fileName, userID, contentsNum) VALUES ?`;
    const fileDeleteQuery = `DELETE FROM file WHERE contentsNum = ? AND fileName IN (?)`;

    try {
        // 게시글 업데이트
        await database.Query(contentQuery, [title, contents, contentsNum]);

        // 파일 정보 삽입 (파일이 있을 경우에만)
        if (fileInfos.length > 0) {
            const fileValues = fileInfos.map(fileInfo => [
                fileUrl,
                fileInfo.filename,
                userID,
                contentsNum
            ]);

            console.log("Inserting files with values: ", fileValues);

            await database.Query(fileInsertQuery, [fileValues])
        }
        
        // delImgName을 배열로 변환
        let delImgNames = [];

        if (typeof delImgName === 'string') {
            delImgNames = delImgName.split(',');
        } else if (Array.isArray(delImgName)) {
            delImgNames = delImgName;
        }
        console.log("delImgNames.length : " + delImgNames.length);

        if (delImgNames.length > 0) {
            // 게시글 이미지 파일 삭제
            await database.Query(fileDeleteQuery, [contentsNum, delImgNames]);
        }

        for (const fileName of delImgNames) {
            const filePath = path.join(dirname, userID, "/", fileName);
            try {
                await fs.promises.unlink(filePath);
                console.log(`Successfully deleted file: ${filePath}`);
            } catch (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
            }
        }

        res.json({ success: true, message: "게시글과 파일이 성공적으로 수정되었습니다." });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 커뮤니티 게시글 삽입
app.post("/ContentsInsert", upload.array('images', 10), async (req, res) => {
    const { title, contents, boardID } = req.body;
    const files = req.files;
    let fileUrl;

    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);
    fileUrl = `uploadFile/${userID}/`;

    console.log("title, contents, boardID === " + title + ", " + contents + ", " + boardID);
    console.log("Number of files uploaded: " + files.length);

    // 파일 정보 저장 로직 추가
    const fileInfos = files.map(file => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
    }));

    // 데이터베이스 쿼리
    const contentQuery = `INSERT INTO contents (contentsTitle, content, boardID, userID) VALUES (?, ?, ?, ?)`;
    const fileQuery = `INSERT INTO file (fileUrl, fileName, userID, contentsNum) VALUES ?`;

    try {
        // 기본 게시글 삽입
        const result = await database.Query(contentQuery, [title, contents, boardID, userID]);
        const contentID = result.insertId;

        // 파일 정보 삽입 (파일이 있을 경우에만)
        if (fileInfos.length > 0) {
            const fileValues = fileInfos.map(fileInfo => [
                fileUrl,
                fileInfo.filename,
                userID,
                contentID
            ]);

            await database.Query(fileQuery, [fileValues]);
        }

        res.json({ success: true, message: "게시글과 파일이 성공적으로 저장되었습니다." });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 댓글 delete
app.post("/ContentsDeleteValue", async (req, res) => {
    const { contentsNum } = req.body;
    let dirname = "./application/public/";

    const fileQuery = `select fileUrl, fileName
                        from file
                        where contentsNum = ?`;

    const deleteQuery = `delete from contents
                    where contentsNum = ?`;
    
    const value = [contentsNum];

    try {
        const result = await database.Query(fileQuery, value);

        await result.forEach(file => {
            const filePath = path.join(dirname, file.fileUrl, file.fileName);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file: ${filePath}`, err);
                } else {
                    console.log(`Successfully deleted file: ${filePath}`);
                }
            });
        })

        await database.Query(deleteQuery, value);
        res.status(200).json({ message: 'Successfully deleted users' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 커뮤니티 게시글 좋아요 선택
app.post("/RecommendClicked", async (req, res) => {
    const { check, contentsNum } = req.body;
    let recommendQuery
    
    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);
    console.log("userID : " + userID);

    console.log("check : " + check);

    if(check) {
        recommendQuery = `update contents
                            set recommend = recommend + 1
                            where contentsNum = ?`;
        contentsRecommendQuery = `insert into contentsRecommend(userID, contentsNum)
                                    values(?, ?)`;
    }
    else {
        recommendQuery = `update contents
                            set recommend = recommend - 1
                            where contentsNum = ?`;
        contentsRecommendQuery = `delete from contentsRecommend
                                    where userID = ? and contentsNum = ?`;
    }
    
    const value = [contentsNum];
    const contentsRecommendValue = [userID, contentsNum];

    const contentsSelect = `select recommend from contents where contentsNum = ?`;

    try {
        await database.Query(recommendQuery, value);
        await database.Query(contentsRecommendQuery, contentsRecommendValue);

        const contentRecommentResult = await database.Query(contentsSelect, value);

        res.json(contentRecommentResult[0]);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 조회수 올리기
app.post("/IncrementViews", async (req, res) => {
    const { contentsNum } = req.body;
    
    const token = req.headers.authorization.replace("Bearer ", "");
    const userID = await GetUserID(token);

    // 조회수 쿼리
    const viewsQuery = `update contents
                        set views = views + 1
                        where contentsNum = ?`;
    
    const value = [contentsNum];

    try {
        // 조회 쿼리
        await database.Query(viewsQuery, value);
        res.status(200).json({ message: 'Successfully deleted users' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






// ********* Web 영역 *********
// 회원 관리 초기 데이터
app.post("/adminMainInitData", async (req, res) => {
    const adminID = 'admin';

    const query = `select userID, userName, userNickName, createDate
                    from user
                    where adminID = ? and deleteFlag = ?`;

    const values = [adminID, 'FALSE'];

    const result = await database.Query(query, values);

    // JSON 형식으로 데이터를 반환
    res.json(result);
});

// 게시판 관리 초기 데이터
app.post("/boardMgrInitData", async (req, res) => {
    const adminID = 'admin';

    const query = `SELECT 
                        b.boardID as boardID,
                        b.boardName as boardName,
                        COALESCE(count(c.content), 0) as contentTotal,
                        b.boardDate
                    FROM board as b 
                    LEFT JOIN contents as c
                        ON b.boardID = c.boardID
                    WHERE b.adminID = ?
                    GROUP BY b.boardID, b.boardName, b.boardDate`;

    const values = [adminID];

    const result = await database.Query(query, values);
    
    console.log(result);

    // JSON 형식으로 데이터를 반환
    res.json(result);
});

// 기기관리 초기 데이터
app.post("/deviceMgrInitData", async (req, res) => {
    const adminID = 'admin';

    const query = `SELECT 
                        productNum,
                        modelName,
                        CASE 
                            WHEN type = 1 THEN '전등'
                            WHEN type = 2 THEN '커튼'
                            WHEN type = 3 THEN '에어컨'
                            WHEN type = 4 THEN 'TV'
                            WHEN type = 5 THEN '보일러'
                            ELSE '등록되지 않은 가전제품' -- 예기치 않은 값을 처리하기 위한 기본값
                        END AS type,
                        company,
                        registrationDate,
                        productImgUrl
                    FROM product
                    `;

    const result = await database.Query(query);
    
    console.log(result);

    // JSON 형식으로 데이터를 반환
    res.json(result);
});

// 요청관리 초기 데이터
app.post("/requestMgrInitData", async (req, res) => {
    const adminID = 'admin';

    const requestCompletedQuery = `select 
                                        d.id as deviceRequestID,
                                        u.userID as userID,
                                        u.userName as userName,
                                        u.userNickName as userNickName,
                                        CASE 
                                            WHEN d.state = 'T' THEN '요청 완료'
                                            WHEN d.state = 'F' THEN '요청 미완료'
                                            ELSE '상태 미정의'
                                        END AS state,
                                        d.requestTime as requestTime
                                    from user as u inner join deviceRequest as d
                                        on u.userID = d.userID
                                    where d.state = 'T' and u.adminID = ?`;

    const requestNotCompletedQuery = `select 
                                        d.id as deviceRequestID,
                                        u.userID as userID,
                                        u.userName as userName,
                                        u.userNickName as userNickName,
                                        CASE 
                                            WHEN d.state = 'T' THEN '요청 완료'
                                            WHEN d.state = 'F' THEN '요청 미완료'
                                            ELSE '상태 미정의'
                                        END AS state,
                                        d.requestTime as requestTime
                                    from user as u inner join deviceRequest as d
                                        on u.userID = d.userID
                                    where d.state = 'F' and u.adminID = ?`;

    const values = [adminID];

    // JSON 형식으로 데이터를 반환
    try {
        // 두 개의 쿼리를 각각 실행
        const requestCompletedResult = await database.Query(requestCompletedQuery, values);
        const requestNotCompletedResult = await database.Query(requestNotCompletedQuery, values);

        // 두 결과를 객체로 묶어 JSON 형식으로 반환
        res.json({
            requestCompletedResult: requestCompletedResult,
            requestNotCompletedResult: requestNotCompletedResult
        });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ***** 상세보기 데이터******
// adminMain 상세보기 데이터 select
app.post("/adminMainViewDetails", async (req, res) => {
    const { modalSendData } = req.body;
    const adminID = 'admin';

    console.log("modalSendData : " + modalSendData);

    const contentListQuery = `select 
                                c.contentsNum as contentsNum,
                                b.boardName as boardName,
                                c.content as content,
                                c.contentsDate as contentsDate,
                                c.views as views,
                                c.recommend as recommend
                            from board as b inner join contents as c
                                on b.boardID = c.boardID
                            where adminID = ? and userID = ?`;

    const deviceRequestListQuery = `SELECT 
                                        productName, 
                                        CASE 
                                            WHEN type = 1 THEN '전등'
                                            WHEN type = 2 THEN '커튼'
                                            WHEN type = 3 THEN '에어컨'
                                            WHEN type = 4 THEN 'TV'
                                            WHEN type = 5 THEN '보일러'
                                            ELSE '등록되지 않은 가전제품' 
                                        END AS type, 
                                        company, 
                                        title, 
                                        requestTime, 
                                        productImgUrl
                                    FROM 
                                        deviceRequest
                                    where adminID = ? and userID = ?`;

    const contentBoardListQuery = `select b.boardID, b.boardName
                                    from board as b inner join contents as c
                                        on b.boardID = c.boardID
                                    where adminID = ? and userID = ?`;

    const values = [adminID, modalSendData];

    // console.log("adminMain 상세보기 데이터 : " + userID);

    // JSON 형식으로 데이터를 반환
    try {
        // 세 개의 쿼리를 각각 실행
        const contentListResult = await database.Query(contentListQuery, values);
        const deviceRequestListResult = await database.Query(deviceRequestListQuery, values);
        const contentBoardListResult = await database.Query(contentBoardListQuery, values);

        // console.log(contentListResult);
        // console.log(deviceRequestListResult);

        // 두 결과를 객체로 묶어 JSON 형식으로 반환
        res.json({
            contentListResult: contentListResult,
            deviceRequestListResult: deviceRequestListResult,
            contentBoardListResult : contentBoardListResult
        });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// adminMain 프로필카드 데이터 select
app.post("/profileViewDetails", async (req, res) => {
    const { modalSendData } = req.body;
    const adminID = 'admin';
    // console.log("adminMain 프로필카드 데이터 : " + modalSendData);

    const query = `select 
                        u.userName as userName, 
                        u.userNickName as userNickName,
                        z.hubID as hubID,
                        u.address as address,
                        u.postNum as postNum,
                        u.userPhoneNum as userPhoneNum
                    from user as u inner join zigbeeHub as z
                        on u.userID = z.userID
                    where adminID = ? and u.userID = ?`;

    const values = [adminID, modalSendData];

    try {
        const result = await database.Query(query, values);

        console.log(result);

        // JSON 형식으로 데이터를 반환
        res.json(result);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// boardMgr 상세보기 데이터 select
app.post("/boardMgrViewDetails", async (req, res) => {
    const { modalSendData } = req.body;
    const adminID = 'admin';
    // console.log("adminMain 프로필카드 데이터 : " + modalSendData);

    const query = `select 
                        c.contentsNum as contentsNum,
                        b.boardName as boardName,
                        c.content as content,
                        c.contentsDate as contentsDate,
                        c.recommend as recommend,
                        c.views as views
                    from board as b inner join contents as c
                        on b.boardID = c.boardID
                    where b.adminID = ? and b.boardID = ?`;

    const values = [adminID, modalSendData];

    try {
        const result = await database.Query(query, values);

        console.log(result);

        // JSON 형식으로 데이터를 반환
        res.json(result);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// requestMgr 상세보기 데이터 select
app.post("/requestMgrViewDetails", async (req, res) => {
    const { modalSendData } = req.body;
    const adminID = 'admin';
    // console.log("adminMain 프로필카드 데이터 : " + modalSendData);

    const query = `select 
                        productImgUrl,
                        company,
                        productName,
                        CASE 
                            WHEN type = 1 THEN '전등'
                            WHEN type = 2 THEN '커튼'
                            WHEN type = 3 THEN '에어컨'
                            WHEN type = 4 THEN 'TV'
                            WHEN type = 5 THEN '보일러'
                            ELSE '등록되지 않은 가전제품'
                        END AS type,
                        title
                    from deviceRequest
                    where ID = ? and adminID = ?`;

    const values = [modalSendData, adminID];

    try {
        const result = await database.Query(query, values);

        console.log(result);

        // JSON 형식으로 데이터를 반환
        res.json(result);
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// 테이블 Delete
app.post("/deleteTable", async (req, res) => {
    const { modalSendData, buttonId } = req.body;
    // const adminID = 'admin';

    let modalSendDataArray;

    // modalSendData가 문자열인 경우와 배열인 경우를 구분하여 처리
    if (typeof modalSendData === 'string') {
        modalSendDataArray = modalSendData.split(',');
    } else if (Array.isArray(modalSendData)) {
        modalSendDataArray = modalSendData;
    } else {
        console.error('Invalid modalSendData format:', modalSendData);
        res.status(400).json({ error: 'Invalid modalSendData format' });
        return;
    }

    let query;

    switch(buttonId) {
        case "AdminMainDelete" :
            query = `UPDATE user
                    SET deleteFlag = TRUE
                    WHERE userID IN (?)`;
            break;
        case "AdminMainDetailDelete" :
            query = `DELETE FROM contents
                    WHERE contentsNum IN (?)`;
            break;
        case "BoardMgrDelete" :
            query = `DELETE FROM board
                    WHERE boardID IN (?)`;
            break;
        case "BoardMgrDetailDelete" :
            query = `DELETE FROM contents
                    WHERE contentsNum IN (?)`;
            break;
        case "DeviceMgrDelete" :
        query = `DELETE FROM product
                WHERE productNum IN (?)`;
        break;
    }

    try {
        await Promise.all(modalSendDataArray.map(async deleteID => {
            await database.Query(query, [deleteID]);
        }));
        res.status(200).json({ message: 'Successfully deleted users' });
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// boardMgr 상세보기 데이터 update
app.post("/updateTable", async (req, res) => {
    const { modalSendData, formData } = req.body;
    const adminID = 'admin';

    const query = `UPDATE board
                    SET 
                        boardName = ?,
                        boardIntro = ?,
                        boardRead = ?, 
                        boardWrite = ?, 
                        boardComWrite = ? 
                    WHERE
                        boardID = ?`;

    const values = [];

    // formData의 속성들을 순회하면서 value 배열에 추가합니다.
    formData.forEach(value => {
        values.push(value);
    });
    values.push(modalSendData);

    try {
        await database.Query(query, values);
        res.status(200).json({ message: 'Update successful' }); // 성공 응답 추가
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// boardMgr 상세보기 데이터 insert
app.post("/insertTable", async (req, res) => {
    const { formData, buttonId } = req.body;
    const adminID = 'admin';

    switch(buttonId) {
        case "boardMgrInsertBtn" :
            query = `INSERT INTO board (boardName, boardIntro, boardRead, boardWrite, boardComWrite, adminID) 
                    VALUES (?, ?, ?, ?, ?, ?)`;
            break;
    }

    const values = [];

    // formData의 속성들을 순회하면서 value 배열에 추가합니다.
    formData.forEach(value => {
        values.push(value);
    });
    values.push(adminID);

    try {
        await database.Query(query, values);
        res.status(200).json({ message: 'Insert successful' }); // 성공 응답 추가
    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 아이디 찾기

app.post("/findingID", async (req, res) => {
  const data = req.body;
  const result = await findingID.FindingID(data.phoneNum);
  if (result) {
    res.status(200).json({ success: true, message: result.userID });
  }
  else {
    res.status(401).json({ success: false, message: "전화번호에 일치하는 회원이 없습니다." });
  }
});

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
// 비밀번호찾기


// 전화번호 인증
app.post("/verifyPhoneNum", async (req, res) => {
  const { phoneNum, id } = req.body;
  try {
    const result = await findingPW.verifyPhoneNum(phoneNum, id);
    console.log('Verification result:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error verifying phone number:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// 비밀번호 재설정
app.post("/resetPassword", async (req, res) => {
  const { id, phoneNum, newPassword } = req.body;
  try {
    const result = await findingPW.resetPassword(id, phoneNum, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});