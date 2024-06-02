
import { MenuBar } from "./MenuBar";
import GetIcon from "./modules/GetIcon";
import { Cookies } from "react-cookie";
import styled from "styled-components";
import "./style.css";
import { useState, useEffect } from "react";
import { GetAddress, LogOut } from "./modules/DataRouter";
import { Geolocation } from '@capacitor/geolocation';
import { AfterDeviceMain } from './AfterDeviceMain';

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
const cookies = new Cookies();

let characteristic = null;
export async function BLEController(str){
  if(characteristic){
    const value = new TextEncoder().encode(str); // 쓸 데이터
    await characteristic.writeValue(value);
  }
}

export const AfterMain = () => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  const [address, setAddress] = useState();
  const [flag, setFlag] = useState(true);
  const [bluetoothFlag, setBluetoothFlag] = useState(false);

  useEffect(() => {
    // 주소 얻는 메소드
    const GetAddr = async () => {
      const address = await GetAddress();
      setAddress(address);
      console.log("주소: " + address);
    };

    GetAddr();
  }, []);

  useEffect(() => {
    //requestPermissions();
    if(flag){
      CheckPermissions();
      setFlag(false);
    }
  }, []);

  // 권한 확인 및 요청
  const CheckPermissions = async () => {
    try {
        // 현재 권한 상태 확인
        const microphonePermission = await checkMicrophonePermission();
        const locationPermission = await checkLocationPermission();

        // 권한이 허용되지 않은 경우에만 요청
        if (!microphonePermission) {
        await RequestMicrophonePermission();
        }

        if (!locationPermission) {
        await RequestLocationPermission();
        }
    } catch (error) {
        console.error('권한 확인 및 요청 중 오류가 발생했습니다:', error);
    }
};
// 음성 권한 요청
const RequestMicrophonePermission = async () => {
  try {
      const status = await Permissions.request({ name: 'microphone' });
      if (status.granted) {
        console.log('마이크 권한이 부여되었습니다.');
      } else {
        console.log('마이크 권한이 거부되었습니다.');
      }
  } catch (error) {
      console.error('마이크 권한 요청 중 오류 발생:', error);
  }
};

// 위치 권한 요청
const RequestLocationPermission = async () => {
try {
    const position = await Geolocation.getCurrentPosition();
    console.log('위치 정보:', position);
    return true;
} catch (error) {
    console.error('위치 정보를 가져오는 중 오류 발생:', error);
    return false;
}
};
// 음성 권한 확인
const checkMicrophonePermission = async () => {
try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (stream) {
    console.log('마이크 권한이 이미 부여되었습니다.');
    return true;
    } else {
    console.log('마이크 권한이 부여되지 않았습니다.');
    return false;
    }
} catch (error) {
    console.error('마이크 권한 확인 중 오류 발생:', error);
    return false;
}
};

// 위치 권한 확인
const checkLocationPermission = async () => {
  try {
      const status = await Geolocation.checkPermissions();
      if (status.location === 'granted') {
      console.log('위치 정보 권한이 이미 부여되었습니다.');
      return true;
      } else {
      console.log('위치 정보 권한이 부여되지 않았습니다.');
      return false;
      }
  } catch (error) {
      console.error('위치 정보 권한 확인 중 오류 발생:', error);
      return false;
  }
};
  // 블루투스 요청
  const requestBlueTooth = async () => {
    if (!navigator.bluetooth) {
      alert("브라우저가 Web Bluetooth API를 지원하지 않습니다.");
      return;
    }
    let chosenDevice = null;
     // 데이터를 쓸 특성을 저장할 변수

    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }]
        });
        console.log('Connecting to GATT Server...');
        chosenDevice = device;
        const server = await device.gatt.connect();
        console.log('Getting GATT Service...');
        const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
        console.log('GATT Service received:', service);
        characteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e'); // 데이터를 쓸 특성 UUID
        console.log('Characteristic received:', characteristic);
        setBluetoothFlag(true);
        console.log('Data written successfully');
    } catch (error) {
        console.error('Bluetooth error:', error);
        // 연결이 끊긴 경우 다시 연결 시도
        if (error.message.includes('GATT Server is disconnected') && chosenDevice) {
            console.log('Attempting to reconnect...');
            await chosenDevice.gatt.connect();
        }
    }
  };

  
  
  return (
    <div>
      {bluetoothFlag ? (
        <AfterDeviceMain/>
      ) : (
        <div className="afterMain">
          <div className="afterMainDiv">
            <CenterBox align="space-between" top="15px">
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
            
            <CenterBox align="center" style={{width:"100vw", height:"100vh"}}>
              <EmptyContainer style={{marginBottom:"35.28px"}}>
                <Img src={GetIcon("home.png")} width={"134px"} top={"25px"} />
                <br />
                <br />
                <br />
                <Text size="20px" font="SejonghospitalBold">
                  등록된 기기가 없으신가요?
                </Text>
                <Button type="button" value={"등록하기"} onClick={() => requestBlueTooth()} />
              </EmptyContainer>
            </CenterBox>
            {/* 메뉴바 */}
            <MenuBar/>
          </div>
        </div>
      )}
    </div>
    
  );
};
