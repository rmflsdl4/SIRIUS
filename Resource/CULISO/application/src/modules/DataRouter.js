const host = "http://localhost"; // 추후에 Let's Encrypt 와 같은 사이트에서 SSL 발급받아서 https로 접근해서 보안을 강화해야 함
const port = "5000";
const url = host + ":" + port + "/";

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
export function LoginDataSend(event) {
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
    .then((data) => {
      console.log(data);
      if (data.success) {
        alert(data.message);
        window.location.href = "/afterMain";
      } else {
        alert(data.message);
      }
    });
}
export function RequestAddress() {
  const sendData = {
    t: "test",
  };

  fetch(url + "addrReq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        return data.address;
      } else {
        console.log("데이터 받기 실패");
        return null;
      }
    });
}
