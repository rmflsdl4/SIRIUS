import React, { useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import customStyles from "./ModalComponent";
import { GetIcon } from "./GetIcon";

export const AdminMain = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [isOpen, setIsOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("boardList"); // 기본값은 "게시글 목록"

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

    return (
        <div className="AdminMain">
            <div className="main-overlap-wrapper">
                <div className="main-overlap">
                    <div className="adminMgrList">
                        <ul>
                            <li>
                                <img className="mgrImg" alt="Help call" src={GetIcon("profile-gray.png")} />
                                <div className="mgrText"><span className="selectMgrText" onClick={()=> goToPage("")}>회원 관리</span></div>
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
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
                            </li>
                        </ul>
                    </div>

                    <div className="topDiv" />
                    <div className="topDivText">admin Msg</div>
                    
                    <div className="contents" />
                    
                    <div className="selectMenuTitle">회원 관리</div>
                    
                    <div className="serchInput">
                        <img className="serchInputImage" alt="Image" src={GetIcon("serchUser.png")} />
                        <input className="serchText" type="text" placeholder="회원명" />
                    </div>
                    <button className="serchBtn">검색</button>

                    <div className="serchResult">검색결과 : 총 <span className="userNum">1명</span></div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                <th className="checkBox"><input type="checkbox" /></th>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>닉네임</th>
                                <th>상태</th>
                                <th>가입일</th>
                                <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td className="checkBox"><input type="checkbox" /></td>
                                <td>1</td>
                                <td>gildong01</td>
                                <td>홍길동</td>
                                <td>정상</td>
                                <td>2024.04.29</td>
                                <td className="userListMgr">
                                    <button className="viewDetailsBtn" onClick={openModal}>
                                        <img className="viewDetailsImage" alt="Image" src={GetIcon("profile-gray.png")} />
                                        <span className="viewDetails">상세보기</span>
                                    </button>
                                    <button className="viewDetailsBtn">
                                        <img className="viewDetailsImage" alt="Image" src={GetIcon("profile-gray.png")} />
                                        <span className="viewDetails">프로필카드</span>
                                    </button>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 삭제 버튼 */}
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

            {/* 모달팝업 창 */}
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 메뉴바 */}
                <div className="modalMenu">
                    <span className={selectedMenu === "boardList" ? "boardList active" : "boardList"} onClick={() => handleMenuChange("boardList")}>게시글 목록</span>
                    <span className={selectedMenu === "deviceList" ? "deviceList active" : "deviceList"} onClick={() => handleMenuChange("deviceList")}>기기 요청 목록</span>
                    <span><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
                </div>

                {/* 게시글 목록 내용 */}
                <section className="modalContent">
                    {selectedMenu === "boardList" && (
                        /* 게시글 검색 조건들 */
                        <div className="modalBoardListRoot">
                            <div className="searchRequirementBox">
                                <table className="searchRequirementTb">
                                    <tr>
                                        <td className="elementLeft">게시판 선택</td>
                                        <td className="elementRight">
                                            <select>
                                                <option value="information">정보 공유 게시판</option>
                                                <option value="Communication">소통마당</option>
                                            </select>
                                        </td>
                                    </tr>
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

                            {/* 게시글 검색 리스트 */}
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

                            <div className="blockingBox">
                                <button className="blockingBtn">차단</button>
                            </div>
                        </div>
                    )}
                    {selectedMenu === "deviceList" && (
                        /* 게시글 검색 조건들 */
                        <div className="modalBoardListRoot">
                            {/* 기기 요청 검색 조건들 */}
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

                            {/* 기기 요첨 검색 리스트 */}
                            <div className="modalSerchResultBox">
                                <table className="modalUserBoardListTb">
                                    <thead>
                                        <tr>
                                            <th className="modalCheckBox"><input type="checkbox" /></th>
                                            <th>번호</th>
                                            <th>모델명</th>
                                            <th>기기 타입</th>
                                            <th>제조사</th>
                                            <th>내용</th>
                                            <th>요청일</th>
                                            <th>사진</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="modalCheckBox"><input type="checkbox" /></td>
                                            <td>1</td>
                                            <td>AS191DK1</td>
                                            <td>에어컨</td>
                                            <td>LG</td>
                                            <td>LG 기기 등록 요청합니다.</td>
                                            <td>2024.04.29</td>
                                            <td><img className="deviceImg" alt="Image" src={GetIcon("air-conditioner.png")} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </section>
            </Modal>
        </div>
    );
};
