package com.culiso.culiso.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.culiso.culiso.dto.BoardMenuDTO;
import com.culiso.culiso.dto.CombinedContentsResponseDTO;
import com.culiso.culiso.dto.CommentDTO;
import com.culiso.culiso.dto.ContentListFileDTO;
import com.culiso.culiso.dto.MessageDTO;
import com.culiso.culiso.dto.MessagesDTO;
import com.culiso.culiso.dto.ModifiedContentsResponseDTO;
import com.culiso.culiso.dto.PostContentsControllerDTO;
import com.culiso.culiso.dto.RecommendRequestDTO;
import com.culiso.culiso.dto.UserInformationDTO;
import com.culiso.culiso.dto.UserProfileDTO;
import com.culiso.culiso.entity.BoardEntity;
import com.culiso.culiso.entity.CommentEntity;
import com.culiso.culiso.entity.ContentsEntity;
import com.culiso.culiso.entity.UserEntity;
import com.culiso.culiso.service.BoardService;
import com.culiso.culiso.service.ChatService;
import com.culiso.culiso.service.CommentService;
import com.culiso.culiso.service.ContentListService;
import com.culiso.culiso.service.ContentsService;
import com.culiso.culiso.service.ImgService;
import com.culiso.culiso.service.PostContentsService;
import com.culiso.culiso.service.RecommendClickedService;
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
    @PostMapping("/info")
    @ResponseBody
    public UserInformationDTO GetInformation(@RequestBody UserEntity data){
        String id = data.getUser_id();
        
        UserInformationDTO info = userService.getInformation(id);

        return info;
    }


    @Autowired
    private ChatService chatService;

    @PostMapping("/getChatLog")
    @ResponseBody
    public List<MessagesDTO> ChatLog(@RequestBody Map<String, String> requestBody){
        String user_id = requestBody.get("user_id");
        return chatService.getChatLog(user_id);
    }

    @PostMapping("/chatRecord")
    @ResponseBody
    public void ChatRecord(@RequestBody List<MessageDTO> data){
        for (MessageDTO message : data) {
            if(message.getRole().equals("user")) {
                message.setRole("U");
            }
            else message.setRole("A");

            System.out.println("User: " + message.getUser_id() + "Role: " + message.getRole() + ", Content: " + message.getContent());
            chatService.chatRecord(message.getUser_id(), message.getRole(), message.getContent());
        }
    }
    
    
    // 커뮤니티 영역
    @Autowired
    private ContentsService contentsService;
    @Autowired
    private BoardService boardService;
    @Autowired
    private UserProfileService userProfileService;
    @Autowired
    private ContentListService contentListService;
    @Autowired
    private PostContentsService postContentsService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private RecommendClickedService recommendClickedService;
    @Autowired
    private ImgService imgService;

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

        List<CommentDTO> comments = commentService.commentInsert(comment_content, user_id, contents_num);

        if (comments != null) {
            System.out.println("성공적으로 댓글 내용들을 가져왔습니다.");
        } else {
            System.out.println("댓글 내용들을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(comments);
    }

    @PostMapping("/commentDelete")
    public ResponseEntity<List<CommentDTO>> commentDelete(@RequestBody CommentEntity data) {
        System.out.println("댓글 내용, 컨텐츠 번호를 가져오는 중...");

        int comment_num = data.getComment_num();
        int contents_num = data.getContents_num();

        System.out.println("comment_num = " + comment_num + "      contents_num = " + contents_num);

        List<CommentDTO> comments = commentService.commentDelete(comment_num, contents_num);

        if (comments != null) {
            System.out.println("성공적으로 댓글 내용들을 가져왔습니다.");
        } else {
            System.out.println("댓글 내용들을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(comments);
    }

    @PostMapping("/contentsDelete")
    public ResponseEntity<Boolean> contentsDelete(@RequestBody ContentsEntity data) {
        System.out.println("댓글 내용, 컨텐츠 번호를 가져오는 중...");
        
        int contents_num = data.getContents_num();

        System.out.println("contents_num = " + contents_num);

        int result = contentsService.contentsDelete(contents_num);

        if(result > 0){
            return ResponseEntity.ok(true);
        }
        else{
            return ResponseEntity.ok(false);
        }
    }

    @PostMapping("/recommendClicked")
    public ResponseEntity<Integer> recommendClicked(@RequestBody RecommendRequestDTO data) {
        System.out.println("댓글 내용, 컨텐츠 번호를 가져오는 중...");
        
        int check = data.getCheck();
        int contents_num = data.getContents_num();
        String user_id = "user1";

        System.out.println("check = " + check);
        System.out.println("contents_num = " + contents_num);

        int recommend = recommendClickedService.recommendClicked(check, contents_num, user_id);

        return ResponseEntity.ok(recommend);
    }

    @PostMapping("/viewsCount")
    public ResponseEntity<Boolean> viewsCount(@RequestBody ContentsEntity data) {
        System.out.println("댓글 내용, 컨텐츠 번호를 가져오는 중...");
        
        int contents_num = data.getContents_num();
        String user_id = "user1";

        System.out.println("contents_num = " + contents_num);

        int result = contentsService.viewsCount(contents_num, user_id);

        if(result > 0){
            return ResponseEntity.ok(true);
        }
        else{
            return ResponseEntity.ok(false);
        }
    }

    @PostMapping("/CheckBoard")
    public ResponseEntity<List<BoardMenuDTO>> CheckBoard() {
        System.out.println("게시판 체크박스 목록 값을 가져오는 중...");
        List<BoardMenuDTO> checkBoard = boardService.CheckBoard();

        if (!checkBoard.isEmpty()) {
            System.out.println("성공적으로 " + checkBoard.size() + "개의 체크박스 항목을 가져왔습니다.");
        } else {
            System.out.println("체크박스 항목을 찾을 수 없습니다.");
        }

        return ResponseEntity.ok(checkBoard);
    }

    // 게시글 생성하기
    @PostMapping("/ContentsInsert")
    public ResponseEntity<?> insertContent(
        @RequestParam("title") String title, 
        @RequestParam("contents") String contents, 
        @RequestParam("board_id") int board_id, 
        @RequestParam(value = "images", required = false) List<MultipartFile> images) {
            
        System.out.println("컨텐츠 추가 중...");

        String user_id = "user1";
        List<String> savedFileNames = null;

        try {
            // images 리스트가 비어 있지 않을 경우에만 이미지 저장 실행
            if (images != null && !images.isEmpty()) {
                savedFileNames = imgService.saveImages(user_id, images);
            }
            contentsService.contentsInsert(title, contents, board_id, user_id, savedFileNames);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("파일 저장 중 오류가 발생했습니다.");
        }

        return ResponseEntity.ok("게시글이 성공적으로 생성되었습니다.");
    }

    // 게시글 수정하기
    @PostMapping("/ContentsUpdate")
    public ResponseEntity<?> updateContent(
            @RequestParam("title") String title, 
            @RequestParam("contents") String contents, 
            @RequestParam("contents_num") int contents_num, 
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "del_img_names", required = false) List<String> del_img_names) {

        System.out.println("컨텐츠 수정 중...");

        String user_id = "user1";  
        List<String> saved_file_names = null;

        try {
            // images 리스트가 비어 있지 않을 경우에만 이미지 저장 실행
            if (images != null && !images.isEmpty()) {
                saved_file_names = imgService.saveImages(user_id, images);
            }

            contentsService.updateContent(title, contents, contents_num, saved_file_names, del_img_names, user_id);
            return ResponseEntity.ok("게시글이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("게시글 수정 중 오류가 발생했습니다.");
        }
    }

    // 게시글 수정 전 게시글 제목, 내용, 파일 가져오기
    @PostMapping(value = "/PrevBoardContentsValue", produces = "application/json")
    public ResponseEntity<ModifiedContentsResponseDTO> PrevBoardContentsValue(@RequestBody ContentsEntity data) {
        int contents_num = data.getContents_num();

        System.out.println("contents_num : " + contents_num);
        ModifiedContentsResponseDTO boardContentsValue = contentsService.getContentsAndFiles(contents_num);

        if (boardContentsValue != null) {
            System.out.println("성공적으로 컨텐츠 내용을 가져왔습니다.");
            return ResponseEntity.ok(boardContentsValue);
        } else {
            System.out.println("컨텐츠 내용을 찾을 수 없습니다.");
            return ResponseEntity.notFound().build();
        }
    }

}
