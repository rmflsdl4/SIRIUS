package com.culiso.culiso.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.dto.UserInformationDTO;
import com.culiso.culiso.entity.UserEntity;
import com.culiso.culiso.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<Long> login(String id, String pw){
        return userRepository.loginHandler(id, pw);
    }
    public int signUp(String id, String pw, String name, String phone, String post, String address, String sex, String nickName){
        return userRepository.signUpHandler(id, pw, name, phone, post, address, sex, nickName);
    }
    public UserInformationDTO getInformation(String id){
        return userRepository.getInformationHandler(id);
    }
}
