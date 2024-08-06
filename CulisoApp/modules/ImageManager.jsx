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

