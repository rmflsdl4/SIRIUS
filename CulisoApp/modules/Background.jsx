import React from "react";
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Background = ({ children, center }) => {

    return (
        <LinearGradient
            style={center == true ? styles.linearGradientCenter : styles.linearGradient}
            colors={['#37dbff00', '#7c9acc33', '#5570cd30', '#182ef233', '#a9d7f1', '#9ed4f2', '#55aee0']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
        >
            {children}
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        alignItems: 'center',
    },
    linearGradientCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Background;
