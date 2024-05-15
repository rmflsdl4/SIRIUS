import React, { useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import { CustomStyles } from "./modules/ModalComponent";
import { AdminMainViewDetails, ProfileViewDetails, BoardMgrViewDetails, RequestMgrViewDetails } from "./modules/sendData";        // 모달 팝업창 데이터 전송
import { RequestMgrInitData } from "./modules/InitTableData";
import { GetIcon } from "./modules/GetIcon";

// 모달이 열릴 때 사용할 DOM 요소를 지정합니다.
Modal.setAppElement('#root');

export const RequestMgr = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [isOpen, setIsOpen] = useState(false); // 상세보기 팝업 상태


    // 입력된 검색어 상태
    const [searchTerm, setSearchTerm] = useState('');
    // 테이블 데이터 상태
    const [tableData, setTableData] = useState(RequestMgrInitData);

    // 검색어 입력 시 상태 업데이트
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 시 필터링된 데이터 보여주기
    const handleSearch = () => {
        // 검색어가 비어있으면 전체 테이블 데이터를 사용
        const filteredData = searchTerm ? tableData.filter(item =>
                item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.requestTime.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : RequestMgrInitData;

        // 필터링된 데이터로 테이블 데이터 업데이트
        setTableData(filteredData);
    };


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
                    
                    <div className="searchInput">
                        <img className="searchInputImage" alt="Image" src={GetIcon("profile-gray.png")} />
                        <input
                            className="searchText"
                            type="text"
                            placeholder="회원명"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="searchBtn" onClick={handleSearch}>검색</button>

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
                                <th>제목</th>
                                <th>상태</th>
                                <th>요청시간</th>
                                <th>상세보기</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="checkBox"><input type="checkbox" /></td>
                                        <td>{index + 1}</td>
                                        <td className="modalSendData">{item.id}</td>
                                        <td>{item.username}</td>
                                        <td>{item.title}</td>
                                        <td>{item.status}</td>
                                        <td>{item.requestTime}</td>
                                        <td className="mgr">
                                            <button className="mgrDetailBtn" id="requestMgrDetail" onClick={(event) => { openModal();  }}>
                                                <span className="mgrModify">상세보기</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
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
