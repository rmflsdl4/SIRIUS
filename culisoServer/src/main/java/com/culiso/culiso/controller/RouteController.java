package com.culiso.culiso.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.culiso.culiso.dto.BoardMenuDTO;
import com.culiso.culiso.dto.CombinedContentsResponseDTO;
import com.culiso.culiso.dto.CommentDTO;
import com.culiso.culiso.dto.ContentListFileDTO;
import com.culiso.culiso.dto.PostContentsControllerDTO;
import com.culiso.culiso.dto.UserProfileDTO;
import com.culiso.culiso.entity.BoardEntity;
import com.culiso.culiso.entity.CommentEntity;
import com.culiso.culiso.entity.ContentsEntity;
import com.culiso.culiso.entity.UserEntity;
import com.culiso.culiso.service.BoardService;
import com.culiso.culiso.service.CommentInsertService;
import com.culiso.culiso.service.ContentListService;
import com.culiso.culiso.service.PostContentsService;
import com.culiso.culiso.service.UserProfileService;
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

    
    // 커뮤니티 영역
    @Autowired
    private BoardService boardService;
    @Autowired
    private UserProfileService userProfileService;
    @Autowired
    private ContentListService contentListService;
    @Autowired
    private PostContentsService postContentsService;
    @Autowired
    private CommentInsertService commentInsertService;

    @PostMapping("/menuBarValue")
    public ResponseEntity<List<BoardMenuDTO>> menuBarValue() {
        System.out.println("메뉴 바 값을 가져오는 중...");
        List<BoardMenuDTO> boards = boardService.menuBarValue();

        if (!boards.isEmpty()) {
            System.out.println("성공적으로 " + boards.size() + "개의 메뉴 항목을 가져왔습니다.");
        } else {
            System.out.println("메뉴 항목을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(boards);
    }

    @PostMapping("/userProfileValue")
    public ResponseEntity<List<UserProfileDTO>> userProfileValue() {
        System.out.println("메뉴 바 값을 가져오는 중...");
        List<UserProfileDTO> userProfiles = userProfileService.userProfileValue();

        if (!userProfiles.isEmpty()) {
            System.out.println("성공적으로 " + userProfiles.size() + "개의 유저 프로필 항목을 가져왔습니다.");
        } else {
            System.out.println("유저 프로필 항목을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(userProfiles);
    }

    @PostMapping("/contentListValue")
    public ResponseEntity<List<ContentListFileDTO>> contentListValue(@RequestBody BoardEntity data) {
        int board_id = data.getBoard_id();

        System.out.println("메뉴 바 값을 가져오는 중...");
        System.out.println(board_id);
        List<ContentListFileDTO> contentList = contentListService.contentListValue(board_id);

        if (!contentList.isEmpty()) {
            System.out.println("성공적으로 " + contentList.size() + "개의 커뮤니티 컨텐츠 항목을 가져왔습니다.");
        } else {
            System.out.println("커뮤니티 컨텐츠 항목을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(contentList);
    }

    @PostMapping("/postContents")
    public ResponseEntity<CombinedContentsResponseDTO> postContents(@RequestBody ContentsEntity data) {
        System.out.println("컨텐츠 번호를 가져오는 중...");
        
        int contents_num = data.getContents_num();
        // String sessionUserID = user.getUser_id();
        String sessionUserID = "user1";

        System.out.println(contents_num);

        CombinedContentsResponseDTO postContents = postContentsService.postContents(contents_num, sessionUserID);

        if (postContents != null) {
            System.out.println("성공적으로 커뮤니티 컨텐츠 항목을 가져왔습니다.");
        } else {
            System.out.println("커뮤니티 컨텐츠 항목을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(postContents);
    }

    @PostMapping("/commentInsert")
    public ResponseEntity<List<CommentDTO>> commentInsert(@RequestBody CommentEntity data) {
        System.out.println("댓글 내용, 컨텐츠 번호를 가져오는 중...");

        String comment_content = data.getComment_content();
        int contents_num = data.getContents_num();
        String user_id = "user1";

        System.out.println("comment_content = " + comment_content + "      contents_num = " + contents_num);

        List<CommentDTO> comments = commentInsertService.commentInsert(comment_content, user_id, contents_num);

        if (comments != null) {
            System.out.println("성공적으로 댓글 내용들을 가져왔습니다.");
        } else {
            System.out.println("댓글 내용들을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(comments);
    }

}
