import React, { useEffect, useState, useContext } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { SpeechBubbleMessage } from '../modules/Culi'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../modules/Navigator'
import { getSessionUserData, isSessionValid, logout } from '../modules/auth'; // isSessionValid 함수 가져오기
import UserDataContext from "../contexts/UserDataContext";

const Welcome = ({ navigation }) => {
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const userContext = useContext(UserDataContext); // Context 사용
    const { setUserValues } = userContext;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const validSession = await isSessionValid(); // 세션 유효성 검사
                if (validSession) {
                    const userData = await getSessionUserData(); // 세션에서 사용자 정보 가져오기
                    if (userData) {
                        console.log('자동 로그인 성공:', userData);
                        setUserValues(userData); // 사용자 정보 저장
                        navigation.replace('Main'); // Main 화면으로 이동
                    } else {
                        console.error('세션에 사용자 정보가 없습니다.');
                        setLoading(false); // Welcome 화면 표시
                    }
                } else {
                    console.log('세션이 만료되었습니다.');
                    await logout(); // 만료 시 로그아웃 수행
                    setLoading(false); // Welcome 화면 표시
                }
            } catch (error) {
                console.error('로그인 상태 확인 중 오류 발생:', error);
                Alert.alert('오류', '로그인 상태를 확인하는 중 문제가 발생했습니다.', [
                    { text: '확인', onPress: () => setLoading(false) },
                ]);
            }
        };

        checkLoginStatus();
    }, []);

    if (loading) {
        return (
            <Background center={true}>
                <ActivityIndicator size="large" color="#0000ff" />
            </Background>
        );
    }

    return (
        <Background center={true}>
            <GetImage type={'Logo'} width={170} height={200} />
            <SpeechBubbleMessage text={"큐리소에 오신 것을 환영합니다 !"}/>
            
            <View style={styles.margin}/>
            <Button 
                onPress={()=>navigation.navigate('Login')}
                type={'LoginButton'} 
                text={'CULISO 로그인'} 
                width={22}
                height={22}
                background={'#67ADFF'} 
            />
            <Button 
                onPress={()=>navigation.navigate('SignUp')}
                type={'SignUpButton'} 
                text={'회원가입'} 
                width={26}
                height={26}
                background={'#4B93FF'} 
            />
        </Background>
    );
};

const styles = StyleSheet.create({
    margin: {
        marginTop: 70,
    },
});

export default Welcome;
