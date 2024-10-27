import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // 그라디언트 추가
import Voice from '@react-native-voice/voice';
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { BottomButton } from '../modules/Navigator';
import SpeechAction from '../modules/SpeechActionRouter';
import BluetoothContext from '../contexts/BluetoothContext';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // 화면 너비 가져오기

const TopBar = ({ navigation }) => (
    <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <GetImage type={'BackArrow'} width={22} height={22} />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>CULISO</Text>
        <View style={styles.placeholder} />
    </View>
);

const VoiceController = ({ navigation }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [message, setMessage] = useState('');
    const animation = useRef(new Animated.Value(1)).current; // 애니메이션 초기 값 (크기 1)
    const { characteristic } = useContext(BluetoothContext); // characteristic 가져오기

    useFocusEffect(
        useCallback(() => {
            console.log('VoiceController 화면 활성화됨');
            Voice.onSpeechStart = onSpeechStart;
            Voice.onSpeechEnd = onSpeechEnd;
            Voice.onSpeechResults = onSpeechResults;
            Voice.onSpeechError = onSpeechError;

            return () => {
                console.log('VoiceController 화면 비활성화됨, 음성 인식 정리');
                Voice.stop();
                Voice.destroy().then(Voice.removeAllListeners);
            };
        }, [])
    );

    useEffect(() => {
        if (message) {
            SpeechAction({ voiceMessage: message, characteristic, navigation, Voice });
        }
    }, [message]);

    useEffect(() => {
        if (isRecording) {
            startAnimation();
        } else {
            animation.setValue(1);
        }
    }, [isRecording]);

    const startAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1.3, // 더 큰 확장
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 1, // 축소
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const toggleVoiceRecognition = async () => {
        if (isRecording) {
            await stopVoiceRecognition();
        } else {
            await startVoiceRecognition();
        }
    };

    const startVoiceRecognition = async () => {
        try {
            await Voice.start('ko-KR');
            setIsRecording(true);
        } catch (error) {
            console.error('음성 인식 시작 오류:', error);
        }
    };

    const stopVoiceRecognition = async () => {
        try {
            await Voice.stop();
            setIsRecording(false);
        } catch (error) {
            console.error('음성 인식 중지 오류:', error);
        }
    };

    const onSpeechStart = () => {
        console.log('음성 인식 시작');
    };

    const onSpeechEnd = () => {
        console.log('음성 인식 종료');
        setIsRecording(false);
    };

    const onSpeechResults = (event) => {
        const recognizedText = event.value[0];
        setMessage(recognizedText);
        console.log('인식된 텍스트:', recognizedText);
    };

    const onSpeechError = (event) => {
        console.log('음성 인식 오류:', event.error);
    };

    return (
        <Background>
            <TopBar navigation={navigation} />

            <Animated.View style={{ transform: [{ scale: animation }] }}>
                <TouchableOpacity
                    style={[styles.gradientWrapper, isRecording ? styles.recordingShadow : {}]}
                    onPress={toggleVoiceRecognition}
                >
                    <LinearGradient
                        colors={['#6DD5FA', '#2980B9']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.recordButton}
                    >
                        <GetImage type={'VoiceController2'} width={130} height={130} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.voiceControlButton} onPress={toggleVoiceRecognition}>
                <Text style={styles.buttonText}>
                    {isRecording ? '음성 인식 중지' : '음성 인식 시작'}
                </Text>
            </TouchableOpacity>


            <BottomButton navigation={navigation} />
        </Background>
    );
};

const styles = StyleSheet.create({
    topBar: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    mainTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: 22,
    },
    gradientWrapper: {
        marginTop: 50,
        borderRadius: 150,
        overflow: 'hidden',
        shadowColor: '#2980B9',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    recordButton: {
        width: 250,
        height: 250,
        borderRadius: 125,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingShadow: {
        shadowColor: '#FF5733',
    },
    voiceControlButton: {
        marginTop: 80,
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        borderWidth: 2,  // 테두리 두께 설정
        borderColor: '#3498DB',  // 테두리 색상 설정
    },
    buttonText: {
        color: '#3498DB',  // 텍스트 색상도 테두리와 동일하게 설정
        fontSize: 20,
        fontWeight: '700',
    },
});

export default VoiceController;
