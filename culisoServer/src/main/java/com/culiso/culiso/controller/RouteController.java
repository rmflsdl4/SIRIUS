package com.culiso.culiso.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.culiso.culiso.entity.UserEntity;
import com.culiso.culiso.service.UserService;

import lombok.val;

//@Controller // file을 응답하는 컨트롤러 (클라이언트가 브라우저면 .html 파일을)
@RestController // data를 응답하는 컨트롤러 (클라이언트가 휴대폰이면 data)
@RequestMapping("/user")
public class RouteController {
    @Autowired
    private UserService userService;


    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@RequestBody UserEntity data){
        System.out.println(data);
        String id = data.getUser_id();
        String pw = data.getUser_pw();

        System.out.println("Received id: " + id);
        System.out.println("Received pw: " + pw);

        Optional<Long> userOptional = userService.login(id, pw);
        System.out.println(userOptional);
        if(userOptional.isPresent()){
            Long value = userOptional.get();
            if(value > 0){
                return ResponseEntity.ok(true);
            }
            else{
                return ResponseEntity.ok(false);
            }
        }
        else{
            return ResponseEntity.ok(false);
        }
       
    }

    @PostMapping("/signUp")
    public ResponseEntity<Boolean> SignUp(@RequestBody UserEntity data){
        String id = data.getUser_id();
        String pw = data.getUser_pw();
        String name = data.getUser_name();
        String phone = data.getUser_phone();
        String post = data.getPost();
        String address = data.getAddress();
        String sex = data.getSex();
        String nickName = data.getUser_nick();

        System.out.println(id);
        System.out.println(pw);
        System.out.println(name);
        System.out.println(phone);
        System.out.println(post);
        System.out.println(address);
        System.out.println(sex);
        System.out.println(nickName);

        int result = userService.signUp(id, pw, name, phone, post, address, sex, nickName);
        if(result > 0){
            return ResponseEntity.ok(true);
        }
        else{
            return ResponseEntity.ok(false);
        }
    }
}

