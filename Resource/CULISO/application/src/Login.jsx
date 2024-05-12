import GetIcon from "./modules/GetIcon";
import { Navigate } from "./modules/Navigate";
import styled from 'styled-components';
import "./style.css";

// css
const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
`;
const Text = styled.p`
  text-align: ${(props) => props.align};
  width:331px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
`;
const InputBox = styled.div`
  width: 285px;
  height: 47px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #EAE8E8;
`;

//컴포넌트
const Input = () => {
  return (
    <InputBox>
      <img width={'22px'} src={GetIcon("white-padlock.png")}/>
      <input type="text" placeholder="테스트"/>
    </InputBox>
  );
};


export const Login = () => {
  return (
    <div className="login">
      <div className="div">
        <CenterBox>
          <Text color={"#3252C2"} size={"15px"}><span style={{fontWeight:"bold"}}>CULISO</span> <span style={{color:"#4B66C8"}}>Account</span></Text>
          <div className="loginBG">
            <Text align={'center'} color={"black"} size={"15px"} style={{marginTop: '40px', fontFamily: 'S-CoreDream-3Light'}}>
              집 안의 모든 기기를 보다 쉽고,<br/>
              간편하게 관리하기 !<br/>
              지금 큐리소 계정으로 로그인하세요.
            </Text>
            <Input/>
            <Input/>
          </div>
        </CenterBox>
      </div>
    </div>
  );
};
