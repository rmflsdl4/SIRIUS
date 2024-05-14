show databases;
create database siriusDB;
use siriusDB;
show databases;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';

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
    adminID varchar(15) not null,
    FOREIGN KEY (adminID) REFERENCES admin(adminID)
);

create table deviceRequest (
	ID int not null primary key,
    title varchar(30) not null,
    productName varchar(50) not null,
    type int not null,
    company varchar(50) not null,
    requestTime datetime not null default current_timestamp,
    state char(1) not null check(state in('T', 'F')),
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
	serialNum varchar(50) not null primary key,
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
    serialNum varchar(50) not null,
    productState varchar(30) not null,
    usingDate datetime not null default current_timestamp,
    successOrNot char(1) not null check(successOrNot in('T', 'F'))
);

create table productFunction (
	functionNum int not null primary key auto_increment,
    functionName varchar(20) not null,
    serialNum varchar(50) not null,
    FOREIGN KEY (serialNum) REFERENCES product(serialNum)
);


-- **********************************************************************************************************
