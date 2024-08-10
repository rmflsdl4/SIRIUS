import React, { useEffect } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const TalkButton = ({type, onPress}) => {
    return(
        <TouchableOpacity onPress={onPress}>
            <GetImage type={type} width={35} height={35} marginLeft={5} marginRight={5}/>
        </TouchableOpacity>
    )
}

const CuliTalk = ({ navigation }) => {
    return (
        <Background center={true}>
            <View style={styles.sendContainer}>
                <TextInput style={styles.inputText} placeholder={'메세지를 입력하세요.'}/>
                <View style={styles.img}>
                    <TalkButton type={'Voice'} />
                    <TalkButton type={'Send'} />
                </View>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    sendContainer: {
        width: '100%',
        height: 55,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#359EFF',
        backgroundColor: '#D7EAFF',
        position: 'absolute',
        bottom: 0
    },
    inputText: {
        marginLeft: 10,
        width: 300,
        fontSize: 17,
        fontFamily: 'KCC-Hanbit',
    },
    img: {
        flexDirection: 'row',
        marginRight: 10
    }
});

export default CuliTalk;
