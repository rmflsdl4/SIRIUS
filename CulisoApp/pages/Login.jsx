import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import axios from 'axios';
import GetUserData from "../modules/GetUserData";
import UserDataContext from "../contexts/UserDataContext";
import ENDPOINT from "../modules/Endpoint";
import { getVoiceAutoMode, storeSession } from '../modules/auth'; // storeSession 함수 가져오기

const Header = () => {
    return (
        <View style={styles.loginTitleContiner}>
            <Text style={styles.loginTitle}>집 안의 모든 기기를 보다 쉽고,</Text>
            <Text style={styles.loginTitle}>간편하게 관리하기 !</Text>
            <Text style={styles.loginTitle}>지금 큐리소 계정으로 로그인하세요.</Text>
        </View>
    );
}

const Input = ({ iconType, secureText, placeholder, setFunc }) => {
  return (
    <View style={styles.inputContainer}>
      <GetImage type={iconType} width={22} height={22} marginLeft={20} marginRight={15} />
      <TextInput style={styles.inputText} secureTextEntry={secureText} placeholder={placeholder} onChangeText={text=>setFunc(text)}/>
    </View>
  );
};

const Login = ({ navigation }) => {
    const [user_id, setUserID] = useState();
    const [user_pw, setUserPW] = useState();
    const userContext = useContext(UserDataContext);
    const { setUserValues } = userContext;
    
    const LoginHandler = () => {
        console.log(`아이디: ${user_id}`);
        console.log(`비번: ${user_pw}`);

        const data = { user_id, user_pw };
        //http://10.0.2.2:8080/user/login
        axios.post(ENDPOINT + 'user/login', data, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then(async (response) => {
            console.log(response.data);
            if(response.data){
                const data = await GetUserData(user_id);
                console.log('로그인 성공');
                setUserValues(data);
                await storeSession(data); // 사용자 정보 세션에 저장

                // 음성 자동 모드에 따라 화면 이동 결정
                const voiceMode = await getVoiceAutoMode();
                const targetScreen = voiceMode ? 'VoiceController' : 'Main';
                console.log(`${targetScreen} 화면으로 이동`);
                navigation.replace(targetScreen);
            }
            else{
                Alert.alert('로그인 실패', '아이디/비밀번호를 확인해 주세요.', [
                      {text: '확인', onPress: () => console.log('alert closed')},
                ]);
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <Background center={true}>
            <View style={styles.loginContainer}>
                <Text style={styles.header}>CULISO<Text style={styles.subHeader}> Account</Text></Text>
                <View style={styles.login}>
                    <Header/>
                    <Input iconType={'LoginID'} secureText={false} placeholder="아이디" setFunc={setUserID}/>
                    <Input iconType={'LoginPW'} secureText={true} placeholder="비밀번호" setFunc={setUserPW}/>
                    <TouchableOpacity style={styles.button} onPress={LoginHandler}><Text style={styles.buttonText}>로그인</Text></TouchableOpacity>
                </View>
            </View>
        </Background>
    );
};


const styles = StyleSheet.create({
    loginContainer: {
        width: 331,
    },
    header: {
        fontFamily: 'KCC-Hanbit',
        color: '#605FC2',
        fontSize: 20,
    },
    subHeader: {
        fontFamily: 'KCC-Hanbit',
        color: '#6982C8',
        fontSize: 15,
    },
    login: {
        width: "100%",
        backgroundColor: '#FFFFFF',
        height: 427,
        marginTop: 12,
        borderRadius: 15,
        alignItems: 'center',
    },
    loginTitleContiner: {
        width: "100%",
        marginTop: 25,
    },
    loginTitle: {
        width: "100%",
        textAlign: 'center',
        fontFamily: 'LINESeedKR-Bd',
        letterSpacing: 1.5
    },
    inputContainer: {
        width: 285,
        height: 47,
        borderRadius: 6,
        backgroundColor: '#EAE8E8',
        marginTop: 25,
        alignItems: 'center',
        flexDirection: 'row',
    },
    inputText: {
        flex: 1, // 남은 공간을 모두 차지하도록 설정
        color: '#939393',
        fontFamily: 'KCC-Hanbit',
        textAlign: 'left',
        fontSize: 16, // 텍스트 크기 조정
    },
    button: {
        backgroundColor: '#b1dbfa',
        width: 285,
        height: 44,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#474747',
        fontSize: 16,
        fontFamily: 'Sejong hospital Bold',
    },
});

export default Login;
