import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GetImage } from './ImageManager';
import { getVoiceAutoMode } from "./auth";
import { useFocusEffect } from "@react-navigation/native";
import VoiceAutoModeContext from "../contexts/VoiceAutoModeContext";
// Welcome에서 사용하는 버튼 형식
export const Button = ({ type, text, width, height, background, onPress }) => {
    return (
        <TouchableOpacity style={[styles.Button, {backgroundColor: background}]} onPress={onPress}>
            <GetImage type={type} width={width} height={height} marginRight={10}/>
            <Text style={styles.Text}>{text}</Text>
        </TouchableOpacity>
    )
}



// Main에서 사용하는 하단 버튼 형식
export const BottomButton = ({navigation}) => {
    const { isVoiceAutoModeEnabled, setIsVoiceAutoModeEnabled } = useContext(VoiceAutoModeContext);

    const Button = ({ route, type, text, isLarge }) => {
        return (
            <TouchableOpacity 
                style={[styles.BottomButton, isLarge && styles.LargeButton]} 
                onPress={() => navigation.navigate(route)}
            >
                <GetImage 
                    type={type} 
                    width={isLarge ? 75 : 50} // 크기 조정
                    height={isLarge ? 75 : 50} // 크기 조정
                    marginBottom={isLarge ? 0 : 5} 
                />
                {!isLarge && (
                    <Text style={styles.Text}>{text}</Text> // 텍스트는 반드시 Text 컴포넌트 안에
                )}
            </TouchableOpacity>
        );
    };

    // 화면이 포커스될 때마다 음성 자동 모드 상태를 가져옴
    useFocusEffect(
        useCallback(() => {
            const fetchVoiceAutoMode = async () => {
                try {
                    const voiceMode = await getVoiceAutoMode();
                    setIsVoiceAutoModeEnabled(voiceMode);
                } catch (error) {
                    console.error('음성 자동 모드 불러오기 오류:', error);
                }
            };
            fetchVoiceAutoMode();
        }, []) // useCallback으로 의존성 제어
    );
    

    return (
       <View style={styles.BottomButtonContainer}>
            <Button route={'Main'} type={'NavHome'} text={'우리 집'}/>
            <Button route={'CommunicationMain'} type={'NavBoard'} text={'커뮤니티'}/>
            {isVoiceAutoModeEnabled && (
                <Button route={'VoiceController'} type={'VoiceController'} isLarge={true} />
            )}
            <Button route={'CuliTalk'} type={'Culi'} text={'큐리'}/>
            <Button route={'Mypage'} type={'NavMypage'} text={'내 정보'}/>
       </View>
    )
}

// 작은 회색 글씨 이동 메뉴
//export const BottomMenubar({navigation})


// 스타일
const styles = StyleSheet.create({
    Button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 245,
        height: 50,
        borderRadius: 10,
        margin: 10,
        flexDirection: 'row',
    },
    Text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Sejong hospital Bold',
    },
    BottomButtonContainer: {
        width: '100%',
        justifyContent: 'space-around',
        flexDirection: 'row',
        bottom: 0,
        position: 'absolute',
        marginBottom: 20
    },
    BottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});