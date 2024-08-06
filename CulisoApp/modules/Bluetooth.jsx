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
            const targetDeviceId = 'DC:CD:3A:5F:F4:91';

            manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log("스캔 에러: ", error);
                    reject(error);
                    return;
                }

                if (device && device.id === targetDeviceId) {
                    manager.stopDeviceScan();
                    resolve(device);
                }
            });

            // 10초 동안 못 찾으면 중지하고 널값 반환
            setTimeout(() => {
                manager.stopDeviceScan();
                resolve(null);
            }, 10000);
        });
    } else {
        return null;
    }
}