-- use siriusDB;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';

create table admin (
	adminID VARCHAR(15) NOT NULL PRIMARY KEY,
    adminPW VARCHAR(30) NOT NULL,
    adminName VARCHAR(20) NOT NULL,
    adminPhoneNum CHAR(13) NOT NULL,
    adminNickName VARCHAR(30) NOT NULL UNIQUE
);

create table user (
	userID varchar(15) not null primary key,
    userPW varchar(30) not null,
    userName varchar(20) not null,
    userPhoneNum char(13) not null,
    postNum char(5) not null,
    address varchar(30) not null,
    sex char(1) not null check(sex in('M', 'F')),
    userNickName varchar(30) not null unique,
    createDate datetime not null default current_timestamp,
    deleteFlag boolean not null default false,
    adminID varchar(15) not null,
    FOREIGN KEY (adminID) REFERENCES admin(adminID)
);

create table deviceRequest (
	ID int not null primary key auto_increment,
    title varchar(30) not null,
    productName varchar(50) not null,
    type int not null,
    company varchar(50) not null,
    requestTime datetime not null default current_timestamp,
    state char(1) not null check(state in('T', 'F')),
    productImgUrl varchar(100) not null,
    userID varchar(15) not null,
    adminID varchar(15) not null,
    FOREIGN KEY (adminID) REFERENCES admin(adminID),
    FOREIGN KEY (userID) REFERENCES user(userID)
);

create table board (
	boardID int not null primary key auto_increment,
    boardName varchar(20) not null unique,
    boardIntro text not null,
    boardDate datetime not null default current_timestamp,
    boardRead char(1) not null check(boardRead in('A', 'U', 'M')),
    boardWrite char(1) not null check(boardWrite in('A', 'U', 'M')),
    boardComWrite char(1) not null check(boardComWrite in('A', 'U', 'M')),
    adminID varchar(15) not null,
    FOREIGN KEY (adminID) REFERENCES admin(adminID)
);

create table contents (
	contentsNum int not null primary key auto_increment,
    contentsTitle varchar(100) not null,
    content text not null,
    contentsDate datetime not null default current_timestamp,
    recommend int not null,
    views int not null,
    userID varchar(15) not null,
    boardID int not null,
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (boardID) REFERENCES board(boardID)
);

create table comment (
	commentNum int not null primary key auto_increment,
    commentContent text not null,
    commentDate datetime not null default current_timestamp,
    userID varchar(15) not null,
    contentsNum int not null,
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (contentsNum) REFERENCES contents(contentsNum)
);

create table file (
	fileUploadNum int not null primary key auto_increment,
    fileUrl varchar(100) not null unique,
    fileExtension int not null,
    fileName varchar(50) not null,
    userID varchar(15) not null,
    contentsNum int not null,
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (contentsNum) REFERENCES contents(contentsNum)
);

create table contentsRecommend (
	userID varchar(15) not null,
    contentsNum int not null,
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (contentsNum) REFERENCES contents(contentsNum)
);

create table chat (
	chatID int not null primary key auto_increment,
	userID varchar(15) not null unique,
    userChatContext text not null,
    sendTime datetime not null default current_timestamp,
    senderType char(1) not null check(senderType in('U', 'A'))
);

create table zigbeeHub (
	hubID varchar(15) not null primary key,
    hubPW varchar(30) not null,
    postNum char(5) not null,
    address varchar(30) not null,
    userID varchar(15) not null,
    FOREIGN KEY (userID) REFERENCES user(userID)
);

create table product (
	productNum int not null primary key auto_increment,
    modelName varchar(20) not null,
    productName varchar(50) not null,
    type int not null,
    company varchar(50) not null,
    productImgUrl varchar(100) not null,
    userID varchar(15) not null,
    hubID varchar(15) not null,
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (hubID) REFERENCES zigbeeHub(hubID)
);

create table usingProduct (
	userID varchar(15) not null,
    productNum int not null,
    productState varchar(30) not null,
    usingDate datetime not null default current_timestamp,
    successOrNot char(1) not null check(successOrNot in('T', 'F')),
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (productNum) REFERENCES product(productNum)
);

create table productFunction (
	functionNum int not null primary key auto_increment,
    functionName varchar(20) not null,
    productNum int not null,
    FOREIGN KEY (productNum) REFERENCES product(productNum)
);



-- **********************************************************************************************************
-- SET SQL_SAFE_UPDATES = 0;

-- show tables;
-- -- desc admin;

-- INSERT INTO user (userID, userPW, userName, userPhoneNum, postNum, address, sex, userNickName, createDate, adminID) 
-- VALUES (
--     'gildong',          -- 사용자 아이디
--     '1234',      -- 사용자 비밀번호
--     '홍길동',          -- 사용자 이름
--     '010-1234-1234',         -- 사용자 전화번호
--     '12345',              -- 우편번호
--     '광주대학교 전산관 320',       -- 주소
--     'M',                  -- 성별
--     '홍길동',       -- 사용자 닉네임
--     NOW(),                -- 생성일시 (현재 시간)
--     'admin'               -- 관리자 아이디
-- );

-- select * from user;

-- INSERT INTO admin (adminID, adminPW, adminName, adminPhoneNum, adminNickName) 
-- VALUES (
--     'admin',
--     'admin',
--     'admin',
--     '010-1234-1234',
--     'admin'
-- );


-- INSERT INTO user (userID, userPW, userName, userPhoneNum, postNum, address, sex, userNickName, adminID)
-- VALUES
-- ('user1', 'password1', 'John Doe', '123-456-7890', '12345', '123 Main St', 'M', 'johnny', 'admin'),
-- ('user2', 'password2', 'Jane Smith', '987-654-3210', '54321', '456 Elm St', 'F', 'janesmith', 'admin'),
-- ('user3', 'password3', 'Michael Johnson', '555-555-5555', '67890', '789 Oak St', 'M', 'mikej', 'admin'),
-- ('user4', 'password4', 'Emily Davis', '111-222-3333', '24680', '321 Pine St', 'F', 'em_d', 'admin'),
-- ('user5', 'password5', 'Chris Wilson', '444-444-4444', '13579', '654 Cedar St', 'M', 'chrisw', 'admin');


-- INSERT INTO board (boardName, boardIntro, boardRead, boardWrite, boardComWrite, adminID)
-- VALUES
-- ('게시판1', '이 게시판은 첫 번째 게시판입니다.', 'A', 'A', 'A', 'admin'),
-- ('게시판2', '이 게시판은 두 번째 게시판입니다.', 'A', 'A', 'A', 'admin');


-- INSERT INTO contents (contentsTitle, content, recommend, views, userID, boardID)
-- VALUES
-- ('첫 번째 글', '이것은 첫 번째 글의 내용입니다.', 0, 10, 'user1', 1),
-- ('두 번째 글', '이것은 두 번째 글의 내용입니다.', 2, 20, 'user2', 1),
-- ('세 번째 글', '이것은 세 번째 글의 내용입니다.', 5, 30, 'user3', 2),
-- ('네 번째 글', '이것은 네 번째 글의 내용입니다.', 1, 40, 'user4', 2),
-- ('다섯 번째 글', '이것은 다섯 번째 글의 내용입니다.', 3, 50, 'user5', 1);


-- INSERT INTO comment (commentContent, userID, contentsNum)
-- VALUES
-- ('이 글에 대한 댓글입니다.', 'user1', 1),
-- ('댓글을 달아보는 중입니다.', 'user2', 2),
-- ('내용에 동의합니다.', 'user3', 3),
-- ('좋은 글 감사합니다.', 'user4', 4);


-- INSERT INTO contentsrecommend (userID, contentsNum)
-- VALUES
-- ('user1', 1),
-- ('user2', 2),
-- ('user3', 2),
-- ('user4', 3),
-- ('user5', 3);


-- INSERT INTO devicerequest (title, productName, type, company, state, productImgUrl, userID, adminID)
-- VALUES
-- ('요청 제목 1', '에어컨 모델 A', 1, 'AC Company A', 'F', 'air-conditioner.png', 'user1', 'admin'),
-- ('요청 제목 2', '에어컨 모델 B', 2, 'AC Company B', 'F', 'air-conditioner.png', 'user2', 'admin'),
-- ('요청 제목 3', '에어컨 모델 C', 3, 'AC Company C', 'F', 'air-conditioner.png', 'user3', 'admin'),
-- ('요청 제목 4', '에어컨 모델 D', 4, 'AC Company D', 'T', 'air-conditioner.png', 'user4', 'admin'),
-- ('요청 제목 5', '에어컨 모델 E', 5, 'AC Company E', 'T', 'air-conditioner.png', 'user5', 'admin');

-- select * from devicerequest;

-- select * from board;
-- select * from contents;

-- select *
-- from board as b inner join contents as c
-- 	on b.boardID = c.boardID;

-- select 
-- 	b.boardName as boardName,
--     c.content as content,
--     c.contentsDate as contentsDate,
--     c.views as views,
--     c.recommend as recommend
-- from board as b inner join contents as c
-- 	on b.boardID = c.boardID;

-- select * from deviceRequest;

-- SELECT 
--     productName, 
--     CASE 
--         WHEN type = 1 THEN '전등'
--         WHEN type = 2 THEN '커튼'
--         WHEN type = 3 THEN '에어컨'
--         WHEN type = 4 THEN 'TV'
--         WHEN type = 5 THEN '보일러'
--         ELSE '등록되지 않은 가전제품' -- 예기치 않은 값을 처리하기 위한 기본값
--     END AS type, 
--     company, 
--     title, 
--     requestTime, 
--     productImgUrl
-- FROM 
--     deviceRequest;

-- INSERT INTO contents (contentsTitle, content, recommend, views, userID, boardID)
-- VALUES
-- ('user1 test1', '이것은 첫 번째 글의 내용입니다.', 0, 10, 'user1', 1),
-- ('user1 test2', '이것은 두 번째 글의 내용입니다.', 2, 20, 'user1', 1),
-- ('user2 test1', '이것은 세 번째 글의 내용입니다.', 5, 30, 'user2', 2),
-- ('user3 test1', '이것은 네 번째 글의 내용입니다.', 1, 40, 'user3', 2),
-- ('user3 test2', '이것은 다섯 번째 글의 내용입니다.', 3, 50, 'user3', 1),
-- ('user3 test3', '이것은 네 번째 글의 내용입니다.', 1, 40, 'user3', 2),
-- ('user3 test4', '이것은 네 번째 글의 내용입니다.', 1, 40, 'user3', 2),
-- ('user4 test1', '이것은 네 번째 글의 내용입니다.', 1, 40, 'user4', 2),
-- ('user4 test2', '이것은 네 번째 글의 내용입니다.', 1, 40, 'user4', 2),
-- ('user5 test1', '이것은 네 번째 글의 내용입니다.', 1, 40, 'user5', 2);

-- select * from contents;

-- select 
--                         u.userName as userName, 
--                         u.userNickName as userNickName,
--                         z.hubID as hubID,
--                         u.address as address,
--                         u.postNum as postNum,
--                         u.userPhoneNum as userPhoneNum
--                     from user as u inner join zigbeeHub as z
--                         on u.userID = z.userID;
--                         
-- desc zigbeeHub;
-- INSERT INTO zigbeeHub (hubID, hubPW, postNum, address, userID)
-- VALUES
-- ('hub1', 'hubpassword1', '12345', '123 Main St', 'user1'),
-- ('hub2', 'hubpassword2', '54321', '456 Elm St', 'user2'),
-- ('hub3', 'hubpassword3', '67890', '789 Oak St', 'user3'),
-- ('hub4', 'hubpassword4', '24680', '321 Pine St', 'user4'),
-- ('hub5', 'hubpassword5', '13579', '654 Cedar St', 'user5');

-- desc user;
-- select * from user;
-- select * from contents;

-- select 
--                         c.contentsNum as contentsNum,
--                         b.boardName as boardName,
--                         c.content as content,
--                         c.contentsDate as contentsDate,
--                         c.views as views,
--                         c.recommend as recommend
--                     from board as b inner join contents as c
--                         on b.boardID = c.boardID;