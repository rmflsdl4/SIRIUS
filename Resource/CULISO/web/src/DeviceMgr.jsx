import React, { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import { GetIcon } from "./GetIcon";
import { DeviceMgrInitData } from "./InitTableData";

export const DeviceMgr = () => {
    const navigate = useNavigate();
    const [page, setPage] =  useState(1);
    const [limit, setLimit] = useState(5);
    // 입력된 검색어 상태
    const [searchTerm, setSearchTerm] = useState('');
    // 테이블 데이터 상태
    const [tableData, setTableData] = useState(DeviceMgrInitData);

    // 검색어 입력 시 상태 업데이트
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 검색 버튼 클릭 시 필터링된 데이터 보여주기
    const handleSearch = () => {
        // 검색어가 비어있으면 전체 테이블 데이터를 사용
        const filteredData = searchTerm ? tableData.filter(item =>
                item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.date.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : DeviceMgrInitData;

        // 필터링된 데이터로 테이블 데이터 업데이트
        setTableData(filteredData);
    };

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    // 페이지 변경 시 현재 페이지 데이터 업데이트
    // useEffect(() => {
    //     const startIndex = (page - 1) * limit;
    //     const endIndex = startIndex + limit;
    //     const slicedData = tableData.slice(startIndex, endIndex);
    //     setTableData(slicedData);
    // }, [page, limit, tableData]);


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
                                <img className="selectArrow" alt="Polygon" src={GetIcon("Polygon1.png")} />
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
                    
                    <div className="selectMenuTitle">기기 관리</div>
                    
                    <div className="searchInput">
                        <img className="searchInputImage" alt="Image" src={GetIcon("iot.png")} />
                        <input
                            className="searchText"
                            type="text"
                            placeholder="기기명"
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="searchBtn" onClick={handleSearch}>검색</button>

                    <div className="serchResult">검색결과 : 총 <span className="userNum">{tableData.length}개</span></div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                    <th className="checkBox"><input type="checkbox" /></th>
                                    <th>번호</th>
                                    <th>모델명</th>
                                    <th>기기 타입</th>
                                    <th>제조사</th>
                                    <th>등록일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="checkBox"><input type="checkbox" /></td>
                                        <td>{item.id}</td>
                                        <td>{item.model}</td>
                                        <td>{item.type}</td>
                                        <td>{item.manufacturer}</td>
                                        <td>{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 삭제 버튼 */}
                    <div className="deleteButtonDiv">
                        <button className="boardDeleteButton">삭제</button>
                        <button className="boardCreateButton">기기 등록</button>
                    </div>

                    {/* 페이징 버튼 */}
                    
                    
                    
                </div>
            </div>
        </div>
    );
};
