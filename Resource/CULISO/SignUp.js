const database = require("./database.js");

async function User_Insert(id, pw, name, nickName, sex, phoneNum, address, postNum) {
  let query;
  let values;
  let result;

  query = `INSERT INTO user(userID, userPW, userName, userNickName, sex, userPhoneNum, address, postNum, adminID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  values = [id, pw, name, nickName, sex, phoneNum, address, postNum, 'admin'];

  result = await database.Query(query, values);

  if (result instanceof Error) {
    return;
  }
  console.log("회원가입에 성공했습니다.");
}

module.exports = {
  Add_NewUser: User_Insert,
};
