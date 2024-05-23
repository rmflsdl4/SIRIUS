const database = require('./database.js');

async function FindingID(phoneNum) {
    let query = `SELECT userID FROM user WHERE userPhoneNum = ?`;
    let values = [phoneNum];

    try {
        const result = await database.Query(query, values);
        
        // console.log("FindingIDselect임 : ", result);
        if (result.length > 0) {
            return { success: true, userID: result[0].userID };
        } else {
            return { success: false, message: "전화번호에 일치하는 회원이 없습니다." };
        }
    } catch (error) {
        console.error("Error:", error);
        return { success: false, message: "데이터베이스 쿼리 중 오류가 발생했습니다." };
    }
}

module.exports = {
    FindingID
};
