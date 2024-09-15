import React, { useState, useRef, useEffect, useContext } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getChatResponse } from "../modules/OpenAI";
import axios from 'axios';
import UserDataContext from "../contexts/UserDataContext";
import Voice from '@react-native-voice/voice';
import { RecordCheck } from "../modules/PermissionUtil";

const TalkButton = ({ type, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <GetImage type={type} width={35} height={35} marginLeft={5} marginRight={5} />
        </TouchableOpacity>
    );
};

const Message = ({ text, isUser }) => {
    return (
        <View>
            {!isUser && (
                <View style={styles.culiProfile}>
                    <GetImage type={'Culi'} width={35} height={35} marginRight={10}/>
                    <Text style={styles.culiProfileText}>Culi</Text>
                </View>
            )}
            <View style={isUser ? styles.userMessageContainer : styles.culiMessageContainer}>
                <Text style={styles.message}>{text}</Text>
            </View>
        </View>
        
    );
};
const CuliTalk = ({ navigation }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const scrollViewRef = useRef(); // ScrollView에 대한 ref 생성
    const userContext = useContext(UserDataContext);
    const { user_id } = userContext;
    const [voiceText, setVoiceText] = useState("");
    const [isVoice, setIsVoice] = useState(false);

    useEffect(() => {
        GetMessages(); 
    }, [])

    useEffect(()=>{
        Voice.onSpeechStart = _onSpeechStart;
        Voice.onSpeechEnd = _onSpeechEnd;
        Voice.onSpeechResults = _onSpeechResults;
        Voice.onSpeechError = _onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, [])
    useEffect(() => {
        console.log(message);
        console.log(voiceText);
        if (message.trim()) {
          SendMessage();
        }
      }, [voiceText]);
    const GetMessages = async () => {
        const response = await axios.post('http://10.0.2.2:8080/user/getChatLog', { user_id: user_id }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })

        if(response.data){
            response.data.forEach(message => {
                setMessages(messages => [...messages, 
                    {
                        content: message.user_chat_context, 
                        role: message.sender_type === 'U' ? 'user' : 'assistant'
                    }
                ]);
            });
            console.log(response.data[0].sender_type);
        }
    }

    const SendMessage = async () => {
        console.log('uid: ', user_id);
        var requsetData = [];
        if (message.trim()) {
            try{
                const newUserMessage = { role: 'user', content: message };

                setMessages(messages => [...messages, newUserMessage]);
                setMessage('');

                const culiMessage = await getChatResponse(newUserMessage);
                const newCuliMessage = { role: 'assistant', content: culiMessage };
                
                setMessages(messages => [...messages, newCuliMessage]);

                
                requsetData = [
                    {...newUserMessage, user_id: user_id},
                    {...newCuliMessage, user_id: user_id},
                ];
                

                axios.post('http://10.0.2.2:8080/user/chatRecord', requsetData, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                })
                
                console.log(requsetData);
            }
            catch (err) {
                console.log(err);
            }
        }
    };

    const handleContentSizeChange = (contentWidth, contentHeight) => {
        setContentHeight(contentHeight);
        // 스크롤이 필요하면 자동으로 아래로 스크롤
        if (contentHeight > scrollHeight && scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    const handleLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setScrollHeight(height);
    };
    const VoiceMessage = async () => {
        RecordCheck();
        if(!isVoice){
            Voice.start('ko-KR');
        }
        else{
            Voice.stop();
        }
        setIsVoice(!isVoice);
    }
    const _onSpeechStart = () => {
        console.log('onSpeechStart');
        setMessage('');
    };
      const _onSpeechEnd = () => {
        console.log('onSpeechEnd');
    };
      const _onSpeechResults = (event) => {
        console.log('onSpeechResults');
        const newMessage = event.value[0];
        setMessage(newMessage);
        setVoiceText(newMessage);
    };
      const _onSpeechError = (event) => {
        console.log('_onSpeechError');
        console.log(event.error);
    };
    return (
        <Background>
            <View style={styles.messageListContainer} onLayout={handleLayout}>
                <ScrollView
                    contentContainerStyle={styles.messageList}
                    ref={scrollViewRef} // ScrollView에 ref 연결
                    onContentSizeChange={handleContentSizeChange} // 컨텐츠 크기 변경 시 호출
                >
                    {messages.map((msg, index) => (
                        <Message key={index} text={msg.content} isUser={msg.role === 'user'} />
                    ))}
                </ScrollView>
            </View>
            <View style={styles.sendContainer}>
                <TextInput
                    style={styles.inputText}
                    placeholder={'메세지를 입력하세요.'}
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={SendMessage}
                    blurOnSubmit={false}
                    multiline={true}
                />
                <View style={styles.img}>
                    <TalkButton type={'Voice'} onPress={VoiceMessage}/>
                    <TalkButton type={'SendBlue'} onPress={SendMessage} />
                </View>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    messageListContainer: {
        flex: 1,
        marginTop: 30,
        width: '95%',
        marginBottom: 75,
        borderColor: '#CCC',
        backgroundColor: 'none'
    },
    messageList: {
        flexGrow: 1,
        justifyContent: 'flex-start',
    },
    userMessageContainer: {
        padding: 10,
        margin: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        alignSelf: 'flex-end',
        maxWidth: '80%'
    },
    culiMessageContainer: {
        padding: 10,
        margin: 5,
        backgroundColor: '#bde5f9',
        borderRadius: 10,
        alignSelf: 'flex-start',
        maxWidth: '80%'
    },
    message: {

    },
    sendContainer: {
        width: '100%',
        height: 55,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#359EFF',
        backgroundColor: '#D7EAFF',
        position: 'absolute',
        bottom: 0
    },
    inputText: {
        marginLeft: 10,
        maxWidth:250,
        fontSize: 17,
        fontFamily: 'KCC-Hanbit',
    },
    img: {
        flexDirection: 'row',
        marginRight: 10
    },
    culiProfile: {
        justifyContent: 'left',
        alignItems: 'center',
        flexDirection: 'row',
    },
    culiProfileText: {
        fontSize: 17,
        color: 'white',
        fontFamily: 'Sejong hospital Bold',
    }
});

export default CuliTalk;
