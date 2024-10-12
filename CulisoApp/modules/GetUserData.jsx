import axios from 'axios';
import ENDPOINT from "../modules/Endpoint";

const GetUserData = async (user_id) => {
    //http://10.0.2.2:8080/user/login
    //http://192.168.25.4:8080/user/login
    const data = { user_id };
    console.log('요청', data);
    try{
        const response = await axios.post(ENDPOINT + 'user/info', data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if(response.data){
            return response.data;
        }
    }
    catch(err) {
        console.log('에러 발생: ', err);
    }
}

export default GetUserData;