var temp = "";
export const ID = (value) =>{
    const regex = /^[a-zA-Z0-9]{5,12}$/;

    if(regex.test(value) /*데이터베이스에 아이디가 존재하는지도 검증해야됨*/){
        return {message: "사용 가능한 아이디입니다.", color: "#3aec4b", state: true};
    }
    else{
        return {message: "아이디는 5-12자의 영문/숫자로 입력해주세요.", color: "#ec6060", state: false}
    }
}
export const PW = (value) =>{
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,30}$/;
    temp = value;

    if(regex.test(value)){
        return {message: "사용 가능한 비밀번호입니다.", color: "#3aec4b", state: true};
    }
    else{
        return {message: "비밀번호는 10-30자로 영문/숫자/특수문자를 하나 이상 포함해주세요.", color: "#ec6060", state: false}
    }
}
export const ConfirmPW = (value) =>{
    if(value == temp){
        return {message: "비밀번호가 일치합니다.", color: "#3aec4b", state: true};
    }
    else{
        return {message: "비밀번호가 일치하지 않습니다.", color: "#ec6060", state: false}
    }
}
export const Name = (value) =>{
    const regex = /^[a-zA-Z가-힣]{2,20}$/;

    if(regex.test(value)){
        return {message: "사용 가능한 이름입니다.", color: "#3aec4b", state: true};
    }
    else{
        return {message: "이름은 2-20자의 영문/한글로 입력해주세요.", color: "#ec6060", state: false}
    }
}
export const NickName = (value) =>{
    const regex = /^[a-zA-Z0-9가-힣]{2,20}$/;

    if(regex.test(value)){
        return {message: "사용 가능한 별명입니다.", color: "#3aec4b", state: true};
    }
    else{
        return {message: "별명은 2-20자의 영문/숫자/한글로 입력해주세요.", color: "#ec6060", state: false}
    }
}
export const Sex = (value) =>{
    if(value !== ""){
        return {message: "", color: "", state: true};
    }
}