import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GetIcon from "./modules/GetIcon";
import "./style.css";
import { GetSex, GetName } from "./modules/DataRouter";

// css
const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
`;
const Text = styled.span`
  text-align: ${(props) => props.align};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;
const EmptyContainer = styled.div`
  width: ${(props) => props.width};
`;
const InputContainer = styled.div`
  width: 285px;
  height: 47px;
  border-radius: 6px;
  background: ${(props) => props.bg};
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;
const InputImg = styled.img`
  width: ${(props) => props.width};
  margin-left: ${(props) => props.left};
`;
const InputTag = styled.input`
  width: 210px;
  margin-left: 10px;
  color: #939393;
  border: none;
  background-color: #eae8e8;
  outline: none;
`;
const Button = styled.button`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  font-size: ${(props) => props.size};
  background-color: ${(props) => props.bg};
  border-radius: ${(props) => props.radius};
`;
export const MyPage = () => {
  const [sexImg, setSexImg] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    const GetSexData = async () => {
      const sex = await GetSex();
      setSexImg(sex);
    };
    const GetNameData = async () => {
      const name = await GetName();
      setName(name);
    };
    GetSexData();
    GetNameData();
  }, []);
  return (
    <div className="myPage">
      <div className="div">
        <CenterBox>
          <EmptyContainer width="80%">
            <Text color={"#3252C2"} size={"15px"} style={{marginLeft: "5px"}}>
              <span style={{ fontWeight: "bold" }}>CULISO </span>
              <span style={{ color: "#4B66C8" }}>MyPage</span>
            </Text>
            <InputContainer bg={"none"}>
              <InputImg src={GetIcon(sexImg)} width={"50px"}/>
              <EmptyContainer>
                <EmptyContainer style={{display:"flex", alignItems:"center"}}>
                  <Text style={{marginLeft: "10px"}} size={"17px"}>{name}</Text>
                  <InputImg src={GetIcon("mypage-modify.png")} width={"14px"} left={"8px"}/> {/*여기에 수정 온클릭 삽입*/}
                </EmptyContainer>
                <Button height={"20px"} size={"12px"} bg={"#FFFFFF"} radius={"10px"} style={{border:"0.3px solid black", marginLeft: "10px"}}>내 정보 수정</Button>
                
              </EmptyContainer>
            </InputContainer>
          </EmptyContainer>
        </CenterBox>
        
      </div>
    </div>
  );
};
