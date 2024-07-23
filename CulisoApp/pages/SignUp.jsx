import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { GetImage } from '../modules/ImageManager';
import Background from '../modules/Background';
import { SpeechBubbleMessage } from '../modules/Culi'
import * as Check from '../modules/Normalization'
import axios from 'axios';
import Postcode from "@actbase/react-daum-postcode";

const guideMessage = {
    0: "지금부터 회원가입을\n도와드릴게요 !",
    1: "먼저 아이디와 비밀번호를\n입력해 주세요 !",
    2: "이번에는 이름과 별명,\n그리고 성별을 선택해 주세요 !",
    3: "마지막으로 주소와 전화번호를\n입력하고 인증을 받아주세요 !",
    4: "회원가입이 완료되었습니다!\n다시 한 번 환영합니다 !",
    5: "로그인 화면으로 안내해 드릴게요 !\n잠시만 기다려주세요",
}

const TimeOut = (navigation) => {
    setTimeout(() => {
        navigation.navigate('Login');
    }, 2000);
}

const SignUp = ({ navigation }) => {
    const [showPostcode, setShowPostcode] = useState(false);
    const [index, setIndex] = useState(0);
    const [maleColor, setMaleColor] = useState("#EAE8E8");
    const [femaleColor, setFemaleColor] = useState("#EAE8E8");
    const [maleOpacity, setMaleOpacity] = useState(1);
    const [femaleOpacity, setFemaleOpacity] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const [form, setForm] = useState({
        user_id: "",
        user_pw: "",
        confirmPW: "",
        user_name: "",
        user_nick: "",
        sex: "",
        address: "",
        post: "",
        user_phone: "",
        detail_address: "",
    });
    const [check, setCheck] = useState({
        user_id: { message: "", color: "", state: false },
        user_pw: { message: "", color: "", state: false },
        confirmPW: { message: "", color: "", state: false },
        user_name: { message: "", color: "", state: false },
        user_nick: { message: "", color: "", state: false },
        sex: { message: "", color: "", state: false },
        address: { message: "", color: "", state: true },
        post: { message: "", color: "", state: true },
        user_phone: { message: "", color: "", state: true },
    });

    useEffect(() => {
        if(index == 1){
            if(check.user_id.state && check.user_pw.state && check.confirmPW.state){
                setDisabled(true);
            }
            else setDisabled(false);
        }
        else if(index == 2){
            if(check.user_name.state && check.user_nick.state && check.sex.state){
                
                setDisabled(true);
            }
            else setDisabled(false);
        }
        else if(index == 3){
            if(check.address.state && check.post.state && check.user_phone.state){
                setDisabled(true);
            }
            else setDisabled(false);
        }
    }, [form])

    useEffect(() => {
        if(form.confirmPW != ""){
            const { message, color, state } = Check.ConfirmPW(form.confirmPW);
            
            setCheck(prevCheck => ({
                ...prevCheck,
                ['confirmPW']: { message, color, state }
            }));
        }
    }, [form.user_pw])

    useEffect(() => {
        if(index == 5){
            TimeOut(navigation);
        }
    }, [index])

    const SignUpHandler = () => {
        console.log(form);

        axios.post('http://10.0.2.2:8080/user/signUp', form, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        .then((response) => {
            console.log(response.data);
            if(response.data){
                console.log("회원가입 성공");
            }
            else{
                console.log("회원가입 실패");
            }
        })
        .catch(err => console.log(err));
    }

    const UpdateForm = (field, value) => {
        setForm(prevForm => ({
            ...prevForm,
            [field]: value
        }));
    }
    const getAddressData = data => {
        let defaultAddress = ''; // 기본주소
        if (data.buildingName === 'N') {
            defaultAddress = data.apartment;
        } 
        else {
            defaultAddress = data.buildingName;
        }

        setForm(prevForm => ({
            ...prevForm,
            address: data.address + ' ' + defaultAddress,
            post: data.zonecode
        }));

        setShowPostcode(false);
    };

    
    const Input = ({type, placeholder, attribute, Normalization = null, inputType = 'default', readonly = false}) => {
        const [inputValue, setInputValue] = useState(form[attribute]);

        const HandleBlur = () => {
            UpdateForm(attribute, inputValue);
            if(Normalization != null){
                const { message, color, state } = Normalization(inputValue);
                setCheck(prevCheck => ({
                    ...prevCheck,
                    [attribute]: { message, color, state }
                }));
            }
        };

        return (
            <View>
                <View style={styles.input}>
                    <GetImage type={type} width={23} height={23} marginLeft={20}/>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder={placeholder} 
                        defaultValue={form[attribute]} 
                        onChangeText={setInputValue} 
                        onBlur={HandleBlur}
                        keyboardType={inputType}
                        secureTextEntry={type === 'SignUpPW'}
                        editable={!readonly}
                    />
                </View>
                {check[attribute].message !== "" && (
                    <View>
                        <Text style={[styles.message, {color: check[attribute].color}]}>{check[attribute].message}</Text>
                    </View>
                )}
            </View>
        );
    }
    const NonFormNext = () => {
        if(index == 0 || index == 4){
            setIndex(index + 1);
        }
        console.log(form.address);
    }
    const FormNext = () => {
        setIndex(disabled ? index + 1 : index);
        setDisabled(false);
        if(index == 3){
            setForm(prevForm => ({
                ...prevForm,
                address: `${form.address}, ${form.detail_address}`
            }));
            SignUpHandler();
        }
    }
    const Radio = ({Normalization}) => {
        const SexUpdate = (value) => {
            if(value == "M"){
                setMaleColor("#3FA2F6");
                setFemaleColor("#EAE8E8");
                setMaleOpacity(0.5);
                setFemaleOpacity(1);
            }
            else{
                setMaleColor("#EAE8E8");
                setFemaleColor("#E90074");
                setMaleOpacity(1);
                setFemaleOpacity(0.5);
            }
            setForm(prevForm => ({
                ...prevForm,
                sex: value
            }));
            const { message, color, state } = Normalization(value);
            setCheck(prevCheck => ({
                ...prevCheck,
                ['sex']: { message, color, state }
            }));
        }

        return (
            <View style={styles.radioContainer}>
                <TouchableOpacity style={[styles.male, {backgroundColor: maleColor, opacity: maleOpacity}]} onPress={() => SexUpdate('M')}>
                    <GetImage type={'SignUpMale'} width={23} height={23}/>
                    <Text>남자</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.female, {backgroundColor: femaleColor, opacity: femaleOpacity}]} onPress={() => SexUpdate('F')}>
                    <GetImage type={'SignUpFemale'} width={23} height={23}/>
                    <Text>여자</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const DetailAddressHandler = (value) => {
        setForm(prevForm => ({
            ...prevForm,
            detail_address: value
        }));
    }
    return (
        <Background>
            <TouchableOpacity style={styles.touchPanel} onPress={() => NonFormNext()} activeOpacity={1}>
                <SpeechBubbleMessage text={guideMessage[index]}/>
                <View style={styles.inputContainerCenter}>
                    { index == 1 && (
                        <View style={styles.inputContainer}>
                            <Input type={'SignUpID'} placeholder={"아이디"} attribute={"user_id"} Normalization={Check.ID}/>
                            <Input type={'SignUpPW'} placeholder={"비밀번호"} attribute={"user_pw"} Normalization={Check.PW}/>
                            <Input type={'SignUpPW'} placeholder={"비밀번호 확인"} attribute={"confirmPW"} Normalization={Check.ConfirmPW}/>
                        </View>
                    )}
                    
                    { index == 2 && (
                        <View style={styles.inputContainer}>
                            <Input type={'SignUpName'} placeholder={"이름"} attribute={"user_name"} Normalization={Check.Name}/>
                            <Input type={'SignUpName'} placeholder={"별명"} attribute={"user_nick"} Normalization={Check.NickName}/>
                            <Radio Normalization={Check.Sex}/>
                        </View>
                    )}
                    
                    { index == 3 && (
                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={() => setShowPostcode(true)}>
                                <Input type={'SignUpAddress'} placeholder={"주소 찾기"} attribute={"address"} readonly={true}/>
                            </TouchableOpacity>
                            <View style={styles.input}>
                                <GetImage type={'SignUpDetailAddress'} width={23} height={23} marginLeft={20}/>
                                <TextInput 
                                    style={styles.textInput} 
                                    placeholder={'상세 주소'}
                                    onChangeText={DetailAddressHandler}
                                />
                            </View>
                            <Input type={'SignUpPhone'} placeholder={"전화번호"} attribute={"user_phone"} inputType="numeric"/>
                        </View>
                    )}
                    { (index === 1 || index === 2 || index === 3) && (
                        <TouchableOpacity 
                            style={[styles.nextButton, {opacity: disabled ? 1 : 0.5}]} 
                            onPress={()=>FormNext()}
                        ><Text style={styles.nextButtonText}>다음으로</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
            
            {showPostcode && (
                <View style={styles.postcodeContainer}>
                    <Postcode
                        style={styles.postcode}
                        jsOptions={{ animation: true }}
                        onSelected={getAddressData}
                    />
                </View>
            )}
        </Background>
    );
};
const styles = StyleSheet.create({
    touchPanel: {
        width: "100%",
        height: "100%",
    },
    inputContainerCenter:{
        marginTop: 100,
        alignItems: 'center',
    },
    inputContainer: {
        height: 'auto',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        alignItems: 'left',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        width: 285,
        height: 55,
        backgroundColor: "#EAE8E8",
        justifyContent: 'left',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    textInput: {
        color: "#A5A3A3",
        fontFamily: 'KCC-Hanbit',
        marginLeft: 10,
        width: 210,
    },
    message: {
        textAlign: "left",
        fontFamily: 'KCC-Hanbit',
        fontSize: 10
    },
    nextButton: {
        marginTop: 20,
        backgroundColor: "#4B93FF",
        color: "#FFFFFF",
        width: 325,
        height: 55,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontFamily: 'Sejong hospital Bold',
    },
    postcodeContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 999,
    },
    postcode: {
        flex: 1,
        width: '100%',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'space-around',
    },
    male: {
        width: 140,
        height: 55,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    },
    female: {
        width: 140,
        height: 55,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
    }
});

export default SignUp;
