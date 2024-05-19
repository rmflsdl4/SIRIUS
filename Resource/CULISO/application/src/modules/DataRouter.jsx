import { Cookies } from "react-cookie";

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
        cookies.set("token", response.token);
        alert(response.message);
        window.location.href = "/afterMain";
      } else {
        alert(response.message);
      }
    });
}
export async function RequestUserData(path, data = null) {
  const token = cookies.get("token");

  if (!token) {
    console.log("토큰 없음");
    return;
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // 쿠키 값을 Authorization 헤더에 포함하여 전송
  };
  try {
    const response = await fetch(url + path, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (resData.success) {
      switch (path) {
        case "addrReq":
          return data.address;
        case "sex":
          return data.sex;

        default:
          return;
      }
    } else {
      console.log("데이터 받기 실패");
      return null;
    }
  } catch (error) {
    console.error("데이터 요청 중 오류 발생:", error);
    return null;
  }
}
export async function GetAddress() {
  return await RequestUserData("addrReq");
}
export async function GetSex() {
  return await RequestUserData("sex");
}
