import React, { useEffect, useState, useContext } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { SpeechBubbleMessage } from '../modules/Culi'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../modules/Navigator'
import { getBluetoothSession, getSessionUserData, getVoiceAutoMode, isSessionValid, logout, storeBluetoothSession } from '../modules/auth'; // isSessionValid 함수 가져오기
import UserDataContext from "../contexts/UserDataContext";
import { BleManager } from 'react-native-ble-plx';
import BluetoothContext from "../contexts/BluetoothContext";

const bleManager = new BleManager();
const CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Bluetooth 특성 UUID

const Welcome = ({ navigation }) => {
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const userContext = useContext(UserDataContext); // Context 사용
    const { setUserValues } = userContext;
    const { characteristic, setCharacteristic, isBluetoothConnected, setIsBluetoothConnected, device, setDevice } = useContext(BluetoothContext);
    const [hasBluetoothInfo, setHasBluetoothInfo] = useState(false); // 블루투스 정보 존재 여부 확인

    // Bluetooth 초기화
    const initializeBluetooth = async () => {
        try {
            const bluetoothInfo = await getBluetoothSession();
            if (bluetoothInfo) {
                console.log(`Bluetooth 복원: ${bluetoothInfo.deviceName} (${bluetoothInfo.deviceId})`);
                setHasBluetoothInfo(true); // 블루투스 정보가 있을 때만 로딩 활성화
                const restoredDevice = await bleManager.connectToDevice(bluetoothInfo.deviceId);
                await connectToDevice(restoredDevice);
            } else {
                setLoading(false); // 블루투스 정보가 없으면 바로 로딩 종료
            }
        } catch (error) {
            console.error('Bluetooth 초기화 오류:', error.message);
            setLoading(false); // 오류가 발생해도 로딩 종료
        }
    };

    // Bluetooth 기기 연결
    const connectToDevice = async (device) => {
        try {
            console.log(`${device.name} 연결 시도 중...`);
            setDevice(device);
            await device.connect({ autoConnect: true });

            console.log('장치에 연결되었습니다:', device.id);
            await device.discoverAllServicesAndCharacteristics();

            const services = await device.services();
            let foundCharacteristic = null;

            for (const service of services) {
                const characteristics = await device.characteristicsForService(service.uuid);
                const targetCharacteristic = characteristics.find(c => c.uuid === CHARACTERISTIC_UUID);

                if (targetCharacteristic) {
                    foundCharacteristic = targetCharacteristic;
                    break;
                }
            }

            if (foundCharacteristic) {
                setCharacteristic(foundCharacteristic);
                await storeBluetoothSession(device, foundCharacteristic);
                setIsBluetoothConnected(true);
                console.log('Bluetooth 특성 설정 완료:', foundCharacteristic.uuid);
            } else {
                console.error('특성을 찾을 수 없습니다.');
            }

            setLoading(false); // 연결 완료 후 로딩 종료
        } catch (error) {
            console.error('Bluetooth 연결 오류:', error.message);
            setLoading(false); // 오류 발생 시 로딩 종료
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            try {
                // 1. 먼저 세션 유효성 검사
                const validSession = await isSessionValid();
                if (!validSession) {
                    console.log('세션이 만료되었습니다.');
                    await logout(device, setDevice, setIsBluetoothConnected);
                    return setLoading(false);
                }

                // 2. 유효한 세션일 경우 나머지 초기화 수행
                const [userData, voiceMode] = await Promise.all([
                    getSessionUserData(),
                    getVoiceAutoMode(),
                    initializeBluetooth(),
                ]);

                if (!userData) {
                    console.error('세션에 사용자 정보가 없습니다.');
                    return setLoading(false);
                }

                console.log('자동 로그인 성공:', userData);
                setUserValues(userData);

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

    if (loading && hasBluetoothInfo) {
        // 블루투스 정보가 있을 때만 로딩 표시
        return (
            <Background center={true}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Bluetooth 연결 중...</Text>
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
