import React from "react";
import "./style.css";

// 이미지 받아오기
function GetIcon(iconName) {
  return process.env.PUBLIC_URL + "/" + iconName;
}
export const Main = () => {
  return (
    <div className="main">
      <div className="div">
        <div className="view">
          <div className="group">
            <div className="text-wrapper">회원가입</div>
            <img
              className="member-card"
              alt="Member card"
              src={GetIcon("join.png")}
            />
          </div>
        </div>
        <div className="overlap">
          <div className="group-2">
            <div className="text-wrapper-2">CULISO 로그인</div>
            <img
              className="closed-padlock"
              alt="Closed padlock"
              src={GetIcon("white-padlock.png")}
            />
          </div>
        </div>
        <img className="robot" alt="Robot" src={GetIcon("robot-white.png")} />
        <div className="overlap-group">
          <div className="overlap-group-wrapper">
            <div className="overlap-group-2">
              <img
                className="polygon"
                alt="Polygon"
                src={GetIcon("polygon.png")}
              />
              <div className="rectangle">
                <p className="p">큐리소에 오신 것을 환영합니다 !</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
