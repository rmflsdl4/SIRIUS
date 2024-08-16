import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback  } from "react-native";
import Modal from "react-native-modal";  // react-native-modal을 사용하여 모달을 구현
import { GetImage } from '../modules/ImageManager';
import { useNavigation, useRoute } from "@react-navigation/native";
import CommunityBackground from '../modules/CommunityBackground';
import axios from 'axios';
import CustomStyles from '../modules/ModalComponent';

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
                    {content.user_id === sessionUserID && (
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

const NewContents = ({ newContents, relatedFiles, isRecommendClicked, like, handleRecommendClick, comment }) => {
    return (
        <View>
            {newContents.map((content, index) => (
                <View key={index} style={styles.boardCommunityContents}>
                    <Text style={styles.contentsTitle}>{content.contents_title}</Text>
                    <View style={styles.contents}>
                        <Text>{content.content}</Text>
                        {relatedFiles.length > 0 && (
                            <View style={styles.contentsImgBox}>
                                <Swiper
                                    style={styles.wrapper}
                                    showsButtons={true}
                                >
                                    {relatedFiles.map((file, fileIndex) => (
                                        <View key={fileIndex} style={styles.slide}>
                                            <Image
                                                source={{ uri: postUrl + `${file.file_url}${file.file_name}` }}
                                                style={styles.image}
                                            />
                                        </View>
                                    ))}
                                </Swiper>
                            </View>
                        )}
                    </View>
                    <View style={styles.element}>
                        <TouchableOpacity onPress={handleRecommendClick}>
                            <Image
                                source={require('../assets/images/recommend.png')}
                                style={[styles.icon, isRecommendClicked && styles.clickedIcon]}
                            />
                        </TouchableOpacity>
                        <Text style={styles.recommendAndContentsNum}>{like}</Text>
                        <GetImage type={'Comments'} width={20} height={20} marginRight={10} />
                        <Text style={styles.recommendAndContentsNum}>{comment.length}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};


const Comment = ({ comment, sessionUserID, openModal, setDeleteComment }) => {
    return (
        <View>
            {comment.length > 0 ? (
                <View style={styles.boardCommunityContents}>
                    <Text style={styles.contentsTitle}>댓글</Text>
                    {comment.map((commentItem, index) => (
                        <View key={index} style={styles.commentContainer}>
                            <GetImage type={commentItem.profile_url ? commentItem.profile_url : 'ProfileBlack'} width={25} height={25} marginRight={10} />
                            <View style={styles.commentContent}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userNick}>{commentItem.user_nick}</Text>
                                    <Text style={styles.writeDate}>{new Date(commentItem.comment_date).toLocaleString()}</Text>
                                </View>
                                <Text style={styles.commentText}>{commentItem.comment_content}</Text>
                            </View>
                            {commentItem.user_id === sessionUserID && (
                                <TouchableOpacity onPress={() => { openModal(); setDeleteComment(commentItem.comment_num) }}>
                                    <GetImage type={'Closed4'} width={13} height={13} marginRight={10} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.boardCommunityContents}>
                    <Text style={styles.contentsTitle}>댓글</Text>
                    <Text style={styles.contentsTitle}>댓글이 없습니다.</Text>
                </View>
            )}
        </View>
    );
};

const CommentWriteBox = ({ newComment, handleCommentChange, handleCommentSubmit }) => {
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
            style={styles.commentWriteContainer}
            keyboardVerticalOffset={0}
        >
            <View style={styles.commentWriteBox}>
                <TextInput
                    style={styles.textArea}
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChangeText={handleCommentChange}
                    multiline={true}
                />
                <TouchableOpacity onPress={handleCommentSubmit} style={styles.submitButton}>
                    <GetImage type="Send" width={24} height={24} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

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

    const openModal = () => {
        setIsOpen(true);
    };
    
    const closeModal = () => {
        setIsOpen(false);
    };
    
    const contentOpenModal = () => {
        setContentIsOpen(true);
    };
    
    const contentCloseModal = () => {
        setContentIsOpen(false);
    };    

    const goToPage = (name) => {
        navigation.navigate(name);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await BoardContentsValue(contents_num);
                if (data) {
                    setNewContents(data.contentsResult);
                    setComment(data.commentResult);
                    setRelatedFiles(data.fileResult);
                    setSessionUserID(data.sessionUserID);
    
                    console.log("setSessionUserID : " + data.sessionUserID);
                    console.log("sessionUserID : " + sessionUserID);
    
                    if (data.contentsResult.length > 0) {
                        setLike(data.contentsResult[0].recommend);
                    }
    
                    // 해당 게시글에 좋아요 눌렀는지 확인
                    if(data.contentsRecommendResult){
                        setIsRecommendClicked(true);
                    } else {
                        setIsRecommendClicked(false);
                    }

                    console.log("isRecommendClicked : " + isRecommendClicked);
                } else {
                    console.error("No data returned from the server.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [contents_num]);
    
    const BoardContentsValue = async (contents_num) => {
        try {
            console.log("Requested contents_num:", contents_num);  // contents_num 값을 콘솔에 출력
    
            const response = await axios.post(postUrl + 'user/postContents', { contents_num }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
    
            console.log(response.data);
    
            if (response.data) {
                return response.data;
            } else {
                Alert.alert('데이터 로드 실패', '커뮤니티 컨텐츠 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleCommentChange = (text) => {
        setNewComment(text);
    };    

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // 드롭다운 메뉴 있을 때 화면 터치 이벤트
    const screenTouch = () => {
        if(isDropdownOpen === true) {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };
    
    // 댓글 작성하기
    const handleCommentSubmit = async () => {
        try {
            if(newComment !== "") {
                try {
                    const data = {
                        comment_content: newComment, 
                        contents_num: contents_num
                    };

                    console.log("comment_content : " + data.comment_content);
                    console.log("contents_num : " + data.contents_num);

                    const response = await axios.post(postUrl + 'user/commentInsert', data, {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                    });
            
                    console.log(response.data);
            
                    if (response.data) {
                        setNewComment(""); // 입력 필드를 초기화
                        setComment(response.data || []);
                    } else {
                        Alert.alert('데이터 로드 실패', '댓글 데이터를 불러오는데 실패했습니다.', [
                            { text: '확인', onPress: () => console.log('alert closed') },
                        ]);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    // 댓글 삭제하기
    const handleCommentDelete = async () => {
        try {
            const data = {
                contents_num: contents_num,
                comment_num: deleteComment
            };

            const response = await axios.post(postUrl + 'user/commentDelete', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
    
            console.log(response.data);
    
            if (response.data) {
                setComment(response.data || []);
                closeModal();
            } else {
                Alert.alert('데이터 로드 실패', '댓글 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // 게시글 삭제하기
    const handleDeletePost = async () => {
        try {
            const data = {
                contents_num: contents_num
            };

            const response = await axios.post(postUrl + 'user/contentsDelete', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
    
            console.log(response.data);
    
            if (response.data) {
                navigation.navigate("CommunicationMain")
            } else {
                Alert.alert('데이터 로드 실패', '댓글 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // 추천 이벤트
    const handleRecommendClick = async () => {
        // 새로운 추천 상태 값을 결정합니다.
        const newRecommendClicked = !isRecommendClicked;
        
        // 추천 상태를 업데이트합니다.
        setIsRecommendClicked(newRecommendClicked);

        try {
            // 서버로 보낼 체크 값을 설정합니다.
            const check = newRecommendClicked ? 1 : 0;

            const data = {
                check: check,
                contents_num: contents_num
            };

            const response = await axios.post(postUrl + 'user/recommendClicked', data, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });
    
            console.log(response.data);
    
            if (response.data) {
                setLike(response.data);
            } else {
                Alert.alert('데이터 로드 실패', '추천 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={screenTouch}>
            <CommunityBackground center={false}>
                <TopBar 
                    navigation={navigation} 
                    newContents={newContents}
                    sessionUserID={sessionUserID}
                    isDropdownOpen={isDropdownOpen}
                    toggleDropdown={toggleDropdown}
                    contents_num={contents_num}
                    contentOpenModal={() => setContentIsOpen(true)}
                    goToPage={goToPage}
                />
                <ProfileBox newContents={newContents} />

                <ScrollView style={styles.boardCenterBox} >
                    <NewContents 
                        newContents={newContents} 
                        relatedFiles={relatedFiles} 
                        isRecommendClicked={isRecommendClicked} 
                        like={like} 
                        handleRecommendClick={handleRecommendClick} 
                        comment={comment}
                    />
                    <Comment 
                        comment={comment} 
                        sessionUserID={sessionUserID} 
                        openModal={openModal} 
                        setDeleteComment={setDeleteComment} 
                    />
                </ScrollView>

                <CommentWriteBox
                    newComment={newComment}
                    handleCommentChange={handleCommentChange}
                    handleCommentSubmit={handleCommentSubmit}
                />

                {/* 댓글 삭제 모달 */}
                <Modal isVisible={isOpen} onBackdropPress={closeModal} style={CustomStyles}>
                    <View style={styles.modalContent}>
                        <GetImage type="Mark" width={50} height={50} />
                        <Text style={styles.modalTitle}>댓글을 삭제하시겠습니까?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleCommentDelete}>
                                <Text style={styles.modalButtonText}>확인</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                                <Text style={styles.modalButtonText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* 게시글 삭제 모달 */}
                <Modal isVisible={isContentOpen} onBackdropPress={contentCloseModal} style={CustomStyles}>
                    <View style={styles.modalContent}>
                        <GetImage type="Mark" width={50} height={50} />
                        <Text style={styles.modalTitle}>게시글을 삭제하시겠습니까?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleDeletePost}>
                                <Text style={styles.modalButtonText}>확인</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={contentCloseModal}>
                                <Text style={styles.modalButtonText}>취소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </CommunityBackground>
        </TouchableWithoutFeedback>
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
    dropdownMenu: {
        position: 'absolute',
        top: 40, 
        right: 8,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 10,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 2, 
        zIndex: 9999,
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
    boardCenterBox: {
        padding: 10,
        flexDirection: 'column',
        height: '80%',
        paddingBottom: 20,
    },
    boardCommunityContents: {
        width: 'calc(100% - 40px)',
        backgroundColor: 'white',
        borderRadius: 15,
        flexDirection: 'column',
        marginBottom: 20,
        padding: 10,
        boxSizing: 'border-box', // React Native에서 기본적으로 적용됨
    },
    contentsTitle: {
        width: '100%',
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    contents: {
        fontSize: 14,
        paddingHorizontal: 10,
    },
    contentsImgBox: {
        marginTop: 10,
    },
    wrapper: {},
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    image: {
        width: '100%',
        height: 200,
    },
    element: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    clickedIcon: {
        tintColor: '#50C878', // 적용 가능한 색상
    },
    recommendAndContentsNum: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        fontSize: 16,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    commentProfile: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    userNick: {
        fontWeight: 'bold',
    },
    writeDate: {
        fontSize: 12,
        color: '#999',
    },
    commentText: {
        fontSize: 14,
    },
    commentDeleteIcon: {
        width: 13,
        height: 13,
        marginLeft: 10,
    },
    deleteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: 20,
    },
    deleteBtnLeft: {
        padding: 10,
        marginRight: 10,
        backgroundColor: '#A9A9A9',
        color: 'white',
        borderRadius: 8,
    },
    deleteBtnRight: {
        padding: 10,
        backgroundColor: '#42A5F5',
        color: 'white',
        borderRadius: 8,
    },
    commentWriteContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },

    commentWriteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F7F7F7',
        borderColor: '#ddd',
        borderTopWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    
    textArea: {
        flex: 1,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 10,
    },

    submitButton: {
        backgroundColor: '#50C878',
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        margin: 5,
        padding: 10,
        backgroundColor: '#42A5F5',
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalButtonLeft: {
        backgroundColor: '#A9A9A9',
    },
});


export default ContentsComponent;