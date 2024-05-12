const host = 'http://localhost'; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = '5000';
const url = host + ":" + port + "/";

export function SignUpDataSend(data){
    const sendData = {
        id: data.id,
        pw: data.pw,
        name: data.name,
        nickName: data.nickName,
        location: data.location,
        phoneNum: data.phoneNum
    };

    fetch(url+"signUp",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
    })
}