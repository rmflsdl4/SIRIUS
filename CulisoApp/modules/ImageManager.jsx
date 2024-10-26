import React from "react";
import { View, Image } from 'react-native';

const images = {
    Logo: require("../assets/images/logo.png"),
    LoginID: require("../assets/images/profile-gray.png"),
    LoginPW: require("../assets/images/closed-padlock-gray.png"),
    Culi: require("../assets/images/culi.png"),
    Polygon: require("../assets/images/polygon.png"),
    LoginButton: require("../assets/images/loginButton.png"),
    SignUpButton: require("../assets/images/signUpButton.png"),
    SignUpID: require("../assets/images/profile-gray.png"),
    SignUpPW: require("../assets/images/closed-padlock-gray.png"),
    SignUpName: require("../assets/images/N-gray.png"),
    SignUpSex: require("../assets/images/gender.png"),
    SignUpAddress: require("../assets/images/search-address.png"),
    SignUpDetailAddress: require("../assets/images/location-pin.png"),
    SignUpPhone: require("../assets/images/phone-gray.png"),
    SignUpMale: require("../assets/images/man.png"),
    SignUpFemale: require("../assets/images/woman.png"),
    NavHome: require("../assets/images/nav_home.png"),
    NavBoard: require("../assets/images/nav_board.png"),
    NavMypage: require("../assets/images/nav_mypage.png"),
    SearchDevice: require("../assets/images/home.png"),
    ProfileMan: require("../assets/images/profile-man.png"),
    ProfileWoman: require("../assets/images/profile-woman.png"),
    ProfileUpdate: require("../assets/images/mypage-modify.png"),
    MypageWriteBorder: require("../assets/images/mypage-list.png"),
    MypageWriteComment: require("../assets/images/comments.png"),
    DevicePowerOn: require("../assets/images/power-on.png"),
    DevicePowerOff: require("../assets/images/power-off.png"),
    DeviceLightOn: require("../assets/images/lighting2-on.png"),
    DeviceLightOff: require("../assets/images/lighting2-off.png"),
    DeviceAirConditionerOn: require("../assets/images/air-conditioner-on.png"),
    DeviceAirConditionerOff: require("../assets/images/air-conditioner-off.png"),
    DeviceCurtainOn: require("../assets/images/curtain-on.png"),
    DeviceCurtainOff: require("../assets/images/curtain-off.png"),
    DeviceWaterHeaterOn: require("../assets/images/water-heater-on.png"),
    DeviceWaterHeaterOff: require("../assets/images/water-heater-off.png"),
    DeviceTVOn: require("../assets/images/tv-on.png"),
    DeviceTVOff: require("../assets/images/tv-off.png"),
    Logout: require("../assets/images/logout.png"),
    SendBlue: require("../assets/images/send-blue.png"),
    Voice: require("../assets/images/voice-blue.png"),
    BackArrow: require("../assets/images/backArrow.png"),
    Alarm: require("../assets/images/alarm.png"),
    Plus2: require("../assets/images/plus2.png"),
    Star: require("../assets/images/star.png"),
    Recommend: require("../assets/images/recommend.png"),
    Views2: require("../assets/images/views2.png"),
    UserProfile: require("../assets/images/userProfile.png"),
    Dropdown: require("../assets/images/dropdown.png"),
    Comments: require("../assets/images/comments.png"),
    Send: require("../assets/images/send.png"),
    Closed4: require("../assets/images/closed4.png"),
    ProfileBlack: require("../assets/images/profile-black.png"),
    Mark: require("../assets/images/mark.png"),
    Closed3: require("../assets/images/closed3.png"),
    Camera: require("../assets/images/camera.png"),
    VolumeUp: require("../assets/images/volume-up.png"),
    VolumeDown: require("../assets/images/volume-down.png"),
    RepeatSound: require("../assets/images/repeatSound.png"),
    LetterA: require("../assets/images/letter-a.png"),
    BluetoothUnconnection: require("../assets/images/bluetoothUnconnection.png"),
    VoiceController: require("../assets/images/voiceController.png"),
};

// GetImage의 type이 images의 키값과 일치해야 이미지를 불러옴

export const GetImage = ({type, width, height, marginLeft, marginRight, marginTop, marginBottom}) => {
    return (
        <Image
            source={images[type]}
            style={{
                width : width,
                height : height,
                marginLeft : marginLeft,
                marginRight : marginRight,
                marginTop : marginTop,
                marginBottom : marginBottom,
            }}
        />
    );
};