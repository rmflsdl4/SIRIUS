import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GetImage } from '../modules/ImageManager';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AllContents from './GetCommunityMainData';
import CommunityBackground from '../modules/CommunityBackground';
import axios from 'axios';
import ENDPOINT from "../modules/Endpoint";
import UserDataContext from "../contexts/UserDataContext";
import { BottomButton } from "../modules/Navigator";

const TopBar = ({ navigation }) => {
    return (
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <GetImage type={'BackArrow'} width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.mainTitle}>CULISO</Text>
            <GetImage type={'Alarm'} width={22} height={22} />
        </View>
    );
};

const ItemBar = ({ userInfo, navigation }) => {
    return (
        <View style={styles.topBar}>
            <View style={styles.profileBox}>
                <GetImage type={userInfo[0]?.profile_url ? userInfo[0].profile_url : 'UserProfile'} width={39} height={39} />
                <View style={styles.profileCon}>
                    <Text style={styles.userName}>{userInfo[0]?.user_nick}</Text>
                    <Text style={styles.subText}>안녕하세요. 반갑습니다.</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("ContentUpload", { prevPage: 'CommunicationMain' })}>
                <GetImage type={'Plus2'} width={22} height={22} />
            </TouchableOpacity>
        </View>
    );
};

const MenuBar = ({ menuItems, activeMenu, handleMenuClick }) => {
    return (
        <View style={styles.menuBar}>
            {menuItems && menuItems.map((item, index) => (
                <Text
                    key={item.board_id}
                    style={[styles.menuText, activeMenu === index && styles.activeMenuText]}
                    onPress={() => handleMenuClick(item.board_id, index)}
                >
                    {item.board_name}
                </Text>
            ))}
        </View>
    );
};

const CommunicationMain = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();  // useIsFocused 훅 추가
    const userContext = useContext(UserDataContext);
    const { user_id } = userContext;
    
    const [activeMenu, setActiveMenu] = useState(0);
    const [menuItems, setMenuItems] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [selectedBoardID, setSelectedBoardID] = useState(1); // 기본값은 1로 설정

    useEffect(() => {
        console.log("현재 유저 데이터: ", userContext);
        console.log("현재 유저 아이디: ", user_id);
    }, [userContext]);
    

    // 메뉴 바, 유저 정보 데이터 DB에서 가져오기
    useEffect(() => {
        if (isFocused) {  // 화면이 포커스될 때만 데이터 새로고침
            const fetchData = async () => {
                try {
                    await MenuBarValue();
                    await UserInfoValue();
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [isFocused]);

    const MenuBarValue = () => {
        axios.post(ENDPOINT + 'user/menuBarValue', {}, {  // 빈 객체 '{}'를 명시적으로 추가
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            if(response.data){
                setMenuItems(response.data);
            }
            else{
                Alert.alert('데이터 로드 실패', '메뉴 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        })
        .catch(err => console.log(err));
    }

    const UserInfoValue = () => {
        axios.post(ENDPOINT + 'user/userProfileValue', {user_id: user_id}, {  
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            if(response.data){
                setUserInfo(response.data);
            }
            else{
                Alert.alert('데이터 로드 실패', '유저 프로필 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        })
        .catch(err => console.log(err));
    }
    

    // 메뉴 클릭 시 해당 메뉴의 게시판 번호를 설정하고 AllContents 호출
    const handleMenuClick = (board_id, index) => {
        setActiveMenu(index);
        setSelectedBoardID(board_id);
    };

    return (
        <CommunityBackground center={false}>
            <TopBar navigation={navigation} />
            <ItemBar userInfo={userInfo} navigation={navigation} />
            <MenuBar menuItems={menuItems} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />

            <ScrollView contentContainerStyle={styles.centerBox}>
                <AllContents board_id={selectedBoardID} />
            </ScrollView>

            <BottomButton navigation={navigation} />
        </CommunityBackground>
    );
};

const styles = StyleSheet.create({
    topBar: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    profileBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImg: {
        width: 39,
        height: 39,
    },
    profileCon: {
        marginLeft: 8,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 12,
    },
    topImg: {
        width: 22,
        height: 22,
    },
    plusIcon: {
        width: 22,
        height: 22,
    },
    mainTitle: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    menuBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '7%',
        paddingHorizontal: 50,
    },
    menuText: {
        fontSize: 14,
        color: 'white',
    },
    activeMenuText: {
        color: 'black',
        textDecorationLine: 'underline',
    },
    centerBox: {
        alignItems: 'center',
        flexDirection: 'column',
        height: '77%',
        paddingHorizontal: 20,
    },
});

export default CommunicationMain;
