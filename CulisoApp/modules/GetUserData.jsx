import axios from 'axios';

const GetUserData = async (user_id) => {
    //http://10.0.2.2:8080/user/login
    //http://192.168.25.4:8080/user/login
    const data = { user_id };
    console.log('요청', data);
    axios.post('http://10.0.2.2:8080/user/info', data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    .then((response) => {
        console.log(response.data);
        if(response.data){
            return response.data;
        }
        else{
            Alert.alert('로그인 실패', '아이디/비밀번호를 확인해 주세요.', [
                  {text: '확인', onPress: () => console.log('alert closed')},
            ]);
        }
    })
    .catch(err => console.log(err));
}

export default GetUserData;