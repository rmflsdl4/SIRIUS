import { PorcupineManager } from '@picovoice/porcupine-react-native';
import RNFS from 'react-native-fs';

const apiKey = "tQRJ2fva4oxHg2W9mVgW62p7YTjYyCzEICrXtnoJKpcW9HxIbYzFJw==";

const CopyFile = async (fileName) => {
  const assetPath = fileName;
  const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  try {
    await RNFS.copyFileAssets(assetPath, localPath);
    console.log("로컬에 파일 복사 완료:", localPath);

    return localPath;
  } catch (error) {
    console.error("파일 복사 중 에러 발생: ", error);
    return null;
  }
};

export const InitBackgroundDetect = async ({ navigation }) => {
  try {
    console.log("Porcupine 초기화 시작");

    // 키워드 파일 및 모델 파일 복사
    const ppnLocalPath = await CopyFile('culi_ko_android.ppn');
    const modelLocalPath = await CopyFile('porcupine_params_ko.pv');

    if (!ppnLocalPath || !modelLocalPath) {
      console.error("파일 경로 확인");
      return;
    }
    // Porcupine 초기화
    const porcupineManager = await PorcupineManager.fromKeywordPaths(
      apiKey,                
      [ppnLocalPath],         
      (keywordIndex) => detectionCallback(keywordIndex, navigation, porcupineManager),     
      processErrorCallback,   
      modelLocalPath,
    );
    await porcupineManager.start();
    console.log("Porcupine 초기화 완료");
  } catch (error) {
    console.error("Porcupine 초기화 중 에러 발생:", error);
  }
};


const detectionCallback = async (keywordIndex, navigation, porcupineManager) => {
  if(keywordIndex === 0){
    console.log("큐리 호출");
    await porcupineManager.stop();
    console.log("Porcupine 작동 중지");
    navigation.replace('VoiceController');
    console.log("보이스 화면 전환");
  }
};
const processErrorCallback = (error) => {
  console.error("감지 중 에러 발생:", error);
};