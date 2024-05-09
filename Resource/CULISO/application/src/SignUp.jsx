import GetIcon from "./modules/GetIcon";
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

function SignUpMsg() {
  let text = document.getElementById("signUpText");
  console.log(text);
  const cnt = Object.keys(signUpDic).length;
  console.log(cnt);
  if (currentTextIdx < cnt) {
    text.textContent = signUpDic[currentTextIdx];
    if (currentTextIdx - 1 === cnt) currentTextIdx = 0;
    else currentTextIdx++;
  }
  console.log(currentTextIdx);
}

export const SignUp = () => {
  return (
    <div className="signUp">
      <div className="div" onClick={() => SignUpMsg()}>
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
          <div className="inputBoxBG1">
            <form id="signUpForm">
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
                  placeholder="비밀번호 확인"
                ></input>
              </div>
              <input
                className="submitBtn"
                type="submit"
                value="다음으로"
              ></input>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
