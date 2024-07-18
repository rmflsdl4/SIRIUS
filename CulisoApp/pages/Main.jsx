import React, { useEffect } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const Main = ({ navigation }) => {

    return (
        <Background center={true}>
            <Text>안녕하십니까</Text>
        </Background>
    );
};


export default Main;
