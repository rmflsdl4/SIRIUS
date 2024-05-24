
import { MenuBar } from "./MenuBar";
import GetIcon from "./modules/GetIcon";
import { Cookies } from "react-cookie";
import { Navigate } from "./modules/Navigate";
import styled from "styled-components";
import "./style.css";
import { useState, useEffect } from "react";
import { GetAddress, RequestAddress } from "./modules/DataRouter";
// css
const CenterBox = styled.div`
  display: flex;
  justify-content: ${(props) => props.align};
  align-items: center;
  margin-top: ${(props) => props.top};
`;

const Text = styled.span`
  text-align: ${(props) => props.align};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-family: ${(props) => props.font};
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 15px;
  cursor: pointer;
`;
const Img = styled.img`
  width: ${(props) => props.width};
  margin-top: ${(props) => props.top};
  color: ${(props) => props.color};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;
const EmptyContainer = styled.div`
  width: 300px;
  height: 295px;
  border-radius: 20px;
  background: #fafafa;
`;
const Button = styled.input`
  width: 129px;
  height: 35px;
  background-color: #b1dbfa;
  border: none;
  font-family: normal;
  font-weight: 700;
  margin-top: 35px;
  border-radius: 8px;
  font-size: 16px;
`;
const MenuBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 150px;
`;
const cookies = new Cookies();

function LogOut() {
  cookies.remove("token");
  alert("다음에도 큐리소를 이용해 주세요 !");
  window.location.href = "/login";
}
export const AfterMain = () => {
  const [address, setAddress] = useState();

  useEffect(() => {
    // 주소 얻는 메소드
    const GetAddr = async () => {
      const address = await GetAddress();
      setAddress(address);
      console.log("주소: " + address);
    };

    GetAddr();
  }, []);

  return (
    <div className="afterMain">
      <div className="afterMainDiv">
        <CenterBox align="space-between" top="50px">
          <Label>
            <Text
              size="12px"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px",
              }}
            >
              {address}
            </Text>
            <Img
              src={GetIcon("mypage-modify.png")}
              width={"13px"}
              style={{ marginLeft: "5px" }}
            />
          </Label>
          <RightContainer>
            <Img src={GetIcon("logout.png")} width={"17px"} onClick={LogOut} />
            <Img
              src={GetIcon("inform-black.png")}
              width={"15px"}
              style={{ marginLeft: "20px" }}
            />
            <Img
              src={GetIcon("dropdown.png")}
              width={"15px"}
              style={{ marginLeft: "20px" }}
            />
          </RightContainer>
        </CenterBox>
        <CenterBox align="center" top="200px">
          <EmptyContainer>
            <Img src={GetIcon("home.png")} width={"134px"} top={"25px"} />
            <br />
            <br />
            <br />
            <Text size="20px" font="SejonghospitalBold">
              등록된 기기가 없으신가요?
            </Text>

            <Button type="button" value={"등록하기"} />
          </EmptyContainer>
        </CenterBox>
        {/* 메뉴바 */}
        <MenuBar/>
      </div>
    </div>
  );
};