import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GetImage } from './ImageManager';
// Welcome에서 사용하는 버튼 형식
export const Button = ({ type, text, width, height, background, onPress }) => {
    return (
        <TouchableOpacity style={[styles.Button, {backgroundColor: background}]} onPress={onPress}>
            <GetImage type={type} width={width} height={height} marginRight={10}/>
            <Text style={styles.Text}>{text}</Text>
        </TouchableOpacity>
    )
}

// 작은 회색 글씨 이동 메뉴
//export const BottomMenubar({navigation})


// 스타일
const styles = StyleSheet.create({
    Button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 245,
        height: 50,
        borderRadius: 10,
        margin: 10,
        flexDirection: 'row',
    },
    Text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Sejong hospital Bold',
    },
});