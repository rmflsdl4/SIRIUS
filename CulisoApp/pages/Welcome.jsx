import React, { useEffect, useState, useContext } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { SpeechBubbleMessage } from '../modules/Culi'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../modules/Navigator'
import { getSessionUserData, getVoiceAutoMode, isSessionValid, logout } from '../modules/auth'; // isSessionValid 함수 가져오기
import UserDataContext from "../contexts/UserDataContext";

const Welcome = ({ navigation }) => {
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const userContext = useContext(UserDataContext); // Context 사용
    const { setUserValues } = userContext;

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const [voiceMode, validSession] = await Promise.all([
                    getVoiceAutoMode(),
                    isSessionValid()
                ]);

                if (!validSession) {
                    console.log('세션이 만료되었습니다.');
                    await logout();
                    return setLoading(false); // Welcome 화면 표시
                }

                const userData = await getSessionUserData();
                if (!userData) {
                    console.error('세션에 사용자 정보가 없습니다.');
                    return setLoading(false); // Welcome 화면 표시
                }

                console.log('자동 로그인 성공:', userData);
                setUserValues(userData);

                // 음성 자동 모드에 따라 화면 이동
                const targetScreen = voiceMode ? 'VoiceController' : 'Main';
                console.log(`${targetScreen} 화면으로 이동`);
                navigation.replace(targetScreen);
            } catch (error) {
                console.error('초기화 중 오류 발생:', error);
                Alert.alert('오류', '앱 초기화 중 문제가 발생했습니다.', [
                    { text: '확인', onPress: () => setLoading(false) },
                ]);
            }
        };

        initializeApp();
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
