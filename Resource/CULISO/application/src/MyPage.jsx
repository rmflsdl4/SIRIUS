import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./style.css";
import { GetSex } from "./modules/DataRouter";

// css
const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
`;
const Text = styled.p`
  text-align: ${(props) => props.align};
  width: 331px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;
const InputContainer = styled.div`
  width: 285px;
  height: 47px;
  border-radius: 6px;
  background: #eae8e8;
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;
const InputImg = styled.img`
  width: 22px;
  margin-left: 20px;
`;
const InputTag = styled.input`
  width: 210px;
  margin-left: 10px;
  color: #939393;
  border: none;
  background-color: #eae8e8;
  outline: none;
`;

export const MyPage = () => {
  const [sexImg, setSexImg] = useState();

  useEffect(() => {
    // 주소 얻는 메소드
    const GetAddr = async () => {
      const sex = await GetSex();
      setSexImg(sex);
    };

    GetAddr();
  }, []);
  return (
    <div className="myPage">
      <div className="div">
        <Text color={"#3252C2"} size={"15px"}>
          <span style={{ fontWeight: "bold" }}>CULISO</span>{" "}
          <span style={{ color: "#4B66C8" }}>Account</span>
        </Text>
        <InputImg src={sexImg} />
      </div>
    </div>
  );
};
