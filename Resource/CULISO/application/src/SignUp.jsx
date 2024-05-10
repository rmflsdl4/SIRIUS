import React, { useState } from "react";
import GetIcon from "./modules/GetIcon";
import Timer from "./modules/Timer";
import { Navigate } from "./modules/Navigate";
import "./style.css";


let culiMsg = {
  0: "지금부터 회원가입을\n도와드릴게요!",
  1: "먼저 아이디와 비밀번호를\n입력해 주세요!",
  2: "이번에는 이름과 별명,\n그리고 주소를 입력해 주세요!",
  3: "마지막으로 전화번호를\n입력하고 인증을 받아주세요!",
  4: "회원가입이 완료되었습니다!\n다시 한 번 환영합니다!",
  5: "로그인 화면으로 안내해 드릴게요!\n잠시만 기다려주세요",
};
// 회원가입
export const SignUp = () => {
  const [msg, setMsg] = useState("안녕하세요!\n저는 당신을 도와드릴 큐리에요");
  const [currentMsgIdx, setcurrentMsgIdx] = useState(0);
  const [isForm, setIsForm] = useState(false);
  const [isInputCheck, setInputCheck] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [formValues, setFormValues] = useState({
    id: "",
    pw: "",
    name: "",
    nickName: "",
    location: "",
    phoneNum: ""
  });
  const inputBGData = [
    { iconSrc: GetIcon("profile-gray.png"), placeholder: "아이디", name: "id" },
    { iconSrc: GetIcon("padlock-web-gray.png"), placeholder: "비밀번호", name: "pw" },
    { iconSrc: GetIcon("padlock-web-gray.png"), placeholder: "비밀번호 확인", name: "cpw" },
    { iconSrc: GetIcon("N-gray.png"), placeholder: "이름", name: "name" },
    { iconSrc: GetIcon("N-gray.png"), placeholder: "별명", name: "nickName" },
    { iconSrc: GetIcon("location-gray.png"), placeholder: "주소", name: "location" },
    { iconSrc: GetIcon("phone-gray.png"), placeholder: "전화번호", name: "phoneNum" },
    { iconSrc: GetIcon("confirm-white.png"), placeholder: "전화번호 인증하기", name: "phoneID", button: true },
  ];

  
  const InputNullCheck = () => {
    const inputText = document.getElementsByClassName("inputText");
    for(let i = 0; i < inputText.length; i++){
      if(inputText[i].value === "") return;
    }
    UpdateFormValues();
    
    SetInputCheck(true);
  }
  // 매니저
  const SignUpManager = () => {
    console.log(currentMsgIdx);
    if(currentMsgIdx >= culiMsg.length-1){
      console.log("로그인 이동");
      // 이 부분 수정할 것 로ㅓ그인 페이지 이동 안됨
      Timer(2, Navigate("login"));
    }
    if(!isForm){
      SignUpMsg();
    }
  };
  const SetInputCheck = (state) => {
    
    setInputCheck(state);
  }
  const SetPage = () => {
    setPageIdx(pageIdx + 3);
  }
  const SetFormDisplay = (state) => {
    setIsForm(state);
  }
  const SignUpMsg = () => {
    const cnt = Object.keys(culiMsg).length;
    if (currentMsgIdx < cnt) {
      setMsg(culiMsg[currentMsgIdx]);
      setcurrentMsgIdx(currentMsgIdx + 1);
    }
    if ([1,2,3].includes(currentMsgIdx)) {
      SetFormDisplay(true);
    } else {
      SetFormDisplay(false);
    }
  };
  const RenderInputs = () => {
    const inputGroups = [];
    for (let i = pageIdx; i < pageIdx + 3 &&  i < inputBGData.length; i++) {
      if(i < inputBGData.length - 1){
        inputGroups.push(
          <div className="inputBG" key={i}>
            <img 
              className="inputImg" 
              src={inputBGData[i].iconSrc} 
              alt=""
            />
            <input
                className="inputText"
                type={i === 1 || i === 2 ? "password" : "text"}
                name={inputBGData[i].name}
                placeholder={inputBGData[i].placeholder}
                onChange={InputNullCheck}
            />
          </div>
        );
      }
      else{
        inputGroups.push(
          <div className="inputBGBtn" key={i}>
            <img 
              className="inputImg" 
              src={inputBGData[i].iconSrc} 
              alt=""
            />
            <input
                className="inputBtn"
                type="button"
                name="phone"
                style={{backgroundColor:"#b1dbfa"}}
                value={inputBGData[i].placeholder}
            />
          </div>
        );
      }
    }
    return inputGroups;
  };
  const UpdateFormValues = () => {
    const inputText = document.getElementsByClassName("inputText");
    
    for(let i = 0; i < inputText.length; i++){
      if(formValues.hasOwnProperty(inputText[i].name)){
        setFormValues(prevState => ({
          ...prevState,
          [inputText[i].name]: inputText[i].value
        }));
      }
    }
  }
  const NextPage = () => {
    SignUpMsg();
    SetPage();
    SetInputCheck(false);
    //UpdateFormValues();
    console.log(formValues);
  }

  return (
    <div className="signUp">
      <div className="div" onClick={() => SignUpManager()}>
        <div className="overlap-group">
          <div className="rectangle">
            <img
              className="polygon"
              alt="Polygon"
              src={GetIcon("polygon.png")}
            />
            <span id="signUpText">{msg}</span>
          </div>
          <img className="robot" alt="Robot" src={GetIcon("robot-white.png")} />
        </div>
        <div className="box">
        {isForm && (
          <form className="signUpForm" id="signUpForm">
            <div className="inputBoxBG1">
              {<RenderInputs/>}
            </div>
            <input
              id="submitBtn"
              type="button"
              value="다음으로"
              style={{ opacity: isInputCheck ? 1.0 : 0.5 }}
              disabled={isInputCheck ? false : true}
              onClick={NextPage}
            />
          </form>
        )} 
        </div>
      </div>
    </div>
  );
};
