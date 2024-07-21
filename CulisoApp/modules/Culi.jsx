import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { GetImage } from './ImageManager';

const Bubble = ({text}) => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage(text);
    }, [text]);

    return (
        <View style={styles.Bubble}>
            <GetImage type={'Polygon'} width={16} height={16} />
            <View style={styles.MessageContainer}>
                <Text style={styles.Message}>{message}</Text>
            </View>
        </View>
    )
}

export const SpeechBubbleMessage = ({text}) => {
    return (
        <View style={styles.CuliContainer}>
            <GetImage type={'Culi'} width={64} height={64} marginTop={50} marginBottom={10}/>
            <Bubble text={text}/>
        </View>
    )
}
const styles = StyleSheet.create({
    CuliContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    Bubble: {
        width: 276,
        alignItems: 'center',
        justifyContent: 'center',
    },
    MessageContainer: {
        marginTop: -3,
        width: '100%',
        height: 51,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        // Android shadow properties
        elevation: 4,
        // iOS shadow properties
        shadowColor: '#5f5f5f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        
        alignItems: 'center',
        justifyContent: 'center',
    },
    Message: {
        color: '#8AC0FF',
        fontSize: 16,
        fontFamily: 'Sejong hospital Bold',
        textAlign: 'center',
    },
});