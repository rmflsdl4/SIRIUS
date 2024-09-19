import { BleManager } from 'react-native-ble-plx';
import { BluetoothCheck } from "../modules/PermissionUtil";
import { useState } from 'react';

const manager = new BleManager();

export const BluetoothConnect = async () => {
    const result = await BluetoothCheck();
    const state = await manager.state();
    console.log("권한상태: ", result);
    console.log("블루: ", state);
    if (result === 'granted') {
        return new Promise((resolve, reject) => {
            const targetDeviceId = 'C6:23:48:AD:7F:C7';

            manager.startDeviceScan(null, null, (error, device) => {
                console.log("발견된 기기: ", device.id);

                if (error) {
                    console.log("스캔 에러: ", error);
                    reject(error);
                    return;
                }

                if (device && device.id === targetDeviceId) {
                    console.log("찾은 기기: ", device.id);
                    manager.stopDeviceScan();
                    resolve(device);
                }
            });

            // 10초 동안 못 찾으면 중지하고 널값 반환
            setTimeout(() => {
                manager.stopDeviceScan();
                console.log("타임 아웃");
                resolve(null);
            }, 10000);
        });
    } else {
        return null;
    }
}
