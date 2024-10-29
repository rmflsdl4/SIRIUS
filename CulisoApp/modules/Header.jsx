import { View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import { GetImage } from '../modules/ImageManager';
import { bluetoothUnconnection, getBluetoothSession, logout } from './auth';
import { useEffect, useState } from 'react';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

const Header = ({ navigation, address, device, setDevice, isBluetoothConnected, setIsBluetoothConnected }) => {
    const maxLength = 10;
    const truncatedAddress = address.length > maxLength
        ? `${address.substring(0, maxLength)}...`
        : address;

    const [modalVisible, setModalVisible] = useState(false);

    const handleBluetoothUnconnection = async () => {
        try {
            setModalVisible(false); // 모달 닫기
            await bluetoothUnconnection(); // 세션에서 Bluetooth 정보 삭제
    
            if (device && device.id) {
                console.log(`장치 해제 시도: ${device.name} (${device.id})`);
    
                // BleManager를 통해 다시 장치 인스턴스 가져오기
                const connectedDevice = await bleManager.connectToDevice(device.id);
                await connectedDevice.cancelConnection(); // 안전하게 연결 해제
                console.log('Bluetooth 연결 해제 성공');
            } else {
                console.warn('해제할 Bluetooth 장치가 없습니다.');
            }
    
            setDevice(null);
            setIsBluetoothConnected(false); // 블루투스 아이콘 숨기기
        } catch (error) {
            console.error('Bluetooth 연결 해제 중 오류:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.addrContainer}>
                <Text style={styles.addrText}>{truncatedAddress}</Text>
                <TouchableOpacity>
                    <GetImage type={'ProfileUpdate'} width={21} height={21}/>
                </TouchableOpacity>
            </View>
            <View style={styles.addrContainer}>
                {isBluetoothConnected && ( // 블루투스 연결 시만 이미지 표시
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <GetImage type={'BluetoothUnconnection'} width={21} height={21} marginRight={15} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() =>  {logout(device, setDevice, setIsBluetoothConnected), navigation.navigate('Login')}}>
                    <GetImage type={'Logout'} width={21} height={21}/>
                </TouchableOpacity>
            </View>

            {/* 모달 구현 */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>블루투스 연결 해제</Text>
                        <Text style={styles.modalText}>정말 연결을 해제하시겠습니까?</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleBluetoothUnconnection}
                            >
                                <Text style={styles.buttonText}>네</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>아니오</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '95%',
        flexDirection: 'row',
        position: 'absolute',
        top: 15,
        justifyContent: 'space-between'
    },
    addrContainer: {
        flexDirection: 'row'
    },
    addrText: {
        fontSize: 17,
        fontFamily: 'KCC-Hanbit',
        marginRight: 15,
        color: 'black'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명한 배경
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    confirmButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 10,
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default Header;