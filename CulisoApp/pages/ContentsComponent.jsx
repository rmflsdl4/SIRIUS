import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Modal from "react-native-modal";  // react-native-modal을 사용하여 모달을 구현
import { GetImage } from '../modules/ImageManager';
import { useNavigation, useRoute } from "@react-navigation/native";
import CommunityBackground from '../modules/CommunityBackground';
import axios from 'axios';

const TopBar = ({ navigation, newContents, sessionUserID, isDropdownOpen, toggleDropdown, contents_num, contentOpenModal, goToPage }) => {
    return (
        <View style={styles.topBar}>
            <View style={styles.leftContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <GetImage type={'BackArrow'} width={22} height={22} />
                </TouchableOpacity>
                <Text style={styles.mainTitle}>{newContents[0]?.board_name}</Text>
            </View>

            <Container
                newContents={newContents}
                sessionUserID={sessionUserID}
                toggleDropdown={toggleDropdown}
                isDropdownOpen={isDropdownOpen}
                contents_num={contents_num}
                contentOpenModal={contentOpenModal}
                goToPage={goToPage}
            />
        </View>
    );
}

const Container = ({ newContents, sessionUserID, toggleDropdown, isDropdownOpen, contents_num, contentOpenModal, goToPage }) => {
    return (
        <View style={styles.rightContainer}>
            <TouchableOpacity style={[styles.topImg, { marginRight: 15 }]}>
                <GetImage type={'Alarm'} width={22} height={22} />
            </TouchableOpacity>
            {newContents.map((content, index) => (
                <View key={index}>
                    {content.user_iD === sessionUserID && (
                        <TouchableOpacity onPress={toggleDropdown} style={styles.topImg}>
                            <GetImage type={'Dropdown'} width={22} height={22}/>
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            {isDropdownOpen && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => goToPage(`contentUpload?contentsNum=${contents_num}&prevPage=ContentsComponent`)}>
                        <Text>게시글 수정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem} onPress={contentOpenModal}>
                        <Text>게시글 삭제하기</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const ProfileBox = ({ newContents }) => {
    return (
        <View style={styles.profileBox}>
            <GetImage type={newContents[0]?.profile_url ? newContents[0].profile_url : 'UserProfile'} width={39} height={39} />
            <View style={styles.profileCon}>
                <Text style={styles.userName}>{newContents[0]?.user_nick}</Text>
                <Text style={styles.subText}>{newContents[0] ? new Date(newContents[0].contents_date).toLocaleString() : ''}</Text>
            </View>
        </View>
    );
};


const ContentsComponent = () => {
    const postUrl = 'http://192.168.45.113:8080/';

    const navigation = useNavigation();
    const route = useRoute();
    const contents_num = route.params?.contents_num;  // Route에서 params 가져오기
    console.log("contents_num = " + contents_num);

    const [newContents, setNewContents] = useState([]);
    const [comment, setComment] = useState([]);
    const [relatedFiles, setRelatedFiles] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isOpen, setIsOpen] = useState(false);  // 삭제 팝업 상태
    const [isContentOpen, setContentIsOpen] = useState(false);  // 게시글 삭제 팝업 상태
    const [deleteComment, setDeleteComment] = useState();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // 게시글 수정, 삭제 드롭다운 메뉴
    const [isRecommendClicked, setIsRecommendClicked] = useState(false);  // 좋아요 클릭
    const [like, setLike] = useState();  // 좋아요 값 초기화
    const [sessionUserID, setSessionUserID] = useState();

    const goToPage = (name) => {
        navigation.navigate(name);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await BoardContentsValue(contents_num);

                // console.log("setSessionUserID : " + sessionUserID.userID);
                // console.log("sessionUserID : " + sessionUserID);
                
                if (data.contentsResult.length > 0) {
                    setLike(data.contentsResult[0].recommend);
                }

                // // 해당 게시글에 좋아요 눌렀는지 확인
                // if(data.contentsRecommendResult[0].count){
                //     setIsRecommendClicked(true);
                // } else {
                //     setIsRecommendClicked(false);
                // }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [contents_num]);

    const BoardContentsValue = (contents_num) => {
        console.log("Requested contents_num:", contents_num);  // contents_num 값을 콘솔에 출력
    
        axios.post(postUrl + 'user/postContents', { contents_num }, {  // contents_num 전송
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
            if(response.data){
                setNewContents(response.data.contentsResult);
                setComment(response.data.commentResult);
                setRelatedFiles(response.data.fileResult);
                setSessionUserID(response.data.sessionUserID.user_iD);
            }
            else{
                Alert.alert('데이터 로드 실패', '커뮤니티 컨텐츠 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        })
        .catch(err => console.log(err));
      }

    return (
        <CommunityBackground center={false}>
            <TopBar 
                navigation={navigation} 
                newContents={newContents}
                sessionUserID={sessionUserID}
                isDropdownOpen={isDropdownOpen}
                toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                contents_num={contents_num}
                contentOpenModal={() => setContentIsOpen(true)}
                goToPage={goToPage}
            />
            <ProfileBox newContents={newContents} />

        </CommunityBackground>
    );
}

const styles = StyleSheet.create({
    topBar: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50, // 고정된 높이 값으로 변경
        padding: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topImg: {
        marginHorizontal: 10,
    },
    mainTitle: {
        marginLeft: 15,
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: 22,
        height: 22,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 50, 
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 2, 
    },
    dropdownItem: {
        paddingVertical: 8,
    },
    profileBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    profileImg: {
        width: 39,
        height: 39,
        borderRadius: 19.5, // 이미지가 원형으로 보이도록 설정
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
        color: '#6e6e6e', // 서브텍스트의 색상 설정
    },
});

export default ContentsComponent;