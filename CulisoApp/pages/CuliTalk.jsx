import React, { useState, useRef, useEffect, useContext } from "react";
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { getChatResponse } from "../modules/OpenAI";
import axios from 'axios';
import UserDataContext from "../contexts/UserDataContext";
import Voice from '@react-native-voice/voice';
import { RecordCheck } from "../modules/PermissionUtil";
import BluetoothContext from "../contexts/BluetoothContext";
import BLEController from "../modules/BLEController";
import DevicesData from "../modules/DevicesData";
import ENDPOINT from "../modules/Endpoint";
import Tts from 'react-native-tts'
import CuliContext from "../contexts/CuliContext";

const DetectLanguage = (text) => {
    const koreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanPattern.test(text) ? 'ko-KR' : 'en-US';
};

// 텍스트를 음성으로 출력하는 함수
const SpeakText = (text) => {
    console.log("현재 보이스 메시지: " + text);
    const language = DetectLanguage(text); // 언어 감지
    Tts.setDefaultLanguage(language); // 감지된 언어로 설정
    Tts.setDefaultPitch(1.0); // 음성 톤 설정
    Tts.speak(text); // 텍스트를 음성으로 출력
};


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
    const [ttsText, setTtsText] = useState("");
    const { characteristic, setCharacteristic } = useContext(BluetoothContext);
    const culiContext = useContext(CuliContext);
    const { isTts, isAutoVoice, setCuliValues } = culiContext;

    const TtsHandler = async () => {
        await Tts.stop();
        setCuliValues({ isTts: !isTts });
    } 
    const AutoVoiceHandler = () => {
        setCuliValues({ isAutoVoice: !isAutoVoice });
    }


    useEffect(() => {
        GetMessages();
        return () => {
            Tts.stop();
        }
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
    useEffect(() => {
        // const tempText = messages[messages.length - 1].content ;
    }, [messages]);
    const GetMessages = async () => {
        const response = await axios.post(ENDPOINT + 'user/getChatLog', { user_id: user_id }, {
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
            console.log(response.data[response.data.length - 1].user_chat_context);
            setTtsText(response.data[response.data.length - 1].user_chat_context);
        }
    }

    const SendMessage = async () => {
        console.log('uid: ', user_id);
        var requsetData = [];
        if (message.trim()) {
            try{
                const newUserMessage = { role: 'user', content: message };

                const bleCMD = TextToFormat(newUserMessage.content);
                
                if(bleCMD) {
                    try {
                        await BLEController(bleCMD, characteristic);
                        console.log(`Command '${bleCMD}' sent successfully to`);
                    } catch (error) {
                        console.error(`Failed to send command '${bleCMD}' to :`, error);
                    }
                } 
                

                setMessages(messages => [...messages, newUserMessage]);
                setMessage('');

                let culiMessage = '';
                if(bleCMD === null) {
                    culiMessage = await getChatResponse(newUserMessage);
                }
                setTtsText(culiMessage);
                if(isAutoVoice) SpeakText(culiMessage);
                const newCuliMessage = { role: 'assistant', content: culiMessage };
                
                setMessages(messages => [...messages, newCuliMessage]);
                console.log(culiMessage);
                
                requsetData = [
                    {...newUserMessage, user_id: user_id},
                    {...newCuliMessage, user_id: user_id},
                ];
                

                axios.post(ENDPOINT + 'user/chatRecord', requsetData, {
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

    const TextToFormat = (msg) => {
        // 공백 제거하고 소문자로 변환
        const str = msg.replace(/\s+/g, '').toLowerCase();

        switch(str) {
            case "침실조명켜줘":
                const bedroomDeviceOn = DevicesData.find(device => device.name === '침실 조명');
                if (bedroomDeviceOn && bedroomDeviceOn.flag === true) return;
                if (bedroomDeviceOn) bedroomDeviceOn.flag = true;
                return 'f';
    
            case "침실조명꺼줘":
                const bedroomDeviceOff = DevicesData.find(device => device.name === '침실 조명');
                if (bedroomDeviceOff && bedroomDeviceOff.flag === false) return;
                if (bedroomDeviceOff) bedroomDeviceOff.flag = false;
                return 'f';
    
            case "거실조명켜줘":
                const livingRoomDeviceOn = DevicesData.find(device => device.name === '거실 조명');
                if (livingRoomDeviceOn && livingRoomDeviceOn.flag === true) return;
                if (livingRoomDeviceOn) livingRoomDeviceOn.flag = true;
                return 'b';
    
            case "거실조명꺼줘":
                const livingRoomDeviceOff = DevicesData.find(device => device.name === '거실 조명');
                if (livingRoomDeviceOff && livingRoomDeviceOff.flag === false) return;
                if (livingRoomDeviceOff) livingRoomDeviceOff.flag = false;
                return 'b';
    
            case "에어컨켜줘":
                const airConditionerDeviceOn = DevicesData.find(device => device.name === '에어컨');
                if (airConditionerDeviceOn && airConditionerDeviceOn.flag === true) return;
                if (airConditionerDeviceOn) airConditionerDeviceOn.flag = true;
                return 'g';
    
            case "에어컨꺼줘":
                const airConditionerDeviceOff = DevicesData.find(device => device.name === '에어컨');
                if (airConditionerDeviceOff && airConditionerDeviceOff.flag === false) return;
                if (airConditionerDeviceOff) airConditionerDeviceOff.flag = false;
                return 'g';
    
            case "커튼켜줘":
                const curtainDeviceOn = DevicesData.find(device => device.name === '커튼');
                if (curtainDeviceOn && curtainDeviceOn.flag === true) return;
                if (curtainDeviceOn) curtainDeviceOn.flag = true;
                return 'i';
    
            case "커튼꺼줘":
                const curtainDeviceOff = DevicesData.find(device => device.name === '커튼');
                if (curtainDeviceOff && curtainDeviceOff.flag === false) return;
                if (curtainDeviceOff) curtainDeviceOff.flag = false;
                return 'i';
    
            case "tv켜줘":
            case "티비켜줘":
                const tvDeviceOn = DevicesData.find(device => device.name === 'TV');
                if (tvDeviceOn && tvDeviceOn.flag === true) return;
                if (tvDeviceOn) tvDeviceOn.flag = true;
                return 'h';
    
            case "tv꺼줘":
            case "티비꺼줘":
                const tvDeviceOff = DevicesData.find(device => device.name === 'TV');
                if (tvDeviceOff && tvDeviceOff.flag === false) return;
                if (tvDeviceOff) tvDeviceOff.flag = false;
                return 'h';
    
            default:
                return null;
        }
    }

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
        setCuliValues({ isTts: !isTts });
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
    const SpeakTextHandler = (ttsText) => {
        if(isTts) SpeakText(ttsText)
    }
    const VolumeUpHandler = () => {
        if(isAutoVoice) SpeakTextHandler(ttsText);
    };
    return (
        <Background>
            <View style={styles.messageListContainer} onLayout={handleLayout}>
                <View style={styles.topMenu}>
                    <View style={isAutoVoice ? styles.autoVoiceOnSetImg : styles.autoVoiceOffSetImg}>
                        <TalkButton type={'LetterA'} onPress={AutoVoiceHandler}/>
                    </View>
                    <View style={styles.voiceSetImg}>
                        {isTts ?
                            <TalkButton type={'VolumeUp'} onPress={TtsHandler}/>
                            :
                            <TalkButton type={'VolumeDown'} onPress={TtsHandler}/>
                        }
                    </View>
                </View>
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
                    <TalkButton type={'RepeatSound'} onPress={VolumeUpHandler}/>
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
        marginTop: 10,
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
    topMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    voiceSetImg: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 2,
    },
    autoVoiceOnSetImg: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 2,
    },
    autoVoiceOffSetImg: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 2,
        opacity: 0.5
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
