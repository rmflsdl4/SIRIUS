const database = require("./database.js");

async function InUpdatePage(id, pw) {
    let query;
    let values;
  
    query = `SELECT COUNT(*) as count FROM user
                    WHERE userID = ? AND userPW = ?`;
    values = [id, pw];

    const result = await database.Query(query, values);
    const count = result[0].count;

    if (result instanceof Error) {
        return;
    }
    return count ? true:false;
}

async function GetInfo(id) {
  let query;
  let values;

  query = `SELECT userID, userPW, userName, userPhoneNum, postNum, address, sex, userNickName, createDate 
           FROM user
           WHERE userID = ?`;
  values = [id];

  const result = await database.Query(query, values);
  if (result instanceof Error) {
      return;
  }
  return result[0];
}
async function UpdateInfo(name, nickName, sex, phoneNum, address, postNum, id) {
  let query;
  let values;

  query = `UPDATE user
           SET userName = ?, userNickName = ?, sex = ?, userPhoneNum = ?, address = ?, postNum = ?
           WHERE userID = ?`;
  values = [name, nickName, sex, phoneNum, address, postNum, id];

  try{
    await database.Query(query, values);
    return true;
  }
  catch(err){
    return false;
  }
}
module.exports = {
  InUpdatePage: InUpdatePage,
  GetInfo: GetInfo,
  UpdateInfo:UpdateInfo
};
  