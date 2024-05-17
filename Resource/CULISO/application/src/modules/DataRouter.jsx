import {Cookies} from 'react-cookie';

const host = "http://localhost"; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = "5000";
const url = host + ":" + port + "/";
const cookies = new Cookies();


export function SignUpDataSend(data) {
  const sendData = {
    id: data.id,
    pw: data.pw,
    name: data.name,
    nickName: data.nickName,
    sex: data.sex,
    address: data.address,
    postNum: data.postNum,
    phoneNum: data.phoneNum,
  };

  fetch(url + "signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  });
}
export async function LoginDataSend(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const id = formData.get("id");
  const pw = formData.get("pw");

  const data = { id, pw };
  fetch(url + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    if (response.success) {
      cookies.set('token', response.token);
      alert(response.message);
      window.location.href = "/afterMain";
    } else {
      alert(response.message);
    }
  });
}
export async function RequestAddress() {
  const token = cookies.get('token');
  console.log(token);
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // 쿠키 값을 Authorization 헤더에 포함하여 전송
  }

  try {
    const response = await fetch(url + "addrReq", {
      method: "POST",
      headers: headers,
      body: JSON.stringify()
    });
    
    const data = await response.json();
    console.log(data.address);

    if (data.success) {
      return data.address;
    } 
    else {
      console.log("데이터 받기 실패");
      return null;
    }
  }
  catch (error) {
    console.error("데이터 요청 중 오류 발생:", error);
    return null;
  }
}
