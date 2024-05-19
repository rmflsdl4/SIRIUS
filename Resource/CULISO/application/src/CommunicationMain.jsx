import React, { useState } from "react";
import GetIcon from "./modules/GetIcon";
import { Navigate } from "./modules/Navigate";
import styled from 'styled-components';
import "./style.css";

// css
const TopBar = styled.div`
  display: flex;
  align-items: center;  // 수직 중앙 정렬
  justify-content: space-between;  // 수평 분산
  height: 50px;
  padding: 0 20px;  // 양쪽 패딩 추가
`;
const TopImg = styled.div`
  width: 22px;
`;
const MainTitle = styled.div`
  font-weight: bold;
`;
const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const MenuBar = styled.div`
  display: flex;
  align-items: center;  // 수직 중앙 정렬
  justify-content: space-between;  // 수평 분산
  height: 50px;
  padding: 0 50px;  // 양쪽 패딩 추가
`;
const MenuText = styled.span`
  font-size: 0.8em;
  color: white;
  color: ${(props) => props.active ? 'black' : 'white'};
  text-decoration: ${(props) => props.active ? 'underline' : 'none'};
`;
const CommunityContents = styled.div`
  width: 320px;
  height: 150px;
  border-radius: 15px;
  background-color: white;
`;
const ContentsTitle = styled.div`
  width: 300px;
  height: 20px;
  padding: 8px 10px 0px 10px;  // 양쪽 패딩 추가
  font-size: 0.8em;
  font-weight: bold;
`;
const Contents = styled.div`
  width: 300px;
  height: 70px;
  padding: 10px 10px 10px 10px;  // 양쪽 패딩 추가
  font-size: 0.5em;
`;
const Element = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  height: 25px;
  padding: 0px 10px 8px 10px;  // 양쪽 패딩 추가
  font-size: 0.9em;
`;
const RecommendAndContentsNum = styled.span`
  margin-right: 5px;
  img {
    display: inline-block;
    max-width: 22px;
  }
`;

export const CommunicationMain = () => {
    const [activeMenu, setActiveMenu] = useState(0);

    return (
        <div className="cdiv">
          <TopBar>
            <TopImg><img src={GetIcon("backArrow.png")}></img></TopImg>
            <MainTitle>CULISO</MainTitle>
            <TopImg><img src={GetIcon("alarm.png")}></img></TopImg>
          </TopBar>

          <TopBar>
              <div className="profileBox" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={GetIcon("userProfile.png")} style={{width : "39px"}}></img>
                <div className="profileCon" style={{display : "inline-block", marginLeft : "8px"}}>
                  <span className="userName" style={{display : "block", fontSize: '1.0em', fontWeight: "bold"}}>홍길동</span>
                  <span className="welcomeCone" style={{display : "block", fontSize: '0.6em'}}>안녕하세요. 반갑습니다.</span>
                </div>
              </div>
              <TopImg><img src={GetIcon("plus2.png")}></img></TopImg>
          </TopBar>

          <MenuBar>
            <MenuText active={activeMenu === 0} onClick={() => setActiveMenu(0)}>모아 보기</MenuText>
            <MenuText active={activeMenu === 1} onClick={() => setActiveMenu(1)}>정보 공유</MenuText>
            <MenuText active={activeMenu === 2} onClick={() => setActiveMenu(2)}>소통 마당</MenuText>
          </MenuBar>
          
          <CenterBox>
            <div className="CommunityContentsBox" style={{ margin: "10px 0" }}>
              <CommunityContents>
                <ContentsTitle>커뮤니티 공지사항</ContentsTitle>
                <Contents>안녕하세요</Contents>
                <Element>
                  <RecommendAndContentsNum><img src={GetIcon("recommend.png")}></img></RecommendAndContentsNum>
                  <RecommendAndContentsNum>56</RecommendAndContentsNum>
                  <RecommendAndContentsNum><img src={GetIcon("comments.png")}></img></RecommendAndContentsNum>
                  <RecommendAndContentsNum>21</RecommendAndContentsNum>
                </Element>
              </CommunityContents>
            </div>

            <div className="CommunityContentsBox" style={{ margin: "10px 0" }}>
              <CommunityContents>
                <ContentsTitle>커뮤니티 공지사항</ContentsTitle>
                <Contents>안녕하세요</Contents>
                <Element>
                  <RecommendAndContentsNum><img src={GetIcon("recommend.png")}></img></RecommendAndContentsNum>
                  <RecommendAndContentsNum>56</RecommendAndContentsNum>
                  <RecommendAndContentsNum><img src={GetIcon("comments.png")}></img></RecommendAndContentsNum>
                  <RecommendAndContentsNum>21</RecommendAndContentsNum>
                </Element>
              </CommunityContents>
            </div>

            <div className="CommunityContentsBox" style={{ margin: "10px 0" }}>
              <CommunityContents>
                <ContentsTitle>커뮤니티 공지사항</ContentsTitle>
                <Contents>안녕하세요</Contents>
                <Element>
                  <RecommendAndContentsNum><img src={GetIcon("recommend.png")}></img></RecommendAndContentsNum>
                  <RecommendAndContentsNum>56</RecommendAndContentsNum>
                  <RecommendAndContentsNum><img src={GetIcon("comments.png")}></img></RecommendAndContentsNum>
                  <RecommendAndContentsNum>21</RecommendAndContentsNum>
                </Element>
              </CommunityContents>
            </div>
          </CenterBox>
        </div>
    );
};