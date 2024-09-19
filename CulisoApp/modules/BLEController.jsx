import { Buffer } from 'buffer';

const BLEController = async (msg, characteristic) => {
    if (msg && characteristic) {
        try {
            const bleCMD = Buffer.from(msg, 'utf-8').toString('base64');
            await characteristic.writeWithResponse(bleCMD);
            console.log(`명령 '${msg}' 전송 성공.`);
        } catch (error) {
            console.error(`명령 '${msg}' 전송 실패:`, error);
        }
    } else {
        console.error("characteristic or msg is missing");
    }
};

export default BLEController;
