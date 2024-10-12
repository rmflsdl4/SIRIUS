import React, { useContext, useEffect, useState } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomButton } from "../modules/Navigator";
import UserDataContext from "../contexts/UserDataContext";

const Profile = ({name, sex}) => {
    return (
        <View style={styles.profileContainer}>
            <GetImage type={sex === 'M' ? 'ProfileMan':'ProfileWoman'} width={75} height={75} marginRight={12}/>
            <View>
                <Text style={styles.profileNameText}>{name}</Text>
                <TouchableOpacity style={styles.profileUpdate}>
                    <GetImage type={'ProfileUpdate'} width={13} height={13} marginRight={7}/>
                    <Text style={styles.profileText}>내 정보 수정</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const Section = ({ children, header }) => {
    return(
        <View style={styles.mypageContainer}>
            <Text style={styles.header}>{header}</Text>
            <View style={styles.navBackground}>
                <View style={styles.navContainer}>
                    {children}
                </View>
            </View>
        </View>
    )
}
const Nav = ({ type, name, onPress }) => {
    return(
        <TouchableOpacity style={styles.nav} onPress={onPress}>
            <GetImage type={type} width={20} height={20} marginRight={10}/>
            <Text style={styles.navText}>{name}</Text>
        </TouchableOpacity>
    )
}
const Mypage = ({ navigation }) => {
    
    const userContext = useContext(UserDataContext);
    const { user_name, sex } = userContext;

    return (
        <Background>
            <Profile name={user_name} sex={sex}/>
            <Section header={'커뮤니티'}>
                <Nav type={'MypageWriteBorder'} name={'작성 게시글 목록'} onPress={()=>navigation.navigate('')}/>
                <Nav type={'MypageWriteComment'} name={'작성 댓글 목록'} onPress={()=>navigation.navigate('')}/>
            </Section>
            <Section header={'기기 사용/관리'}>
                <Nav type={'MypageWriteBorder'} name={'기기 목록'} onPress={()=>navigation.navigate('')}/>
                <Nav type={'MypageWriteComment'} name={'사용 기록 조회'} onPress={()=>navigation.navigate('')}/>
                <Nav type={'MypageWriteComment'} name={'기기 등록 요청'} onPress={()=>navigation.navigate('')}/>
                <Nav type={'MypageWriteComment'} name={'루틴 관리'} onPress={()=>navigation.navigate('')}/>
            </Section>
            <BottomButton navigation={navigation}/>
        </Background>
    );
};
const styles = StyleSheet.create({
    profileContainer: {
        width: "80%",
        alignItems: 'center',
        justifyContent: 'left',
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 20
    },
    profileUpdate: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        marginTop: 2
    },
    profileNameText: {
        marginBottom: 2,
        fontSize: 20,
        fontFamily: 'KCC-Hanbit',
        color: 'black'
    },
    profileButtonText: {
        fontSize: 12,
        fontFamily: 'Sejong hospital Bold',
        color: 'black'
    },
    mypageContainer: {
        width: "80%",
        flexDirection: 'column',
        marginVertical: 25
    },
    navBackground: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: 15,
    },
    navContainer: {
        width: '80%',
        flexDirection: 'column',
    },
    header: {
        fontSize: 17,
        fontFamily: 'KCC-Hanbit',
        color: 'black',
        marginBottom: 5
    },
    nav: {
        marginTop: 8,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'left',
        flexDirection: 'row',
    },
    navText: {
        fontSize: 16,
        fontFamily: 'KCC-Hanbit',
    }
});

export default Mypage;
