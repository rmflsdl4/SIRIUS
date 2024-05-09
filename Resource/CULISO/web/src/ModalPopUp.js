import React, { useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import { GetIcon } from "./GetIcon";

{/* 모달팝업 게시글 목록 */}
export const modalUserBoardList = () => {
    return (
        <div className="modalUserBoardListRoot">
            <div className="modalTop">
                <span className="modalTopTxt">admin Msg</span>
            </div>

            {/* 메뉴바 */}
            <div className="modalMenu">
                <span className="boardList">게시글 목록</span>
                <span className="deviceList">기기 요청 목록</span>
                <span><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
            </div>

            {/* 게시글 목록 내용 */}
            <section className="modalContent">
                {/* 게시글 검색 조건들 */}
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
            </section>
        </div>
    )
}

{/* 모달팝업 기기 요청 목록 */}
export const modalUserDeviceRequestList = () => {
    <div className="modalUserDeviceRequestListRoot">
        <div className="modalTop">
            <span className="modalTopTxt">admin Msg</span>
        </div>

        {/* 메뉴바 */}
        <div className="modalMenu">
            <span className="boardList">게시글 목록</span>
            <span className="deviceList">기기 요청 목록</span>
            <span><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
        </div>

        {/* 게시글 목록 내용 */}
        <section className="modalContent">
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
        </section>
    </div>
}