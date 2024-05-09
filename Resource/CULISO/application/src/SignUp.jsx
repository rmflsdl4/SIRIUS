import GetIcon from "./modules/GetIcon";
//import * as SignUpModule from "./modules/SignUp";
//import * as nav from "./modules/Navigate";
import "./style.css";

let signUpDic = {
  0: "지금부터 회원가입을 도와드릴게요!",
  1: "먼저 아이디와 비밀번호를\n입력해 주세요!",
  2: "이번에는 이름과 별명,\n그리고 주소를 입력해 주세요!",
  3: "마지막으로 전화번호를\n입력하고 인증을 받아주세요!",
  4: "회원가입이 완료되었습니다!\n다시 한 번 환영합니다!",
  5: "로그인 화면으로 안내해 드릴게요!\n잠시만 기다려주세요",
};
let currentTextIdx = 0;
let signUpFlag = true;
let idx = 0;
let batchSize = 3;
function SignUpGuide() {
  SignUpMsg();
  if (signUpFlag && currentTextIdx > 1) SetForm();
  console.log(idx, batchSize);
}
function SetForm() {
  const signUpForm = document.getElementById("signUpForm");
  const inputBG = document.getElementsByClassName("inputBG");
  const inputText = document.getElementsByClassName("inputText");
  for (var i = 0; i < inputBG.length; i++) {
    inputBG[i].style.display = "none";
  }
  for (var i = idx; i < idx + batchSize; i++) {
    if (i < inputBG.length) {
      inputBG[i].style.display = "flex";
      inputText[i].value = "";
    }
  }

  idx += batchSize;

  if (currentTextIdx === 2 || currentTextIdx === 3 || currentTextIdx === 4) {
    signUpForm.style.display = "block";
  } else {
    signUpForm.style.display = "none";
  }
}
function SetSignUpFlag() {
  signUpFlag = true;
  SignUpGuide();
  console.log("왜 안돼 " + signUpFlag);
}
function SignUpMsg() {
  let text = document.getElementById("signUpText");
  const cnt = Object.keys(signUpDic).length;
  // 나올 메세지의 다음 거를 기준으로 잡을것

  if (currentTextIdx < cnt && signUpFlag) {
    text.textContent = signUpDic[currentTextIdx];
    if (currentTextIdx - 1 === cnt) currentTextIdx = 0;
    else {
      currentTextIdx++;
    }
  }

  if (currentTextIdx === 2 || currentTextIdx === 3 || currentTextIdx === 4) {
    signUpFlag = false;
    console.log("플래그 변경, 현재 값 : " + currentTextIdx);
  }
}
function SubmitBtnSetActive() {
  const input = document.getElementsByClassName("inputText");
  const submitBtn = document.getElementById("submitBtn");
  const batchSize = 3;
  let idx = 0;
  for (var i = idx; i < idx + batchSize; i++) {
    if (input[i].value === "") {
      submitBtn.style.opacity = 0.5;
      //submitBtn.disabled = true;
      return;
    }
  }
  // submitBtn.disabled = false;
  submitBtn.style.opacity = 1;
}
export const SignUp = () => {
  return (
    <div className="signUp">
      <div className="div" onClick={() => SignUpGuide()}>
        <div className="overlap-group">
          <div className="rectangle">
            <img
              className="polygon"
              alt="Polygon"
              src={GetIcon("polygon.png")}
            />
            <span id="signUpText">
              안녕하세요!<br></br>저는 당신을 도와드릴 큐리에요
            </span>
          </div>
          <img className="robot" alt="Robot" src={GetIcon("robot-white.png")} />
        </div>
        <div className="box">
          <form className="signUpForm" id="signUpForm">
            <div className="inputBoxBG1">
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("profile-gray.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="text"
                  name="id"
                  placeholder="아이디"
                  onChange={() => SubmitBtnSetActive()}
                ></input>
              </div>
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("padlock-web-gray.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="password"
                  name="pw"
                  onChange={() => SubmitBtnSetActive()}
                  placeholder="비밀번호"
                ></input>
              </div>
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("padlock-web-gray.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="password"
                  name="cpw"
                  onChange={() => SubmitBtnSetActive()}
                  placeholder="비밀번호 확인"
                ></input>
              </div>
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("N-gray.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="text"
                  name="name"
                  onChange={() => SubmitBtnSetActive()}
                  placeholder="이름"
                ></input>
              </div>
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("N-gray.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="text"
                  name="nickName"
                  onChange={() => SubmitBtnSetActive()}
                  placeholder="별명"
                ></input>
              </div>
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("location-gray.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="text"
                  name="location"
                  onChange={() => SubmitBtnSetActive()}
                  placeholder="주소"
                ></input>
              </div>
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("phone-gray.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="text"
                  name="phoneNum"
                  onChange={() => SubmitBtnSetActive()}
                  placeholder="전화번호"
                ></input>
              </div>
              <div className="inputBG">
                <img
                  className="inputImg"
                  src={GetIcon("confirm-white.png")}
                  alt=""
                ></img>
                <input
                  className="inputText"
                  type="button"
                  onClick={() => ""}
                  value="전화번호 인증하기"
                ></input>
              </div>

              <div className="inputBG"></div>
            </div>
            <input
              id="submitBtn"
              type="button"
              value="다음으로"
              onClick={SetSignUpFlag}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
