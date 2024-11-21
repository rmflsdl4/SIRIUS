import DevicesData from "./DevicesData";

const TextToFormat = (msg) => {
    // 공백 제거하고 소문자로 변환
    const str = msg.replace(/\s+/g, '').toLowerCase();

    switch (str) {
        case "침실조명켜줘":
        case "침실불켜줘":
            const bedroomDeviceOn = DevicesData.find(device => device.name === '침실 조명');
            if (bedroomDeviceOn && bedroomDeviceOn.flag === true) return;
            if (bedroomDeviceOn) bedroomDeviceOn.flag = true;
            return 'f';

        case "침실조명꺼줘":
        case "침실불꺼줘":
            const bedroomDeviceOff = DevicesData.find(device => device.name === '침실 조명');
            if (bedroomDeviceOff && bedroomDeviceOff.flag === false) return;
            if (bedroomDeviceOff) bedroomDeviceOff.flag = false;
            return 'f';

        case "거실조명켜줘":
        case "거실불켜줘":
            const livingRoomDeviceOn = DevicesData.find(device => device.name === '거실 조명');
            if (livingRoomDeviceOn && livingRoomDeviceOn.flag === true) return;
            if (livingRoomDeviceOn) livingRoomDeviceOn.flag = true;
            return 'b';

        case "거실조명꺼줘":
        case "거실불꺼줘":
            const livingRoomDeviceOff = DevicesData.find(device => device.name === '거실 조명');
            if (livingRoomDeviceOff && livingRoomDeviceOff.flag === false) return;
            if (livingRoomDeviceOff) livingRoomDeviceOff.flag = false;
            return 'b';

        case "에어컨켜줘":
            const airConditionerDeviceOn = DevicesData.find(device => device.name === '에어컨');
            if (airConditionerDeviceOn && airConditionerDeviceOn.flag === true) return;
            if (airConditionerDeviceOn) airConditionerDeviceOn.flag = true;
            return 'g';

        case "에어컨꺼줘":
            const airConditionerDeviceOff = DevicesData.find(device => device.name === '에어컨');
            if (airConditionerDeviceOff && airConditionerDeviceOff.flag === false) return;
            if (airConditionerDeviceOff) airConditionerDeviceOff.flag = false;
            return 'g';

        case "커튼켜줘":
        case "커튼걷어줘":
        case "커튼올려줘":
        case "커튼열어줘":
        case "커튼치워줘":
            const curtainDeviceOn = DevicesData.find(device => device.name === '커튼');
            if (curtainDeviceOn && curtainDeviceOn.flag === true) return;
            if (curtainDeviceOn) curtainDeviceOn.flag = true;
            return 'i';

        case "커튼꺼줘":
        case "커튼닫아줘":
        case "커튼내려줘":
        case "커튼닫아줘":
        case "커튼쳐줘":   
            const curtainDeviceOff = DevicesData.find(device => device.name === '커튼');
            if (curtainDeviceOff && curtainDeviceOff.flag === false) return;
            if (curtainDeviceOff) curtainDeviceOff.flag = false;
            return 'i';

        case "tv켜줘":
        case "티비켜줘":
            const tvDeviceOn = DevicesData.find(device => device.name === 'TV');
            if (tvDeviceOn && tvDeviceOn.flag === true) return;
            if (tvDeviceOn) tvDeviceOn.flag = true;
            return 'h';

        case "tv꺼줘":
        case "티비꺼줘":
            const tvDeviceOff = DevicesData.find(device => device.name === 'TV');
            if (tvDeviceOff && tvDeviceOff.flag === false) return;
            if (tvDeviceOff) tvDeviceOff.flag = false;
            return 'h';

        default:
            return null;
    }
}

export default TextToFormat;
