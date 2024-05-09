import React from "react";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";

// import { AdminLogin } from "./web/AdminLogin";
import { AdminMain } from "./AdminMain";
import { BoardMgr } from "./BoardMgr";
import "./style.css"; // 스타일 파일 가져오기

// Screen 컴포넌트를 렌더링하는 함수
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<AdminMain />} />
          <Route path="/boardMgr" element={<BoardMgr />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
