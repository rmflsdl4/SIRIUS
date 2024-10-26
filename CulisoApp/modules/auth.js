import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_TIMEOUT = 60 * 1000; // 50초

// 세션에 사용자 정보 저장
export const storeSession = async (userData) => {
    if (!userData) {
        console.error('storeSession 오류: 유효하지 않은 사용자 정보입니다.');
        return;
    }

    const expiryTime = Date.now() + LOGIN_TIMEOUT;

    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData)); // 사용자 정보 저장
        await AsyncStorage.setItem('expiryTime', expiryTime.toString()); // 만료 시간 저장
    } catch (err) {
        console.error('AsyncStorage 저장 오류:', err);
    }
};

// 세션에서 사용자 정보 가져오기
export const getSessionUserData = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (err) {
        console.error('사용자 정보 불러오기 오류:', err);
        return null;
    }
};

// 세션 유효성 검사
export const isSessionValid = async () => {
    try {
        const expiryTime = await AsyncStorage.getItem('expiryTime');
        if (!expiryTime) return false;
        return Date.now() < parseInt(expiryTime, 10);
    } catch (err) {
        console.error('세션 유효성 검사 오류:', err);
        return false;
    }
};

// 로그아웃: 모든 세션 정보 삭제
export const logout = async () => {
    try {
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('expiryTime');
    } catch (err) {
        console.error('로그아웃 중 오류 발생:', err);
    }
};


// Bluetooth 기기 정보 저장
export const storeBluetoothSession = async (device, characteristic) => {
    if (!device || !characteristic) {
        console.error('storeBluetoothSession 오류: 유효하지 않은 Bluetooth 정보입니다.');
        return;
    }

    try {
        const bluetoothInfo = {
            device: device,
            deviceId: device.id,
            deviceName: device.name,
            characteristic: characteristic,
        };
        await AsyncStorage.setItem('bluetoothInfo', JSON.stringify(bluetoothInfo));
        console.log('Bluetooth 세션 저장 완료:', bluetoothInfo);
    } catch (err) {
        console.error('Bluetooth 세션 저장 오류:', err);
    }
};

// Bluetooth 기기 정보 불러오기
export const getBluetoothSession = async () => {
    try {
        const bluetoothInfo = await AsyncStorage.getItem('bluetoothInfo');
        return bluetoothInfo ? JSON.parse(bluetoothInfo) : null;
    } catch (err) {
        console.error('Bluetooth 정보 불러오기 오류:', err);
        return null;
    }
};

// 불루투스 세션 정보 삭제
export const bluetoothUnconnection = async () => {
    try {
        await AsyncStorage.removeItem('bluetoothInfo');
    } catch (err) {
        console.error('로그아웃 중 오류 발생:', err);
    }
};