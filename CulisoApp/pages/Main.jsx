import React, { useContext, useEffect, useState } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomButton } from "../modules/Navigator";
import { PermissionRequest } from "../modules/PermissionUtil";
import { BluetoothConnect } from "../modules/Bluetooth";
import Header from "../modules/Header";
import UserDataContext from "../contexts/UserDataContext";

const SearchDevice = ({onPress}) => {
    return (
        <View style={styles.searchContainer}>
            <GetImage type={'SearchDevice'} width={192} height={192}/>
            <Text style={styles.text}>등록된 기기가 없으신가요 ?</Text>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>등록하기</Text>
            </TouchableOpacity>
        </View>
    )
}

const DeviceManage = () => {
    const devicesData = [
        { name: '침실 조명', iconOn: 'DeviceLightOn', iconOff: 'DeviceLightOff', powerOnIcon: 'DevicePowerOn', powerOffIcon: 'DevicePowerOff', bleCMD: 'f', flag: false},
        { name: '거실 조명', iconOn: 'DeviceLightOn', iconOff: 'DeviceLightOff', powerOnIcon: 'DevicePowerOn', powerOffIcon: 'DevicePowerOff', bleCMD: 'b', flag: false },
        { name: '에어컨', iconOn: 'DeviceAirConditionerOn', iconOff: 'DeviceAirConditionerOff', powerOnIcon: 'DevicePowerOn', powerOffIcon: 'DevicePowerOff', bleCMD: 'g', flag: false },
        { name: '커튼', iconOn: 'DeviceCurtainOn', iconOff: 'DeviceCurtainOff', powerOnIcon: 'DevicePowerOn', powerOffIcon: 'DevicePowerOff', bleCMD: 'i', flag: false },
        { name: '보일러', iconOn: 'DeviceWaterHeaterOn', iconOff: 'DeviceWaterHeaterOff', powerOnIcon: 'DevicePowerOn', powerOffIcon: 'DevicePowerOff', bleCMD: null, flag: false },
        { name: 'TV', iconOn: 'DeviceTVOn', iconOff: 'DeviceTVOff', powerOnIcon: 'DevicePowerOn', powerOffIcon: 'DevicePowerOff', bleCMD: 'h', flag: false },
    ];
    const [devices, setDevices] = useState(devicesData.map(device => ({ ...device, status: '꺼짐', icon: device.iconOff, powerIcon: device.powerOffIcon })));

    const toggleDeviceStatus = (index) => {
        const newDevices = [...devices];
        const device = newDevices[index];

        device.status = device.status === '켜짐' ? '꺼짐' : '켜짐';
        device.icon = device.status === '켜짐' ? device.iconOn : device.iconOff;
        device.powerIcon = device.status === '켜짐' ? device.powerOnIcon : device.powerOffIcon;
        device.flag = device.status === '켜짐' ? true : false;
        setDevices(newDevices);
    };
    return (
        <View style={styles.GridWrapper}>
            <View style={styles.Grid}>
                {devices.map((device, index) => (
                    <View style={styles.DeviceCard} key={device.name}>
                        <View style={styles.DeviceHeader}>
                            <GetImage type={device.icon} width={50} height={50}/>
                            <TouchableOpacity style={styles.PowerButton} onPress={() => toggleDeviceStatus(index)}>
                                <GetImage type={device.powerIcon} width={40} height={40} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.DeviceName}>{device.name}</Text>
                        <Text stlye={styles.DeviceStatus}>{device.status}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const Main = ({ navigation }) => {
    const [device, setDevice] = useState(null);
    const userContext = useContext(UserDataContext);
    const { address } = userContext;

    const BluetoothHandler = async () => {
        const result = await BluetoothConnect();
        setDevice(result);
        console.log(device);
    }
    useEffect(()=>{
        PermissionRequest();   
    }, [])

    return (
        <Background center={true}>
            <Header address={address}/>
            {device !== null ?
                <SearchDevice onPress={()=>BluetoothHandler()}/>
                :
                <DeviceManage/>
            }
            
            <BottomButton navigation={navigation}/>
        </Background>
    );
};
const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#ffffff',
        paddingLeft: 60,
        paddingRight: 60,
        paddingBottom: 30,
        paddingTop: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,
        fontFamily: 'KCC-Hanbit',
        textAlign: 'center',
    },
    button: {
        width: 150,
        height: 35,
        backgroundColor: '#B1DBFA',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Sejong hospital Bold',
        color: '#ffffff',
    },
    PowerButton: {
        background: 'none',
        cursor: 'pointer',
    },
    DeviceCard: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 15,
        marginTop: 15,
        width: 150,
        // iOS 쉐도우
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,

        // Android 쉐도우
        elevation: 3,
    },
    DeviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    GridWrapper: {
        justifyContent: 'center',
    },
    Grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 350,
        margin: 'auto',
    },
    DeviceName: {
        fontSize: 18,
        marginTop: 10,
        color: '#333'
    },
    DeviceStatus: {
        fontSize: 16,
        color: 'gray'
    }
});

export default Main;
