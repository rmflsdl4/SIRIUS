import BLEController from "../modules/BLEController";
import TextToFormat from "./TextToFormat";
import { Alert } from 'react-native';

const SpeechAction = ({ voiceMessage, characteristic, navigation }) => {
    const bleCMD = TextToFormat(voiceMessage);
    console.log("bleCMD : ", bleCMD);

    if (bleCMD) {
        BluetoothAction(bleCMD, characteristic); 
    } else {
        console.log("CuliAction : ", voiceMessage);
        CuliAction(voiceMessage, navigation);
    }
};

const BluetoothAction = async (command, characteristic) => {
    if (!command || !characteristic) {
        console.error('BluetoothAction Error: Missing command or characteristic.');
        Alert.alert('Error', 'Bluetooth device is not connected.');
        return;
    }

    try {
        console.log(`Executing Bluetooth command: ${command}`);
        await BLEController(command, characteristic);
        console.log(`Command '${command}' sent successfully.`);
    } catch (error) {
        console.error(`Failed to send command '${command}':`, error);
        Alert.alert('Error', 'Failed to connect to Bluetooth device.');
    }
};


const CuliAction = async (message, navigation) => {
    console.log("CuliAction message : ", message);
    navigation.navigate('CuliTalk', { message: message });
};

export default SpeechAction;
