import { BleManager } from 'react-native-ble-plx';
import { BluetoothCheck } from "../modules/PermissionUtil";

const manager = new BleManager();

export const BluetoothConnect = async (onDeviceDiscovered) => {
    const result = await BluetoothCheck(); // 블루투스 권한 체크
    const state = await manager.state(); // 블루투스 상태 확인
    console.log("권한상태: ", result);
    console.log("블루: ", state);

    if (result === 'granted') {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log("스캔 에러: ", error);
                return;
            }

            if (device && onDeviceDiscovered) {
                console.log("발견된 기기: ", device.id, device.name);
                onDeviceDiscovered(device);  // 기기를 발견하면 콜백 함수 호출
            }
        });

        // 10초 뒤에 탐색 종료
        setTimeout(() => {
            manager.stopDeviceScan();
            console.log("타임 아웃, 스캔 종료");
        }, 10000);
    }
};
