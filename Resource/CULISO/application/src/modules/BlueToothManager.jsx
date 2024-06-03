import { devicesData } from "../AfterDeviceMain";

export async function VoiceToBlueToothController(characteristic, msg){
    const command = TextToFormat(msg);
    if(characteristic){
        const value = new TextEncoder().encode(command); // 쓸 데이터
        await characteristic.writeValue(value);
    }
}

function TextToFormat(msg){
    const str = msg.replace(/\s+/g, '');

    switch(str){
        case "커튼켜줘":
            if(devicesData.name === "커튼" && devicesData.flag === true) return;
            devicesData.flag = false;
            return 'i';
        case "커튼꺼줘":
            if(devicesData.name === '커튼' && devicesData.flag === false) return;
            devicesData.flag = true;
            return 'i';
        default:
            return;
    }
}