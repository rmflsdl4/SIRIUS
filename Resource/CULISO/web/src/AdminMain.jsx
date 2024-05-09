import React from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";

// 이미지 받아오기
function GetIcon(iconName) {
    return process.env.PUBLIC_URL + "/" + iconName;
}

function goToPage(name) {
    window.location.href = "/" + name;
}

export const AdminMain = () => {
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
                                <div className="mgrText"><span className="selectMgrText">기기 관리</span></div>
                            </li>
                            <li>    
                                <img className="mgrImg" alt="User" src={GetIcon("help-call.png")} />
                                <div className="mgrText"><span className="selectMgrText">요청 관리</span></div>
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
                                    <button className="viewDetailsBtn">
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
        </div>
    );
};
