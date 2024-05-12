import React, { useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import { CustomStyles } from "./ModalComponent";
import { GetIcon } from "./GetIcon";
import { handleViewDetailsClick } from "./sendData";

// 모달이 열릴 때 사용할 DOM 요소를 지정합니다.
Modal.setAppElement('#root');

export const BoardMgr = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [isOpen, setIsOpen] = useState(false); // 상세보기 팝업 상태
    const [isOpenBoardCreate, setIsOpenBoardCreate] = useState(false); // 게시판 생성 팝업 상태
    const [selectedMenu, setSelectedMenu] = useState("boardMgr"); // 기본값은 "게시판 수정"

    const openModal = () => {
        setIsOpen(true);
    }
    
    const closeModal = () => {
        setIsOpen(false);
    }

    // 메뉴를 변경하는 함수
    const handleMenuChange = (menu) => {
        setSelectedMenu(menu);
    }

    const openBoardCreate = () => {
        setIsOpenBoardCreate(true);
    }

    const closeBoardCreate = () => {
        setIsOpenBoardCreate(false);
    }

    return (
        <div className="AdminMain">
            <div className="main-overlap-wrapper">
                <div className="main-overlap">
                    <div className="adminMgrList">
                        <ul>
                            <li>
                                <img className="mgrImg" alt="Help call" src={GetIcon("profile-gray.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("")}>회원 관리</span></div>
                            </li>
                            <li>
                                <img className="mgrImg" alt="Iot" src={GetIcon("text.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("boardMgr")}>게시판 관리</span></div>
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
                            </li>
                            <li>
                                <img className="mgrImg" alt="Text" src={GetIcon("iot.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("deviceMgr")}>기기 관리</span></div>
                            </li>
                            <li>    
                                <img className="mgrImg" alt="User" src={GetIcon("help-call.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("requestMgr")}>요청 관리</span></div>
                            </li>
                        </ul>
                    </div>

                    <div className="topDiv" />
                    <div className="topDivText">admin Msg</div>
                    
                    <div className="contents" />
                    
                    <div className="selectMenuTitle">게시판 관리</div>
                    
                    <div className="serchInput">
                        <img className="serchInputImage" alt="Image" src={GetIcon("speech-bubble.png")} />
                        <input className="serchText" type="text" placeholder="게시판명" />
                    </div>
                    <button className="serchBtn">검색</button>

                    <div className="serchResult">검색결과 : 총 <span className="userNum">1개</span></div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                <th className="checkBox"><input type="checkbox" /></th>
                                <th>번호</th>
                                <th>게시판 이름</th>
                                <th>게시글 수</th>
                                <th>게시판 생성일</th>
                                <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="checkBox"><input type="checkbox" /></td>
                                <td>1</td>
                                <td className="modalSendData">정보 공유 게시판</td>
                                <td>3</td>
                                <td>2024.04.29</td>
                                <td className="mgr">
                                    <button className="mgrModifyBtn" onClick={(event) => { openModal(); handleViewDetailsClick(event); }}>
                                        <span className="mgrModify">수정</span>
                                    </button>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 삭제 버튼 */}
                    <div className="deleteButtonDiv">
                        <button className="boardDeleteButton">삭제</button>
                        <button className="boardCreateButton" onClick={openBoardCreate}>게시판 생성</button>
                    </div>

                    {/* 페이징 버튼 */}
                    <div className="rectangle-12" />
                    <div className="rectangle-13" />
                    <div className="rectangle-14" />
                    <div className="rectangle-15" />
                    <div className="rectangle-16" />
                    <div className="rectangle-17" />
                    <div className="text-wrapper-36">1</div>
                    <div className="text-wrapper-37">2</div>
                    <div className="text-wrapper-38">&lt;&lt;</div>
                    <div className="text-wrapper-39">&gt;</div>
                    <div className="text-wrapper-40">&lt;</div>
                    <div className="text-wrapper-41">&gt;&gt;</div>
                </div>
            </div>

            {/* 수정 모달팝업 창 */}
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 메뉴바 */}
                <div className="modalMenu">
                    <span className={selectedMenu === "boardMgr" ? "boardMgr active" : "boardMgr"} onClick={() => handleMenuChange("boardMgr")}>게시판 수정</span>
                    <span className={selectedMenu === "postMgr" ? "postMgr active" : "postMgr"} onClick={() => handleMenuChange("postMgr")}>게시글 관리</span>
                    <span onClick={closeModal}><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
                </div>

                {/* 게시글 목록 내용 */}
                <section className="modalContent">
                    {selectedMenu === "boardMgr" && (
                            // 게시글 검색 리스트
                            <div className="modalBoardMgrRoot">
                                <div className="modalMenuTitle">
                                    <span>게시판 수정</span>
                                </div>

                                <div className="modalBoardMgrBox">
                                    <table className="modalBoardMgrTb">
                                        <tbody>
                                            <tr>
                                                <td className="elementLeft">게시판 제목</td>
                                                <td className="elementRight"><input type="text" id="boardMgrTitle" /></td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">게시판 소개</td>
                                                <td className="elementRight"><textarea id="boardMgrComment" rows="10" cols="80"></textarea></td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">글읽기 권한</td>
                                                <td className="elementRight">
                                                <select className="readPermission">
                                                    <option value="allUser">모두</option>
                                                    <option value="generalUser">일반사용자</option>
                                                    <option value="adminUser">관리자</option>
                                                </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">글쓰기 권한</td>
                                                <td className="elementRight">
                                                <select className="writePermission">
                                                    <option value="information">정보 공유 게시판</option>
                                                    <option value="Communication">소통마당</option>
                                                </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="elementLeft">댓글쓰기 권한</td>
                                                <td className="elementRight">
                                                <select className="commentsWritePermission">
                                                    <option value="information">정보 공유 게시판</option>
                                                    <option value="Communication">소통마당</option>
                                                </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="boardMgrCompleteBox">
                                    <button className="boardMgrCompleteBtn">완료</button>
                                </div>
                            </div>
                    )}
                    {selectedMenu === "postMgr" && (
                        /* 게시글 관리 검색 조건들 */
                        <div className="modalBoardListRoot">
                            <div className="modalMenuTitle" id="postMgrTitle">
                                <span>정보 공유 게시판</span>
                            </div>

                            <div className="searchRequirementBox">
                                <table className="searchRequirementTb">
                                    <tr>
                                        <td className="elementLeft">등록일</td>
                                        <td className="elementRight">
                                            <input type="date" id="dateFrom"></input> ~ <input type="date" id="dateTo"></input>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">검색조건</td>
                                        <td className="elementRight">
                                        <input type="text" id="searchRequirement"></input>
                                        </td>
                                    </tr>
                                </table>
                                <div className="searchRequirementBtnDiv">
                                    <button className="searchRequirementBtn">검색</button>
                                </div>
                            </div>

                            <div className="modalSerchResult">
                                검색결과 : 총 <span className="modalSerchText">1</span>개
                            </div>

                            {/* 게시글 관리 검색 리스트 */}
                            <div className="modalSerchResultBox">
                                <table className="modalUserBoardListTb">
                                    <thead>
                                        <tr>
                                            <th className="modalCheckBox"><input type="checkbox" /></th>
                                            <th>번호</th>
                                            <th>게시판명</th>
                                            <th>제목</th>
                                            <th>등록일</th>
                                            <th>조회수</th>
                                            <th>추천</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="modalCheckBox"><input type="checkbox" /></td>
                                            <td>1</td>
                                            <td>정보 공유 게시판</td>
                                            <td>Iot 기기 뭐 사야해요?</td>
                                            <td>2024.04.29</td>
                                            <td>3</td>
                                            <td>0</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="postMgrbottom">
                                <div className="postMgrBtnBox">
                                    <button className="postMgrDeleteBtn">삭제</button>
                                    <button className="postMgrPrivateBtn">비공개</button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </Modal>
            
            {/* 게시판 생성 모달팝업 창 */}
            <Modal isOpen={isOpenBoardCreate} onRequestClose={closeBoardCreate} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 메뉴바 */}
                <div className="modalMenu">
                    <span onClick={closeBoardCreate}><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
                </div>

                {/* 게시판 생성 내용 */}
                <section className="modalContent">
                    <div className="modalMenuTitle">
                        <span>게시판 생성</span>
                    </div>
                    
                    <div className="modalBoardMgrRoot">
                        <div className="modalBoardMgrBox">
                            <table className="modalBoardMgrTb">
                                <tbody>
                                    <tr>
                                        <td className="elementLeft">게시판 제목</td>
                                        <td className="elementRight"><input type="text" id="boardMgrTitle" /></td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">게시판 소개</td>
                                        <td className="elementRight"><textarea id="boardMgrComment" rows="10" cols="80"></textarea></td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">글읽기 권한</td>
                                        <td className="elementRight">
                                        <select className="readPermission">
                                            <option value="allUser">모두</option>
                                            <option value="generalUser">일반사용자</option>
                                            <option value="adminUser">관리자</option>
                                        </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">글쓰기 권한</td>
                                        <td className="elementRight">
                                        <select className="writePermission">
                                            <option value="information">정보 공유 게시판</option>
                                            <option value="Communication">소통마당</option>
                                        </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="elementLeft">댓글쓰기 권한</td>
                                        <td className="elementRight">
                                        <select className="commentsWritePermission">
                                            <option value="information">정보 공유 게시판</option>
                                            <option value="Communication">소통마당</option>
                                        </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="boardMgrCompleteBox">
                            <button className="boardMgrCompleteBtn">완료</button>
                        </div>
                    </div>
                </section>
            </Modal>
        </div>
    );
};
