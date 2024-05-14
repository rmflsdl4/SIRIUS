const database = require("./database.js");

async function User_Insert(id, pw, name, nick_name, address, phone_num) {
  let query;
  let values;
  let result;

  query = `INSERT INTO user(userID, userPW, userName, userNickName, sex, userPhoneNum, address, postNum, adminID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  values = [id, pw, name, nick_name, sex, phone_num, address, postNum, 'admin'];

  result = await database.Query(query, values);

  if (result instanceof Error) {
    return;
  }
}

module.exports = {
  Add_NewUser: User_Insert,
};
