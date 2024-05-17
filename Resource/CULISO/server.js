const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const util = require('util');
const database = require("./database.js");
const signUp = require("./SignUp.js");
const login = require("./Login.js");
const returnData = require("./ReturnDatas.js");

var router = express.Router();
// 데이터베이스 연결
database.Connect();
// 세션 설정
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400,
      httpOnly: true,
      sameSite: 'none',
      secure: false, // HTTPS를 사용하는 경우 true로 설정
    },
  })
);


// app 설정
const corsOptions = {
    origin: true,
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

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
    const result = await login.Check(data.id, data.pw);
    console.log(data);
    if (result) {
        req.session.userID = data.id;
        console.log(req.sessionID);
        return res.status(200).json({ success: true, message: "큐리소에 오신 것을 환영합니다 !", token: req.sessionID});
    } else {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }
  });
  app.post("/addrReq", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ success: false, message: "토큰이 필요합니다." });
    // 세션 스토어에서 토큰으로 세션을 가져오기
    const getSession = util.promisify(req.sessionStore.get).bind(req.sessionStore);

    try {
        const session = await getSession(token);
        if (!session) {
          return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다." });
        }
    
        const userID = session.userID;
        const addr = await returnData.ReqResData(userID);
        if (addr)
          res.status(200).json({ success: true, address: addr });
        else
          res.status(404).json({ success: false, message: "주소를 찾을 수 없습니다." });
      } 
      catch (error) {
        console.error("서버 오류 발생:", error);
        res.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
      }
  });

// Web 영역
// 회원 관리 초기 데이터
app.post("/adminMainMgrInitData", async (req, res) => {
    const adminID = 'admin';

    const query = `select userID, userName, userNickName, createDate
                    from user
                    where adminID = ? and deleteFlag = ?`;

    const values = [adminID, 'FALSE'];

    const result = await database.Query(query, values);
    
    // console.log(result);

    // JSON 형식으로 데이터를 반환
    res.json(result);
});

// 게시판 관리 초기 데이터
app.post("/boardMgrInitData", async (req, res) => {
    const adminID = 'admin';

    const query = `select userID, userName, userNickName, createDate
                    from user
                    where adminID = ? and deleteFlag = ?`;

    const values = [adminID, FALSE];

    const result = await database.Query(query, values);
    
    console.log(result);

    // JSON 형식으로 데이터를 반환
    res.json(result);
});


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


// adminMain 회원 관리 테이블 Delete
app.post("/adminMainDelete", async (req, res) => {
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
            // console.log("AdminMain 삭제 버튼 : " + modalSendDataArray);
            query = `UPDATE user
                    SET deleteFlag = TRUE
                    WHERE userID IN (?)`;
            break;
        case "AdminMainDetailDelete" :
            // console.log("AdminMainDetail 삭제 버튼 : " + modalSendDataArray);
            query = `DELETE FROM contents
                    WHERE contentsNum IN (?)`;
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

