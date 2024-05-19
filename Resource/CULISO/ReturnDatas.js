const database = require("./database.js");

async function GetAddr(id) {
  let query;
  let values;
  let result;

  query = `SELECT address FROM user WHERE userID = ?`;
  values = [id];

  try {
    result = await database.Query(query, values);

    return result[0].address;
  } catch (error) {
    console.log("데이터 수색 중 오류: ", error.message);
  }
}
async function GetSex(id) {
  let query;
  let values;
  let result;

  query = `SELECT sex FROM user WHERE userID = ?`;
  values = [id];

  try {
    result = await database.Query(query, values);

    return result[0].sex;
  } catch (error) {
    console.log("데이터 수색 중 오류: ", error.message);
  }
}
async function GetName(id) {
  let query;
  let values;
  let result;

  query = `SELECT userName FROM user WHERE userID = ?`;
  values = [id];

  try {
    result = await database.Query(query, values);

    return result[0].userName;
  } catch (error) {
    console.log("데이터 수색 중 오류: ", error.message);
  }
}
module.exports = {
  GetAddr: GetAddr,
  GetSex: GetSex,
  GetName: GetName
};
