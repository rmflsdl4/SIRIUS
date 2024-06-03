// Display : Width = 360, Height = 800

import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"; 
// 페이지 불러오기
import { Intro } from "./Intro";
import { Main } from "./Main";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { AfterMain } from "./AfterMain";
import { MyPage } from "./MyPage";
import { UpdateProfile } from "./UpdateProfile";
import { AI } from "./AI";
import { FindingID } from "./FindingID";
import { FindingPW } from "./FindingPW";
import { AfterDeviceMain } from "./AfterDeviceMain";
import { CommunicationMain } from "./CommunicationMain";
import { ContentsComponent } from "./modules/ContentsComponent";
import { ContentUpload } from "./ContentUpload";
// 스타일 파일 가져오기
import "./style.css";

// 블루투스 콘텍스트 설정
export const BlueToothContext = React.createContext({
  isConnected: false,
  characteristic: null,
  setBluetoothConnection: () => {},
  setCharacteristic: () => {},
});

// Screen 컴포넌트를 렌더링하는 함수
const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [characteristic, setCharacteristic] = useState(null);

  const setBluetoothConnection = (status, characteristicData) => {
    setIsConnected(status);
    setCharacteristic(characteristicData);
  };

  return (
    <BlueToothContext.Provider value={{ isConnected, characteristic, setBluetoothConnection }}>
      <BrowserRouter>
        <Routes>
          <Route path="Intro" element={<Intro />} />
          <Route path="Main" element={<Main />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="Login" element={<Login />} />
          <Route path="AfterMain" element={<AfterMain />} />
          <Route path="MyPage" element={<MyPage />} />
          <Route path="UpdateProfile" element={<UpdateProfile />} />
          <Route path="Culi" element={<AI />} />
          <Route path="FindingID" element={<FindingID/>} />
          <Route path="FindingPW" element={<FindingPW/>} />
          <Route path="AfterDeviceMain" element={<AfterDeviceMain/>} />
          <Route path="CommunicationMain" element={<CommunicationMain/>} />
          <Route path="ContentsComponent" element={<ContentsComponent/>} />
          <Route path="ContentUpload" element={<ContentUpload/>} />
        </Routes>
      </BrowserRouter>
    </BlueToothContext.Provider>
  );
};
export default App;