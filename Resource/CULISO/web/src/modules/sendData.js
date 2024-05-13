const host = 'http://localhost'; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = '5000';
const url = host + ":" + port + "/";

export function handleViewDetailsClick (event) {
    // 클릭된 버튼의 id를 가져옵니다.
    const button = event.target.closest('button');
    const buttonId = button.id;
    console.log("Clicked button id:", buttonId);

    // 클릭된 버튼의 부모 요소인 <td> 태그를 찾습니다.
    const tdElement = event.target.closest('td');
    if (tdElement) {
        // tdElement의 부모인 tr 요소에서 'modalSendData' 클래스를 가진 td 태그를 선택합니다.
        const idElement = tdElement.parentNode.querySelector('td.modalSendData');
        if (idElement) {
            // 선택된 td 태그의 텍스트 콘텐츠를 가져옵니다.
            const modalSendData = idElement.textContent.trim();
            console.log("id : " + modalSendData);

            // 가져온 아이디 값을 서버로 전송합니다.
            switch (buttonId) {
                case "adminMainDetail" :
                    adminMainViewDetails(modalSendData);
                    break;
                case "adminMainProfile" :
                    profileViewDetails(modalSendData);
                    break;
                case "boardMgrDetail" :
                    boardMgrViewDetails(modalSendData);
                    break;
                case "requestMgrDetail" :
                    requestMgrViewDetails(modalSendData);
                    break;
                default:
                    console.error("Unhandled button id:", buttonId);
            }
            
        } else {
            console.error('아이디를 찾을 수 없습니다.');
        }
    } else {
        console.error('버튼의 부모 요소를 찾을 수 없습니다.');
    }
}

function adminMainViewDetails(modalSendData) {
    return new  Promise((resolve, reject) => {
        fetch(url + "adminMainViewDetails", {
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

function profileViewDetails(modalSendData) {
    return new  Promise((resolve, reject) => {
        fetch(url + "profileViewDetails", {
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

function boardMgrViewDetails(modalSendData) {
    return new  Promise((resolve, reject) => {
        fetch(url + "boardMgrViewDetails", {
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

function requestMgrViewDetails(modalSendData) {
    return new  Promise((resolve, reject) => {
        fetch(url + "requestMgrViewDetails", {
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