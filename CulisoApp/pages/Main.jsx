import React, { useCallback, useContext, useEffect, useState } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { BottomButton } from "../modules/Navigator";
import { PermissionRequest } from "../modules/PermissionUtil";
import { BluetoothConnect } from "../modules/Bluetooth";
import Header from "../modules/Header";
import UserDataContext from "../contexts/UserDataContext";
import BluetoothContext from "../contexts/BluetoothContext";
import BLEController from "../modules/BLEController";
import DevicesData from "../modules/DevicesData";
import { getBluetoothSession, getVoiceAutoMode, storeBluetoothSession, storeVoiceAutoMode } from "../modules/auth";
import { BleManager } from 'react-native-ble-plx';
import VoiceAutoModeContext from "../contexts/VoiceAutoModeContext";
import { useFocusEffect } from "@react-navigation/native";

const bleManager = new BleManager();
// 공통 서비스 및 특성 UUID
const CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const SearchDevice = ({ onPress }) => {
    return (
        <View style={styles.searchContainer}>
            <GetImage type={'SearchDevice'} width={192} height={192} />
            <Text style={styles.text}>등록된 기기가 없으신가요?</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>등록하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const DeviceManage = ({ characteristic }) => {
    const [devices, setDevices] = useState(DevicesData.map(device => ({ ...device, status: '꺼짐', icon: device.iconOff, powerIcon: device.powerOffIcon })));

    const toggleDeviceStatus = async (index) => {
        const newDevices = [...devices];
        const device = newDevices[index];

        device.status = device.status === '켜짐' ? '꺼짐' : '켜짐';
        device.icon = device.status === '켜짐' ? device.iconOn : device.iconOff;
        device.powerIcon = device.status === '켜짐' ? device.powerOnIcon : device.powerOffIcon;
        device.flag = device.status === '켜짐' ? true : false;
        setDevices(newDevices);

        try {
            await BLEController(device.bleCMD, characteristic);
            console.log(`Command '${device.bleCMD}' sent successfully to ${device.name}`);
        } catch (error) {
            console.error(`Failed to send command '${device.bleCMD}' to ${device.name}:`, error);
        }
    };

    return (
        <View style={styles.GridWrapper}>
            <View style={styles.Grid}>
                {devices.map((device, index) => (
                    <View style={styles.DeviceCard} key={device.name}>
                        <View style={styles.DeviceHeader}>
                            <GetImage type={device.icon} width={50} height={50} />
                            <TouchableOpacity style={styles.PowerButton} onPress={() => toggleDeviceStatus(index)}>
                                <GetImage type={device.powerIcon} width={40} height={40} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.DeviceName}>{device.name}</Text>
                        <Text style={styles.DeviceStatus}>{device.status}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const BluetoothDeviceModal = ({ visible, scannedDevices, BluetoothHandler, connectToDevice, setIsBluetoothConnected, onClose, setVoiceModalVisible, setIsVoiceAutoModeEnabled}) => {
    // Bluetooth 기기를 선택할 때 음성 자동 모드 확인
    const handleDeviceSelect = async (device) => {
        try {
            const voiceMode = await getVoiceAutoMode(); // 음성 자동 모드 확인
            console.log("음성 자동 모드 상태:", voiceMode);

            // 음성 모드가 꺼져 있을 때만 팝업 표시
            if (!voiceMode) {
                setVoiceModalVisible(true); // 음성 자동 모드 팝업 표시
            }

            // Bluetooth 기기 연결
            connectToDevice(device);
            setIsBluetoothConnected(true);
        } catch (error) {
            console.error("음성 자동 모드 확인 오류:", error.message);
        }
    };
    
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Bluetooth 기기 선택</Text>

                    {/* 재탐색 버튼 */}
                    <TouchableOpacity onPress={BluetoothHandler} style={styles.rescanButton}>
                        <Text style={styles.rescanButtonText}>재탐색</Text>
                    </TouchableOpacity>

                    <ScrollView style={styles.scrollView}>
                        {scannedDevices.filter(device => device.name).length > 0 ? (
                            scannedDevices.map(device => (
                                <TouchableOpacity
                                    key={device.id}
                                    onPress={() => handleDeviceSelect(device)}
                                    style={styles.deviceItem}
                                >
                                    <Text style={styles.deviceText}>{device.name} ({device.id})</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.deviceText}>기기를 찾을 수 없습니다.</Text>
                        )}
                    </ScrollView>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const VoiceAutoModeModal = ({ visible, handleVoiceAutoMode, onClose }) => {
    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.voiceModalOverlay}>
                <View style={styles.voiceModalContainer}>
                    <Text style={styles.voiceModalTitle}>음성 모드</Text>
                    <Text style={styles.voiceModalText}>음성 자동 모드를 활성화하시겠습니까?</Text>
                    <View style={styles.voiceButtonGroup}>
                        <TouchableOpacity
                            style={styles.voiceConfirmButton}
                            onPress={() => handleVoiceAutoMode(true)}
                        >
                            <Text style={styles.voiceButtonText}>네</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.voiceCancelButton}
                            onPress={() => handleVoiceAutoMode(false)}
                        >
                            <Text style={styles.voiceButtonText}>아니오</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const Main = ({ navigation }) => {
    const [scannedDevices, setScannedDevices] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const userContext = useContext(UserDataContext);
    const { address } = userContext;
    const { characteristic, setCharacteristic, isBluetoothConnected, setIsBluetoothConnected, device, setDevice } = useContext(BluetoothContext);
    const [voiceModalVisible, setVoiceModalVisible] = useState(false); // 음성 자동 모드 모달
    const { isVoiceAutoModeEnabled, setIsVoiceAutoModeEnabled } = useContext(VoiceAutoModeContext);

    useEffect(() => {
        PermissionRequest();
    }, []);

    const BluetoothHandler = async () => {
        try {
            setScannedDevices([]); // 이전에 탐색된 기기를 초기화
            await BluetoothConnect((device) => {
                setScannedDevices(prevDevices => {
                    if (!prevDevices.some(d => d.id === device.id)) {
                        return [...prevDevices, device];
                    }
                    return prevDevices;
                });
            });
            setModalVisible(true);
        } catch (error) {
            console.error('Bluetooth 스캔 실패:', error.message);
        }
    };

    const connectToDevice = async (device) => {
        try {
            setModalVisible(false);
            setDevice(device);
            console.log(`${device.name} 연결 시도 중...`);

            await device.connect({ autoConnect: true }); // 자동 재연결 설정
            console.log('장치에 연결되었습니다:', device.id);

            await device.discoverAllServicesAndCharacteristics();
            console.log('서비스 및 특성 탐색 완료');

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
                // Bluetooth 정보 세션에 저장
                await storeBluetoothSession(device, foundCharacteristic);
                setIsBluetoothConnected(true); // 연결 상태 업데이트
                console.log("특성 설정 완료:", foundCharacteristic.uuid);

                
            } else {
                console.log("특성을 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error('Bluetooth 연결 실패:', error.message);
        }
    };

    // 음성 자동 모드 핸들러
    const handleVoiceAutoMode = async (isEnabled) => {
        await storeVoiceAutoMode(isEnabled); // 선택한 모드 저장
        setIsVoiceAutoModeEnabled(isEnabled) // 음성 버튼 활성화
        setVoiceModalVisible(false); // 모달 닫기
    };

    return (
        <Background center={true}>
            <Header navigation={navigation} address={address} device={device} setDevice={setDevice} isBluetoothConnected={isBluetoothConnected} setIsBluetoothConnected={setIsBluetoothConnected} />
            {device == null ?
                <SearchDevice onPress={() => BluetoothHandler()} />
                :
                <DeviceManage characteristic={characteristic} />
            }

            {/* 블루투스 기기 선택 모달 */}
            <BluetoothDeviceModal
                visible={modalVisible}
                scannedDevices={scannedDevices}
                BluetoothHandler={BluetoothHandler}
                connectToDevice={connectToDevice}
                setIsBluetoothConnected={setIsBluetoothConnected}
                onClose={() => setModalVisible(false)}
                setVoiceModalVisible={setVoiceModalVisible}
            />

            {/* 음성 자동 모드 선택 모달 */}
            {!isVoiceAutoModeEnabled && (
                <VoiceAutoModeModal
                    visible={voiceModalVisible}
                    handleVoiceAutoMode={handleVoiceAutoMode}
                    onClose={() => setVoiceModalVisible(false)}
                />
            )}
            <BottomButton navigation={navigation} />
        </Background>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#ffffff',
        paddingLeft: 60,
        paddingRight: 60,
        paddingBottom: 30,
        paddingTop: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,
        fontFamily: 'KCC-Hanbit',
        textAlign: 'center',
    },
    button: {
        width: 150,
        height: 35,
        backgroundColor: '#B1DBFA',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Sejong hospital Bold',
        color: '#ffffff',
    },
    PowerButton: {
        background: 'none',
        cursor: 'pointer',
    },
    DeviceCard: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 15,
        marginTop: 15,
        width: 150,
        // iOS 쉐도우
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        // Android 쉐도우
        elevation: 3,
    },
    DeviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    DeviceName: {
        fontSize: 18,
        marginTop: 10,
        color: '#333'
    },
    DeviceStatus: {
        fontSize: 16,
        color: 'gray'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 모달 배경을 어둡게
    },
    modalContent: {
        width: '85%',
        height: 600,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    rescanButton: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#2196F3', // 푸른색 배경
        borderRadius: 5,
        alignItems: 'center',
    },
    rescanButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    deviceItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0', // 아이템 구분선
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginVertical: 5,
    },
    deviceText: {
        fontSize: 16,
        color: '#333',
    },
    closeButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F44336', // 빨간색 배경
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    scrollView: {
        flexGrow: 1, // ScrollView가 충분한 공간을 차지하도록
    },
    GridWrapper: {
        justifyContent: 'center',
    },
    Grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 350,
        margin: 'auto',
    },
    // 음성 자동 모드 모달 스타일
    voiceModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // 부드러운 반투명 배경
        justifyContent: 'center',
        alignItems: 'center',
    },
    voiceModalContainer: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8, // Android 그림자
    },
    voiceModalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
    },
    voiceModalText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    voiceButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    voiceConfirmButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    voiceCancelButton: {
        backgroundColor: '#f44336', // 빨간색 버튼
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
    },
    voiceButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Main;
