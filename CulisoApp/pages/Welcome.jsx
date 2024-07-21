import React, { useEffect } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { SpeechBubbleMessage } from '../modules/Culi'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Button } from '../modules/Navigator'

const Welcome = ({ navigation }) => {

    return (
        <Background center={true}>
            <GetImage type={'Logo'} width={170} height={200} />
            <SpeechBubbleMessage text={"큐리소에 오신 것을 환영합니다 !"}/>
            
            <View style={styles.margin}/>
            <Button 
                onPress={()=>navigation.navigate('Login')}
                type={'LoginButton'} 
                text={'CULISO 로그인'} 
                width={22}
                height={22}
                background={'#67ADFF'} 
            />
            <Button 
                onPress={()=>navigation.navigate('SignUp')}
                type={'SignUpButton'} 
                text={'회원가입'} 
                width={26}
                height={26}
                background={'#4B93FF'} 
            />
        </Background>
    );
};

const styles = StyleSheet.create({
    margin: {
        marginTop: 70,
    },
});

export default Welcome;
