import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Button, Alert, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GetImage } from '../modules/ImageManager';
import CommunityBackground from '../modules/CommunityBackground';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const TopBar = ({ navigation, prevPage, checkItems }) => {
    return (
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <GetImage type={'Closed3'} width={22} height={22} />
            </TouchableOpacity>
            <Text style={styles.mainTitle}>
                {prevPage === "CommunicationMain" ? "글쓰기" : "글수정"}
            </Text>
            <TouchableOpacity style={styles.topBtn} onPress={checkItems}>
                <Text style={styles.topBtnText}>완료</Text>
            </TouchableOpacity>
        </View>
    );
};

const OptionBox = ({ boardData, sendContents, handleCheckboxChange }) => {
    return (
        <View style={styles.optionBox}>
            {boardData.map((board, index) => (
                <View key={index} style={styles.checkboxContainer}>
                    <TouchableOpacity 
                        onPress={() => handleCheckboxChange(board.board_id)} 
                        style={styles.checkbox}>
                        {sendContents.board_id === board.board_id && <View style={styles.checkedBox} />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel}>{board.board_name}</Text>
                </View>
            ))}
        </View>            
    );
};

const TitleAndContent = ({
    prevPage,
    contentData,
    sendContents,
    setSendContents,      // 추가
    setChangeTitle,       // 추가
    setChangeContents,    // 추가
    setDeleteFiles,       // 추가
    fileInputRef,
    relatedFiles,
    setRelatedFiles       // 추가
}) => {

    // 제목과 내용을 위한 초기값 설정
    const initialTitle = prevPage === "ContentsComponent" ? contentData[0]?.contentsTitle : sendContents.title;
    const initialContents = prevPage === "ContentsComponent" ? contentData[0]?.content : sendContents.contents;

    // 파일 선택 버튼 클릭 시, 파일 선택을 위한 DocumentPicker 사용
    const handleImageButtonClick = async () => {
        console.log('파일 선택중');

        try {
            const selectedFiles = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: true,  // 다중 선택을 허용
            });
    
            setRelatedFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
            } else {
                console.error('File selection error: ', err);
            }
        }
    };

    // 제목과 내용 입력 시, 값을 저장
    const handleInputChange = (name, value) => {
        setSendContents(prevState => ({
            ...prevState,
            [name]: value
        }));

        // 제목, 내용 입력했는지 파악
        if (name === 'title') {
            setChangeTitle(true);
        } else if (name === 'contents') {
            setChangeContents(true);
        }
    };

    // 업로드 할 사진 제거
    const handleRemoveFile = (fileIndex) => {
        setRelatedFiles(prevFiles => {
            const fileToDelete = prevFiles[fileIndex];

            // 파일 경로인지 확인 (파일 자체가 아닌 경우에만 추가)
            if (fileToDelete.fileUrl) {
                setDeleteFiles(prevDeleteFiles => [...prevDeleteFiles, fileToDelete]);
            }

            // relatedFiles에서 파일 제거
            return prevFiles.filter((_, index) => index !== fileIndex);
        });
    };

    return (
        <View>
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="제목"
                    onChangeText={(text) => handleInputChange('title', text)}
                    defaultValue={initialTitle}
                />
                <TextInput
                    style={styles.textArea}
                    placeholder="내용을 입력하세요."
                    onChangeText={(text) => handleInputChange('contents', text)}
                    defaultValue={initialContents}
                    multiline={true}
                />
            </ScrollView>
            <View style={styles.photoUploadBox}>
                <TouchableOpacity onPress={handleImageButtonClick} style={styles.photoButton}>
                    <GetImage type="Camera" width={30} height={30} />
                </TouchableOpacity>

                {relatedFiles.length > 0 && (
                    <View style={styles.contentsImgBox}>
                        {relatedFiles.map((file, fileIndex) => (
                            <View key={fileIndex} style={styles.imageContainer}>
                                <Image
                                    source={{ uri: file.uri || file.fileUrl }}
                                    style={styles.image}
                                />
                                <TouchableOpacity onPress={() => handleRemoveFile(fileIndex)} style={styles.imgCloseBtn}>
                                    <Text style={{ color: 'white' }}>&times;</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};


const ContentUpload = () => {
    const postUrl = 'http://192.168.45.113:8080/';

    const navigation = useNavigation();
    const route = useRoute();
    
    const [contentData, setContentData] = useState([]);
    const [boardData, setBoardData] = useState([]);
    const [relatedFiles, setRelatedFiles] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [checkItemsIsOpen, setCheckItemsIsOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [defaultTitle, setDefaultTitle] = useState(contentData[0]?.contentsTitle || '');
    const [defaultContents, setDefaultContents] = useState(contentData[0]?.content || '');
    const [changeTitle, setChangeTitle] = useState(false);
    const [changeContents, setChangeContents] = useState(false);
    const [sendContents, setSendContents] = useState({
        board_id: '',
        title: '',
        contents: ''
    });

    const { contentsNum: sendContentsNum, prevPage } = route.params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(prevPage === "ContentsComponent") {
                    const data = await PrevPageValue(sendContentsNum);
                    setContentData(data.contentsResult);
                    const files = data.fileResult.map(file => ({
                        fileUrl: postUrl + `${file.fileUrl}${file.fileName}`
                    }));
                        setRelatedFiles(files);
                        setDefaultTitle(data.contentsResult[0]?.contentsTitle);
                        setDefaultContents(data.contentsResult[0]?.content);
                } else {
                    await CheckBoard();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [prevPage]);

    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const checkItemsOpenModal = () => {
        setCheckItemsIsOpen(true);
    }

    const checkItemsCloseModal = () => {
        setCheckItemsIsOpen(false);
    }

    // 게시판 체크박스 목록 가져오기
    const CheckBoard = () => {
        axios.post(postUrl + 'user/CheckBoard', {}, {  // 빈 객체 '{}'를 명시적으로 추가
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
            if(response.data){
                setBoardData(response.data);
            }
            else{
                Alert.alert('데이터 로드 실패', '유저 프로필 데이터를 불러오는데 실패했습니다.', [
                    { text: '확인', onPress: () => console.log('alert closed') },
                ]);
            }
        })
        .catch(err => console.log(err));
    }

    // 글 생성, 수정 전 입력 요소 확인
    const checkItems = () => {
        if(prevPage === "CommunicationMain") {
            if (sendContents.title && sendContents.contents && sendContents.board_id) {
                openModal();      // 아이템이 다 체크되었을 때
            } else {
                checkItemsOpenModal()     // 아이템이 다 체크 안되었을 때
            }
        }
        else {
            openModal();
        }
    }

    // 글 생성 게시판 선택
    const handleCheckboxChange = (board_id) => {
        setSendContents(prevState => ({
            ...prevState,
            board_id: board_id
        }));
    };

    // 게시글 수정 및 삽입
    const handleTopBtnClick = async () => {
        const formData = new FormData();

        if (prevPage === "ContentsComponent") {
            console.log("완료 버튼 클릭 - 업데이트 함수");

            if (changeTitle && !changeContents) {
                formData.append('title', sendContents.title);
                formData.append('contents', defaultContents);
            } else if (!changeTitle && changeContents) {
                formData.append('title', defaultTitle);
                formData.append('contents', sendContents.contents);
            } else if (!changeTitle && !changeContents) {
                formData.append('title', defaultTitle);
                formData.append('contents', defaultContents);
            } else {
                formData.append('title', sendContents.title);
                formData.append('contents', sendContents.contents);
            }

            formData.append('contentsNum', sendContentsNum);

            relatedFiles.forEach((file, index) => {
                if (typeof file.uri === 'string') {
                    formData.append(`images`, {
                        uri: file.uri,
                        type: file.type,
                        name: file.name || `image_${index}.jpg`,
                    });
                } else {
                    formData.append(`imgUrl`, file.fileUrl);
                }
            });

            // deleteFiles 배열에서 중복 제거 및 파일 이름 부분만 추출
            const uniqueDeleteFiles = Array.from(new Set(deleteFiles.map(file => file.fileUrl.split('/').pop())));
            console.log("deleteFiles: ", uniqueDeleteFiles);

            uniqueDeleteFiles.forEach((file, index) => {
                formData.append(`delImgName`, file);
            });

            try {
                const path = "ContentsUpdate";
                await ContentsControl(path, formData);
                goToPage("CommunicationMain");
            } catch (error) {
                console.error("Error submitting comment:", error);
            }

        } else if (prevPage === "CommunicationMain") {
            console.log("완료 버튼 클릭 - 삽입 함수");

            formData.append('title', sendContents.title);
            formData.append('contents', sendContents.contents);
            formData.append('boardID', sendContents.boardID);

            relatedFiles.forEach(file => {
                formData.append('images', {
                    uri: file.uri,
                    type: file.type,
                    name: file.name || `image_${index}.jpg`,
                });
            });

            try {
                const path = "ContentsInsert";
                await ContentsControl(path, formData);
                goToPage("CommunicationMain");
            } catch (error) {
                console.error("Error submitting comment:", error);
            }
        }
    };
    
    return (
        <CommunityBackground center={false}>
            <TopBar navigation={navigation} prevPage={prevPage} checkItems={checkItems} />
            
            <View style={styles.bg}>
                <ScrollView style={styles.centerBox}>
                    {prevPage === "CommunicationMain" && 
                        <OptionBox 
                            boardData={boardData} 
                            sendContents={sendContents} 
                            handleCheckboxChange={handleCheckboxChange} 
                        />
                    }

                    <TitleAndContent 
                        prevPage={prevPage}
                        contentData={contentData}
                        sendContents={sendContents}
                        setSendContents={setSendContents}         // 추가
                        setChangeTitle={setChangeTitle}           // 추가
                        setChangeContents={setChangeContents}     // 추가
                        setDeleteFiles={setDeleteFiles}           // 추가
                        fileInputRef={fileInputRef}
                        relatedFiles={relatedFiles}
                        setRelatedFiles={setRelatedFiles}         // 추가
                    />
                </ScrollView>
            </View>
        </CommunityBackground>
    );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
        height: '100%',
      },
    topBar: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    topBtn: {
        backgroundColor: '#5570CD',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    topBtnText: {
        color: 'white',
        fontSize: 14,
    },
    mainTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    centerBox: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingBottom: 20,
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
    },
    optionBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6, // 둥근 모서리로 체크박스를 스타일링
        transition: 'all 0.2s ease', // 애니메이션 효과 추가
        marginRight: 8,
    },
    checked: {
        borderColor: '#5570CD',
        backgroundColor: '#E5F1FF', // 체크박스가 선택되었을 때의 배경색
    },
    checkedBox: {
        width: 16,
        height: 16,
        backgroundColor: '#5570CD',
        borderRadius: 3,
    },
    checkboxLabel: {
        fontSize: 16,
    },
    container: {
        flex: 1, 
        backgroundColor: '#ffffff',
        width: '100%',
        position: 'relative',  // 추가: 자식 요소들의 위치를 기준으로 함
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginVertical: 10,
        padding: 8,
        fontSize: 18,
    },
    textArea: {
        height: 300,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        fontSize: 16,
        textAlignVertical: 'top',  // 텍스트가 상단에서 시작되도록 설정
    },
    photoUploadBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
    },
    photoButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    cameraIcon: {
        width: 30,
        height: 30,
    },
    contentsImgBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
        marginBottom: 10,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    imgCloseBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 5,
    },
    closeBtnText: {
        color: 'white',
    },
});

export default ContentUpload;
