// const database = require('./database.js');

// async function FindingPW(phoneNum, id) {
//     let query = `UPDATE user SET userPW = '1234' WHERE userPhoneNum = ? AND userID = ?`;
//     let values = [phoneNum, id];

//     try {
//         const result = await database.Query(query, values);
//         console.log("Database query result:", result); // 디버깅 메시지 추가
//         if (result.affectedRows > 0) {
//             return { success: true, message: "비밀번호가 '1234'로 초기화되었습니다." };
//         } else {
//             return { success: false, message: "아이디와 전화번호가 일치하지 않습니다" };
//         }
//     } catch (error) {
//         console.error("Database error:", error);
//         return { success: false, message: "데이터베이스 쿼리 중 오류가 발생했습니다." };
//     }
// }

// module.exports = {
//     FindingPW
// };

const database = require('./database.js');

async function verifyPhoneNum(phoneNum, id) {
    let query = `SELECT * FROM user WHERE userPhoneNum = ? AND userID = ?`;
    let values = [phoneNum, id];

    try {
        const result = await database.Query(query, values);
        if (result.length > 0) {
            return { success: true, message: "전화번호 인증이 완료되었습니다." };
        } else {
            return { success: false, message: "아이디와 전화번호가 일치하지 않습니다." };
        }
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "데이터베이스 쿼리 중 오류가 발생했습니다." };
    }
}

async function resetPassword(id, phoneNum, newPassword) {
    let query = `UPDATE user SET userPW = ? WHERE userID = ? AND userPhoneNum = ?`;
    let values = [newPassword, id, phoneNum];

    try {
        const result = await database.Query(query, values);
        if (result.affectedRows > 0) {
            return { success: true, message: "비밀번호가 성공적으로 재설정되었습니다." };
        } else {
            return { success: false, message: "아이디 또는 전화번호가 일치하지 않습니다." };
        }
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, message: "데이터베이스 쿼리 중 오류가 발생했습니다." };
    }
}

module.exports = {
    verifyPhoneNum,
    resetPassword
};
