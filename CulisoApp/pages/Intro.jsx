import React, { useEffect } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';

const TimeOut = (navigation) => {
    setTimeout(() => {
        navigation.navigate('Welcome');
    }, 2000);
}

const Intro = ({ navigation }) => {

    useEffect(() => {
        TimeOut(navigation);
    }, []);

    return (
        <Background center={true}>
            <GetImage type={'Logo'} width={204} height={240} />
        </Background>
    );
};


export default Intro;
