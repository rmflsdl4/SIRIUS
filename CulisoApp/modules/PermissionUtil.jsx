import { Platform } from "react-native";
import { PERMISSIONS, request, requestMultiple, RESULTS } from "react-native-permissions";

export const PermissionRequest = () => {
    // os 확인
    if(Platform.OS !== "ios" && Platform.OS !== "android") return;

    const permissions = Platform.OS === 'ios' ? 
    [PERMISSIONS.IOS.BLUETOOTH, PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
    :
    [PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.BLUETOOTH_CONNECT, PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
    
    const requestPermission = async () => {
        try{
            const result = await requestMultiple(permissions);
            console.log(result);
        }
        catch(err){
            console.log(err);
        }
    }
    requestPermission();
}