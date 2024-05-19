// Display : Width = 360, Height = 800

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 페이지 불러오기
import { Intro } from "./Intro";
import { Main } from "./Main";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { AfterMain } from "./AfterMain";
import { MyPage } from "./MyPage";

// 스타일 파일 가져오기
import "./style.css";
// Screen 컴포넌트를 렌더링하는 함수
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/main" element={<Main />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/afterMain" element={<AfterMain />} />
        <Route path="/myPage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
