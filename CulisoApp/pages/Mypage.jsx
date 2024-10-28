import React, { useContext, useEffect, useState } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { BottomButton } from "../modules/Navigator";
import UserDataContext from "../contexts/UserDataContext";
import { getVoiceAutoMode, storeVoiceAutoMode, voiceAutoModeOff } from "../modules/auth";
import VoiceAutoModeContext from "../contexts/VoiceAutoModeContext";

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
const VoiceModeModal = ({ visible, title, text, onConfirm, onCancel }) => (
    <Modal transparent={true} visible={visible} onRequestClose={onCancel}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{title}</Text>
                <Text style={styles.modalText}>{text}</Text>
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                        <Text style={styles.buttonText}>네</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                        <Text style={styles.buttonText}>아니오</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const Mypage = ({ navigation }) => {
    const userContext = useContext(UserDataContext);
    const { user_name, sex } = userContext;
    const { isVoiceAutoModeEnabled, setIsVoiceAutoModeEnabled } = useContext(VoiceAutoModeContext);
    const [voiceModeModalVisible, setVoiceModeModalVisible] = useState(false);
    const [isActivating, setIsActivating] = useState(false); // 모드 활성화 여부 추적

    const handleVoiceAutoModeChange = async (isEnabled) => {
        if (isEnabled) {
            await storeVoiceAutoMode(true); // 활성화
        } else {
            await voiceAutoModeOff(); // 비활성화
        }
        setIsVoiceAutoModeEnabled(isEnabled);
        setVoiceModeModalVisible(false);
    };

    const openModal = (activating) => {
        setIsActivating(activating);
        setVoiceModeModalVisible(true);
    };

    return (
        <Background>
            <Profile name={user_name} sex={sex} />
            <Section header={'커뮤니티'}>
                <Nav type={'MypageWriteBorder'} name={'작성 게시글 목록'} onPress={() => navigation.navigate('')} />
                <Nav type={'MypageWriteComment'} name={'작성 댓글 목록'} onPress={() => navigation.navigate('')} />
            </Section>
            <Section header={'기기 사용/관리'}>
                <Nav type={'MypageWriteBorder'} name={'기기 목록'} onPress={() => navigation.navigate('')} />
                <Nav type={'MypageWriteComment'} name={'사용 기록 조회'} onPress={() => navigation.navigate('')} />
                <Nav type={'MypageWriteComment'} name={'기기 등록 요청'} onPress={() => navigation.navigate('')} />
                <Nav type={'MypageWriteComment'} name={'루틴 관리'} onPress={() => navigation.navigate('')} />

                {isVoiceAutoModeEnabled ? (
                    <Nav 
                        type={'MypageWriteComment'} 
                        name={'음성 자동 모드 해제'} 
                        onPress={() => openModal(false)} 
                    />
                ) : (
                    <Nav 
                        type={'MypageWriteComment'} 
                        name={'음성 자동 모드 활성화'} 
                        onPress={() => openModal(true)} 
                    />
                )}
            </Section>

            <VoiceModeModal
                visible={voiceModeModalVisible}
                title={isActivating ? "음성 자동 모드 활성화" : "음성 자동 모드 해제"}
                text={
                    isActivating
                        ? "음성 자동 모드를 활성화하시겠습니까?"
                        : "정말로 음성 자동 모드를 해제하시겠습니까?"
                }
                onConfirm={() => handleVoiceAutoModeChange(isActivating)}
                onCancel={() => setVoiceModeModalVisible(false)}
            />

            <BottomButton navigation={navigation} />
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    confirmButton: {
        backgroundColor: '#2196F3', // 파란색 버튼
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginRight: 10,
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336', // 빨간색 버튼
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Mypage;
