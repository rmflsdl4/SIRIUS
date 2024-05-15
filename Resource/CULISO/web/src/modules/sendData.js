const host = 'http://localhost'; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = '5000';
const url = host + ":" + port + "/";

export const ViewDetails = (modalSendData, path) => {
    return new  Promise((resolve, reject) => {
        fetch(url + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modalSendData })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            console.log(data); // 파싱된 JSON 데이터 출력
            
        })
        .catch(error => {
            reject(error);
        });
    });
}

// export const AdminMainViewDetails = (modalSendData) => {
//     return new  Promise((resolve, reject) => {
//         fetch(url + "adminMainViewDetails", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ modalSendData })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json(); // JSON 데이터로 응답을 파싱
//         })
//         .then(data => {
//             resolve(data);
//             console.log(data); // 파싱된 JSON 데이터 출력
            
//         })
//         .catch(error => {
//             reject(error);
//         });
//     });
// }

// export const ProfileViewDetails = (modalSendData) => {
//     return new  Promise((resolve, reject) => {
//         fetch(url + "profileViewDetails", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ modalSendData })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json(); // JSON 데이터로 응답을 파싱
//         })
//         .then(data => {
//             resolve(data);
//             console.log(data); // 파싱된 JSON 데이터 출력
            
//         })
//         .catch(error => {
//             reject(error);
//         });
//     });
// }

// export const BoardMgrViewDetails = (modalSendData) => {
//     return new  Promise((resolve, reject) => {
//         fetch(url + "boardMgrViewDetails", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ modalSendData })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json(); // JSON 데이터로 응답을 파싱
//         })
//         .then(data => {
//             resolve(data);
//             console.log(data); // 파싱된 JSON 데이터 출력
            
//         })
//         .catch(error => {
//             reject(error);
//         });
//     });
// }

// export const RequestMgrViewDetails = (modalSendData) => {
//     return new  Promise((resolve, reject) => {
//         fetch(url + "requestMgrViewDetails", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ modalSendData })
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json(); // JSON 데이터로 응답을 파싱
//         })
//         .then(data => {
//             resolve(data);
//             console.log(data); // 파싱된 JSON 데이터 출력
            
//         })
//         .catch(error => {
//             reject(error);
//         });
//     });
// }