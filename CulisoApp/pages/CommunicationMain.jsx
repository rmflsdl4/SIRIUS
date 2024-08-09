import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { GetImage } from '../modules/ImageManager';
import { useNavigation } from '@react-navigation/native';
import Background from '../modules/Background';
import axios from 'axios';

const TopBar = ({ goToPage }) => {
    return (
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => goToPage("afterMain")}>
                <GetImage type={'BackArrow'} width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.mainTitle}>CULISO</Text>
            <GetImage type={'Alarm'} width={22} height={22} />
        </View>
    );
};

const ItemBar = ({ userInfo, goToPage }) => {
    return (
        <View style={styles.topBar}>
            <View style={styles.profileBox}>
                <GetImage type={userInfo[0]?.profile_url ? userInfo[0].profile_url : 'userProfile'} width={39} height={39} />
                <View style={styles.profileCon}>
                    <Text style={styles.userName}>{userInfo[0]?.user_nick_name}</Text>
                    <Text style={styles.subText}>안녕하세요. 반갑습니다.</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => goToPage("contentUpload?prevPage=CommunicationMain")}>
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

    function goToPage(name) {
        navigation.navigate(name);
    }

    const [activeMenu, setActiveMenu] = useState(0);
    const [menuItems, setMenuItems] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [selectedBoardID, setSelectedBoardID] = useState(1); // 기본값은 1로 설정

    // 메뉴 바, 유저 정보 데이터 DB에서 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                await MenuBarValue();
                await UserInfoValue();
    
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);

    const MenuBarValue = () => {
        axios.post('http://192.168.45.113:8080/user/menuBarValue', {}, {  // 빈 객체 '{}'를 명시적으로 추가
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
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
        axios.post('http://192.168.45.113:8080/user/userProfileValue', {}, {  // 빈 객체 '{}'를 명시적으로 추가
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
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
    const handleMenuClick = (boardID, index) => {
        setActiveMenu(index);
        setSelectedBoardID(boardID);
    };

    return (
        <Background center={true}>
            <TopBar goToPage={goToPage} />
            <ItemBar userInfo={userInfo} goToPage={goToPage} />
            <MenuBar menuItems={menuItems} activeMenu={activeMenu} handleMenuClick={handleMenuClick} />

            <ScrollView contentContainerStyle={styles.centerBox}>
                {/* <AllContents boardID={selectedBoardID} /> */}
            </ScrollView>
        </Background>
    );
};

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '7%',
        paddingHorizontal: 20,
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
        height: '79%',
        paddingHorizontal: 20,
    },
});

export default CommunicationMain;
