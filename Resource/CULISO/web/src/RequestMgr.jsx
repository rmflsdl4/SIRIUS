import React, { useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import { GetIcon } from "./GetIcon";
import Modal from "react-modal"
import { CustomStyles } from "./ModalComponent";
import { handleViewDetailsClick } from "./sendData";

// 모달이 열릴 때 사용할 DOM 요소를 지정합니다.
Modal.setAppElement('#root');

export const RequestMgr = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [isOpen, setIsOpen] = useState(false); // 상세보기 팝업 상태

    const openModal = () => {
        setIsOpen(true);
    }
    
    const closeModal = () => {
        setIsOpen(false);
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
                            </li>
                            <li>
                                <img className="mgrImg" alt="Text" src={GetIcon("iot.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("deviceMgr")}>기기 관리</span></div>
                            </li>
                            <li>    
                                <img className="mgrImg" alt="User" src={GetIcon("help-call.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("requestMgr")}>요청 관리</span></div>
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
                            </li>
                        </ul>
                    </div>

                    <div className="topDiv" />
                    <div className="topDivText">admin Msg</div>
                    
                    <div className="contents" />
                    
                    <div className="selectMenuTitle">요청 관리</div>
                    
                    <div className="serchInput">
                        <img className="serchInputImage" alt="Image" src={GetIcon("serchUser.png")} />
                        <input className="serchText" type="text" placeholder="회원명" />
                    </div>
                    <button className="serchBtn">검색</button>

                    <div className="requestStateDiv">
                        <span className="requestNotComplete">요청 미완료</span>
                        <span className="requestComplete">요청 완료</span>
                    </div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                <th className="checkBox"><input type="checkbox" /></th>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>닉네임</th>
                                <th>재목</th>
                                <th>상태</th>
                                <th>요청시간</th>
                                <th>상세보기</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="checkBox"><input type="checkbox" /></td>
                                <td>1</td>
                                <td className="modalSendData">test1</td>
                                <td>에어컨좋아용</td>
                                <td>기기 등록 요청합니다.</td>
                                <td>미완료</td>
                                <td>2024.04.29 10:10</td>
                                <td className="mgr">
                                    <button className="mgrModifyBtn" onClick={(event) => { openModal(); handleViewDetailsClick(event); }}>
                                        <span className="mgrModify">상세보기</span>
                                    </button>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <button className="deleteButton">삭제</button>

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

            {/* 요청 관리 상세보기 모달팝업 창 */}
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 게시판 생성 내용 */}
                <section className="modalContent">
                    <div className="modalBoardMgrRoot">
                        <div className="modalRequestMgrBox">
                            <div className="requestImgBox">
                                <img className="requestImg" alt="Image" src={GetIcon("air-conditioner.png")} />
                            </div>
                        </div>

                        <div className="requestInformation">
                            <ul>
                                <li>제조사 : <span className="requestManufacturer">LG</span></li>
                                <li>모델명 : <span className="requestModelName">AS191DK1</span></li>
                                <li>기기 타입 : <span className="requestDeviceType">에어컨</span></li>
                            </ul>
                        </div>

                        <div className="requestCommentBox">
                            <textarea id="requestComment" rows="13" cols="80"></textarea>
                        </div>

                        <div className="boardMgrCompleteBox">
                            <button className="boardMgrCompleteBtn" onClick={closeModal}>돌아가기</button>
                        </div>
                    </div>
                </section>
            </Modal>
        </div>
    );
};
