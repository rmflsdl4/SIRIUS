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
            // 성공적으로 데이터를 받았을 때 처리
            console.log("Result: ", data);
            
        })
        .catch(error => {
            reject(error);
        });
    });
}

// 
export const DeleteData = (modalSendData, buttonId) => {
    return new  Promise((resolve, reject) => {
        fetch(url + "adminMainDelete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ modalSendData, buttonId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 데이터로 응답을 파싱
        })
        .then(data => {
            resolve(data);
            // 성공적으로 데이터를 받았을 때 처리
            console.log("Result: ", data);
            
        })
        .catch(error => {
            reject(error);
        });
    });
}