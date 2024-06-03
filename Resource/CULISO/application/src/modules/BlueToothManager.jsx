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
        case "침실조명켜줘":
            if(devicesData.name === '침실 조명' && devicesData.flag === true) return;
            devicesData.flag = true;
            return 'f';
        case "침실조명꺼줘":
            if(devicesData.name === '침실 조명' && devicesData.flag === false) return;
            devicesData.flag = true;
            return 'f';
        case "거실조명켜줘":
            if(devicesData.name === '거실 조명' && devicesData.flag === true) return;
            devicesData.flag = true;
            return 'b';
        case "거실조명꺼줘":
            if(devicesData.name === '거실 조명' && devicesData.flag === false) return;
            devicesData.flag = true;
            return 'b';
        case "에어컨켜줘":
            if(devicesData.name === '에어컨' && devicesData.flag === true) return;
            devicesData.flag = true;
            return 'g';
        case "에어컨꺼줘":
            if(devicesData.name === '에어컨' && devicesData.flag === false) return;
            devicesData.flag = true;
            return 'g';
        case "커튼켜줘":
            if(devicesData.name === "커튼" && devicesData.flag === true) return;
            devicesData.flag = false;
            return 'i';
        case "커튼꺼줘":
            if(devicesData.name === '커튼' && devicesData.flag === false) return;
            devicesData.flag = true;
            return 'i';
            
        case "티비켜줘":
            if(devicesData.name === 'TV' && devicesData.flag === true) return;
            devicesData.flag = true;
            return 'h';
        case "티비꺼줘":
            if(devicesData.name === 'TV' && devicesData.flag === false) return;
            devicesData.flag = true;
            return 'h';
            
        default:
            return;
    }
}

export async function BLEController(characteristic, msg){
    if(characteristic){
        const value = new TextEncoder().encode(msg); // 쓸 데이터
        await characteristic.writeValue(value);
    }
}