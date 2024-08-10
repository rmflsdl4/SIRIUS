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



// Main에서 사용하는 하단 버튼 형식
export const BottomButton = ({navigation}) => {
    const Button = ({route, type, text}) => {
        return (
            <TouchableOpacity style={styles.BottomButton} onPress={()=>navigation.navigate(route)}>
                <GetImage type={type} width={50} height={50} marginBottom={5}/>
                <Text style={styles.Text}>{text}</Text>
            </TouchableOpacity> 
        )
    }
    return (
       <View style={styles.BottomButtonContainer}>
            <Button route={''} type={'NavHome'} text={'우리 집'}/>
            <Button route={''} type={'NavBoard'} text={'커뮤니티'}/>
            <Button route={'CuliTalk'} type={'Culi'} text={'큐리'}/>
            <Button route={'Mypage'} type={'NavMypage'} text={'내 정보'}/>
       </View>
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
    BottomButtonContainer: {
        width: '100%',
        justifyContent: 'space-around',
        flexDirection: 'row',
        bottom: 0,
        position: 'absolute',
        marginBottom: 20
    },
    BottomButton: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});