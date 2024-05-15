import React, { useState, useEffect } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"
import { CustomStyles, ProfileCardStyles } from "./modules/ModalComponent";
import { GetIcon } from "./modules/GetIcon";
import { ViewDetails } from "./modules/sendData";        // 모달 팝업창 데이터 전송
import { AdminMainMgrInitData } from "./modules/InitTableData";     // 메인 화면들 초기 데이터
import { useCheckboxFunctions } from "./modules/checkBox";          // 체크 박스 선택 모듈


// 모달이 열릴 때 사용할 DOM 요소를 지정합니다.
Modal.setAppElement('#root');

export const AdminMain = () => {
    const navigate = useNavigate();

    function goToPage(name) {
        let url = "/" + name;
        navigate(url);
    }

    const [isOpen, setIsOpen] = useState(false); // 상세보기 팝업 상태
    const [isOpenProfileCard, setIsOpenProfileCard] = useState(false); // 프로필카드 팝업 상태
    const [selectedMenu, setSelectedMenu] = useState("boardList"); // 기본값은 "게시글 목록"
    const [searchTerm, setSearchTerm] = useState('');       // 입력된 검색어 상태
    const [tableData, setTableData] = useState([]);         // 메인 테이블 데이터 상태
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await AdminMainMgrInitData();
                setTableData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const { selectAll, checkedItems, handleSelectAll, handleCheckboxChange } = useCheckboxFunctions(tableData);

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
                item.usernickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.registrationDate.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : AdminMainMgrInitData;

        // 필터링된 데이터로 테이블 데이터 업데이트
        setTableData(filteredData);
    };

    // 모달 팝업 창 설정 함수들
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
    const openProfileCard = () => {
        setIsOpenProfileCard(true);
    }
    const closeProfileCard = () => {
        setIsOpenProfileCard(false);
    }

    // 모달 팝업 창 버튼 클릭시 해당 데이터 DB에서 받아오기
    function handleViewDetailsClick (event) {
        // 클릭된 버튼의 id를 가져옵니다.
        const button = event.target.closest('button');
        const buttonId = button.id;
        console.log("Clicked button id:", buttonId);
    
        // 클릭된 버튼의 부모 요소인 <td> 태그를 찾습니다.
        const tdElement = event.target.closest('td');
        if (tdElement) {
            // tdElement의 부모인 tr 요소에서 'modalSendData' 클래스를 가진 td 태그를 선택합니다.
            const idElement = tdElement.parentNode.querySelector('td.modalSendData');
            if (idElement) {
                // 선택된 td 태그의 텍스트 콘텐츠를 가져옵니다.
                const modalSendData = idElement.textContent.trim();
                console.log("id : " + modalSendData);
                
                let path = "";
                // 가져온 아이디 값을 서버로 전송합니다.
                switch (buttonId) {
                    case "adminMainDetail" :
                        console.log("AdminMainViewDetails");
                        path = "adminMainViewDetails";
                        ViewDetails(modalSendData, path);
                        break;
                    case "adminMainDetail" :
                        console.log("AdminMainViewDetails");
                        path = "adminMainViewDetails";
                        ViewDetails(modalSendData, path);
                        break;
                    case "adminMainProfile" :
                        console.log("ProfileViewDetails");
                        path = "profileViewDetails";
                        ViewDetails(modalSendData, path);
                        break;
                    // case "boardMgrDetail" :
                    //     console.log("BoardMgrViewDetails");
                    //     path = "boardMgrViewDetails";
                    //     ViewDetails(modalSendData, path);
                    //     break;
                    // case "requestMgrDetail" :
                    //     console.log("RequestMgrViewDetails");
                    //     path = "requestMgrViewDetails";
                    //     ViewDetails(modalSendData, path);
                    //     break;
                    default:
                        console.error("Unhandled button id:", buttonId);
                }
                
            } else {
                console.error('아이디를 찾을 수 없습니다.');
            }
        } else {
            console.error('버튼의 부모 요소를 찾을 수 없습니다.');
        }
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

                    <div className="serchResult">검색결과 : 총 <span className="userNum">{tableData.length}명</span></div>
                    
                    <div className="userListBox" >
                        <table className="userListTable">
                            <thead>
                                <tr>
                                <th className="checkBox"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
                                <th>번호</th>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>닉네임</th>
                                <th>가입일</th>
                                <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((user, index) => (
                                    <tr key={index}>
                                        <td className="checkBox">
                                        <input
                                            type="checkbox"
                                            checked={checkedItems[index]}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                        </td>
                                        <td>{index + 1}</td>
                                        <td className="modalSendData">{user.userID}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.userNickName}</td>
                                        <td>{user.createDate}</td>
                                        <td className="userListMgr">
                                            <button className="viewDetailsBtn" id="adminMainDetail" onClick={(event) => { openModal(); handleViewDetailsClick(event); }}>
                                                <img className="viewDetailsImage" alt="Image" src={GetIcon("profile-gray.png")} />
                                                <span className="viewDetails">상세보기</span>
                                            </button>
                                            <button className="viewDetailsBtn" id="adminMainProfile" onClick={(event) => { openProfileCard(); handleViewDetailsClick(event); }}>
                                                <img className="viewDetailsImage" alt="Image" src={GetIcon("profile-gray.png")} />
                                                <span className="viewDetails">프로필카드</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
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

            {/* 상세보기 모달팝업 창 */}
            <Modal isOpen={isOpen} onRequestClose={closeModal} style={CustomStyles}>
                <div className="modalTop">
                    <span className="modalTopTxt">admin Msg</span>
                </div>

                {/* 메뉴바 */}
                <div className="modalMenu">
                    <span className={selectedMenu === "boardList" ? "boardList active" : "boardList"} id="adminMainDetailBoardList" onClick={() => handleMenuChange("boardList")}>게시글 목록</span>
                    <span className={selectedMenu === "deviceList" ? "deviceList active" : "deviceList"} id="adminMainDetailDeviceList" onClick={() => handleMenuChange("deviceList")}>기기 요청 목록</span>
                    <span onClick={closeModal}><img className="closeBtn" alt="Image" src={GetIcon("close.png")} /></span>
                </div>

                {/* 게시글 목록 내용 */}
                <section className="modalContent">
                    {selectedMenu === "boardList" && (
                        // 게시글 검색 조건들
                        <div className="modalBoardListRoot">
                            <div className="searchRequirementBox">
                                <table className="searchRequirementTb">
                                    <tbody>
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
                                    </tbody>
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
                                            <th className="modalCheckBox"><input type="checkbox" checked={selectAll} onChange={handleSelectAll}/></th>
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
                                            <td className="modalCheckBox">
                                            <input
                                                type="checkbox"
                                                // checked={checkedItems[index]}
                                                // onChange={() => handleCheckboxChange(index)}
                                            />
                                            </td>
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
                                <button className="blockingBtn">삭제</button>
                            </div>
                        </div>
                    )}
                    {selectedMenu === "deviceList" && (
                        /* 게시글 검색 조건들 */
                        <div className="modalBoardListRoot">
                            {/* 기기 요청 검색 조건들 */}
                            <div className="searchRequirementBox">
                                <table className="searchRequirementTb">
                                    <tbody>
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
                                    </tbody>
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

            {/* 프로필카드 팝업 창 */}
            <Modal isOpen={isOpenProfileCard} onRequestClose={closeProfileCard} style={ProfileCardStyles}>
                <section className="profileCard">
                    <div className="profileCardTop">
                        <span className="profileCardState">정상</span>
                    </div>
                    
                    <table className="profileCardContent">
                        <tbody>
                            <tr className="profileCardContentRow">
                                <td className="profileCardUserImg">
                                    <img className="profileCardUser" alt="User" src={GetIcon("user.png")} />
                                </td>
                                <td className="profileCardUserInformation">
                                    <span className="profileCardUserName">홍길동</span>
                                    <span className="profileCardUserNickName">gildong01</span>
                                </td>

                                <td className="profileCardHubImg">
                                    <img className="profileCardUserHub" alt="Zigbee Hub" src={GetIcon("zigbee.png")} />
                                </td>
                                <td className="profileCardHubInformation">
                                    <span className="profileCardHubNum">ZB-3920XJ</span>
                                </td>
                            </tr>

                            <tr className="profileCardContentRow">
                                <td className="profileCardLocationImg">
                                    <img className="profileCardLocation" alt="location" src={GetIcon("location-pin.png")} />
                                </td>
                                <td className="profileCardLocationInformation">
                                    <span className="profileCardLocationName">광주대학교 남구 효덕로 277, 전산관 320호</span>
                                    <span className="profileCardLocationNum">503-703</span>
                                </td>

                                <td className="profileCardPhoneImg">
                                    <img className="profileCardPhoneImg" alt="phone" src={GetIcon("telephone.png")} />
                                </td>
                                <td className="profileCardPhoneInformation">
                                    <span className="profileCardPhoneNum">010-1234-1234</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="profileCardBottom">
                        <span className="profileCardDate">2024.04.29</span>
                    </div>
                </section>
            </Modal>
        </div>
    );
};
