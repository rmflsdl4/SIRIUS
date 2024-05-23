import React, { useState, useEffect } from "react";
import GetIcon from "./GetIcon";
import styled from 'styled-components';
import { ContentsValue, BoardContentsValue } from "./CommunityDataRouter";
import { useNavigate } from "react-router-dom";
import { ContentsComponent } from "./ContentsComponent";

const CommunityContentsBox = styled.div`
  margin: 10px 0;
`;
const CommunityContents = styled.div`
  width: 320px;
  height: 150px;
  border-radius: 15px;
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

const ContentsTitle = styled.div`
  width: 100%;
  height: 20%;  // 150px의 20%
  padding: 8px 10px 0px 10px;  // 양쪽 패딩 추가
  font-size: 0.8em;
  font-weight: bold;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

const Contents = styled.div`
  width: 100%;
  height: 60%;  // 150px의 60%
  padding: 10px 10px 10px 10px;  // 양쪽 패딩 추가
  font-size: 0.5em;
  white-space: normal;
  word-wrap: break-word;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

const Element = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20%;  // 150px의 20%
  padding: 0px 10px 8px 10px;  // 양쪽 패딩 추가
  font-size: 0.9em;
  box-sizing: border-box;  // 패딩을 포함한 너비와 높이를 계산
`;

const RecommendAndContentsNum = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  img {
    display: inline-block;
    width: 22px;
    height: 22px;
  }
`;
const MenuTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8em;
` 
const TitleLeft = styled.div`
  display: flex;
  align-items: center;
  font-size: inherit;  
`;

// const TitleRight = styled.span`
//   font-size: 0.5em; 
//   margin-right: 10px;
// `;

export const AllContents = ({ boardID }) => {
    const [contents, setContents] = useState([]);
    
    console.log("boardID : " + boardID);
    // 각 게시판 인기 게시글 데이터 DB에서 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ContentsValue(boardID);
                setContents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [boardID]);

    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    return(
        <div className="communityBoard">
            {contents.map((board, index) => (
                <CommunityContentsBox key={index}>
                    {boardID === 1 && (
                        <MenuTitle>
                            <TitleLeft>
                                <span style={{ marginLeft: "10px" }}>
                                    <img src={GetIcon("star.png")} alt="Star Icon" />
                                </span>
                                <span style={{ marginLeft: "5px" }}>{board.boardName}</span>
                            </TitleLeft>
                        </MenuTitle>
                    )}
                    <CommunityContents onClick={()=> goToPage(`contentsComponent?contentsNum=${board.contentsNum}`)}>
                        <ContentsTitle>{board.contentsTitle}</ContentsTitle>
                        <Contents>{board.content}</Contents> 
                        <Element>
                            <RecommendAndContentsNum><img src={GetIcon("recommend.png")} alt="Recommend Icon" /></RecommendAndContentsNum>
                            <RecommendAndContentsNum>{board.recommend}</RecommendAndContentsNum>
                            <RecommendAndContentsNum><img src={GetIcon("views2.png")} alt="Comments Icon" /></RecommendAndContentsNum>
                            <RecommendAndContentsNum>{board.views}</RecommendAndContentsNum>
                        </Element>
                    </CommunityContents>
                </CommunityContentsBox>
            ))}
        </div>
    );
};