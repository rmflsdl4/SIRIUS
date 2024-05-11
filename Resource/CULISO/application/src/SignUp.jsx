import React, { useState, useRef } from "react";
import GetIcon from "./modules/GetIcon";
import { TimerNavigate } from "./modules/Navigate";
import "./style.css";


const culiMsg = {
  0: "지금부터 회원가입을\n도와드릴게요!",
  1: "먼저 아이디와 비밀번호를\n입력해 주세요!",
  2: "이번에는 이름과 별명,\n그리고 주소를 입력해 주세요!",
  3: "마지막으로 전화번호를\n입력하고 인증을 받아주세요!",
  4: "회원가입이 완료되었습니다!\n다시 한 번 환영합니다!",
  5: "로그인 화면으로 안내해 드릴게요!\n잠시만 기다려주세요",
};
const addExplanArr = [
  "6-30자 이내, 영문/숫자 사용 가능",
  "8-30자 이내, 영문/숫자/기호 사용 가능",
  "8-30자 이내, 영문/숫자/기호 사용 가능",
  "1-20자 이내, 영문/한글 사용 가능",
  "1-30자 이내, 영문/한글/숫자 사용 가능",
  "30자 이내, 영문/한글/숫자 사용 가능"
];
// 유효성 검사
const ValidationCheck = () => {

}
// 회원가입
export const SignUp = () => {
  const [msg, setMsg] = useState("안녕하세요!\n저는 당신을 도와드릴 큐리에요");
  const [currentMsgIdx, setcurrentMsgIdx] = useState(0);
  const [isForm, setIsForm] = useState(false);
  const isInputCheck = useRef(false);
  const btn = useRef();
  const [pageIdx, setPageIdx] = useState(0);
  const formValues = useRef({
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
    { iconSrc: GetIcon("phone-gray.png"), placeholder: "전화번호 (- 없이 숫자만 입력)", name: "phoneNum" },
    { iconSrc: GetIcon("confirm-white.png"), placeholder: "전화번호 인증하기", name: "phoneID", button: true },
  ];

  
  const InputNullCheck = () => {
    const inputText = document.getElementsByClassName("inputText");
    for(let i = 0; i < inputText.length; i++){
      if(inputText[i].value === "") {
        console.log("하나 이상 공백임 : " + isInputCheck.current);
        isInputCheck.current = false;
        return;
      }
    }
    console.log("공백 하나도 없음 : " + isInputCheck.current);
    isInputCheck.current = true;
  }
  
  const OnChangeHandler = (e) =>{
    const { name, value } = e.target;
    formValues.current[name] = value;
    // setFormValues(prevState => ({
    //   ...prevState,
    //   [name]: value
    // }));
    console.log(formValues);
    InputNullCheck();
    btn.current.style.opacity = isInputCheck.current ? 1.0 : 0.5;
    //btn.current.disabled = !isInputCheck.current;
  }
  // 매니저
  const SignUpManager = () => {
    if(btn.current) console.log("버튼 상태 "+btn.current.disabled);
    if(!isForm){
      SignUpMsg();
    }
  };
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
      if(currentMsgIdx === cnt - 1 ) TimerNavigate(2, "login");
    }
    if ([1,2,3].includes(currentMsgIdx)) {
      SetFormDisplay(true);
    } else {
      SetFormDisplay(false);
    }
  };
  const BoxStyleChangeOn = (e) =>{
    e.target.parentNode.style.outline='2px solid #bebebe';
  }
  const BoxStyleChangeOff = (e) =>{
    e.target.parentNode.style.outline='none';
  }
  const SetBoxHeight = () =>{
    const boxHeight = document.getElementsByClassName("parentBox");
    let totalHeight = 0;
    for(let i = 0; i < boxHeight.length; i++){
      totalHeight += parseInt(boxHeight[i].style.height) + 7;
    }
    return totalHeight;
  }
  const RenderInputs = () => {
    const inputGroups = [];
    for (let i = pageIdx; i < pageIdx + 3 &&  i < inputBGData.length; i++) {
      if(i < inputBGData.length - 1){
        inputGroups.push(
          <div className="parentBox">
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
                  value={formValues[inputBGData[i].name]}
                  placeholder={inputBGData[i].placeholder}
                  onChange={OnChangeHandler}
                  onFocus={BoxStyleChangeOn}
                  onBlur={BoxStyleChangeOff}
              />
            </div>
            {i < inputBGData.length - 2 && <p className="addExplan">{addExplanArr[i]}</p>}
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
  const NextPage = () => {
    if (!isInputCheck.current) {
      return; // 버튼이 비활성화된 경우 클릭 이벤트 처리하지 않음
    }
    SignUpMsg();
    SetPage();
    isInputCheck.current = false;
    btn.current.style.opacity = isInputCheck.current ? 1.0 : 0.5;
    console.log(formValues);
    console.log("다음");
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
            <div className="inputBoxBG1" style={{height: SetBoxHeight, paddingTop: '15px', paddingBottom: '15px'}}>
              {<RenderInputs/>}
            </div>
            <input
              id="submitBtn"
              type="button"
              value="다음으로"
              ref={btn}
              style={{opacity: 0.5}}
              onClick={NextPage}
            />
          </form>
        )} 
        </div>
      </div>
    </div>
  );
};
