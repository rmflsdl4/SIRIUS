package com.culiso.culiso.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.culiso.culiso.dto.FileDTO;
import com.culiso.culiso.dto.ModifiedContentDTO;
import com.culiso.culiso.dto.ModifiedContentsResponseDTO;
import com.culiso.culiso.entity.ContentsEntity;
import com.culiso.culiso.repository.ContentsRepository;
import com.culiso.culiso.repository.FileRepository;

import jakarta.transaction.Transactional;

@Service
public class ContentsService {
    @Autowired
    private ContentsRepository contentsRepository;
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private ImgService imgService;

    public int viewsCount(int contents_num, String user_id) {
        return contentsRepository.viewsCountHandle(contents_num);
    }

    public int contentsDelete(int contents_num) {
        return contentsRepository.contentsDeleteHandle(contents_num);
    }

    @Transactional
    public void contentsInsert(String title, String contents, int board_id, String user_id, List<String> savedFileNames) {
        // 새로운 컨텐츠 엔티티 생성
        ContentsEntity content = new ContentsEntity();
        content.setContents_title(title);
        content.setContent(contents);
        content.setBoard_id(board_id);
        content.setUser_id(user_id);

        // 현재 시간 설정
        content.setContents_date(LocalDateTime.now());

        // 엔티티 저장과 동시에 ID 가져오기
        ContentsEntity savedContent = contentsRepository.save(content);

        if (savedFileNames != null) {
            // 저장된 엔티티의 ID를 가져옴
            int contents_num = savedContent.getContents_num();
            
            // 저장된 파일 이름을 사용하여 파일 정보를 데이터베이스에 저장
            for (String file_name : savedFileNames) {
                String file_url = "images/" + user_id + "/"; // 클라이언트가 접근할 수 있는 URL 경로로 변환
                fileRepository.fileInsertHandle(file_url, file_name, user_id, contents_num);
            }
        }
    }


    public ModifiedContentsResponseDTO getContentsAndFiles(int contents_num) {
        ModifiedContentDTO contentsResult = contentsRepository.findContents(contents_num);
        List<FileDTO> fileResult = fileRepository.findFiles(contents_num);
    
        return new ModifiedContentsResponseDTO(contentsResult, fileResult);
    }    

    // 게시글 수정 서비스
    @Transactional
    public void updateContent(String title, String contents, int contents_num, List<String> saved_file_names, List<String> del_img_names, String user_id) throws IOException {

        // 1. 게시글 업데이트
        contentsRepository.modifiedContentHandle(title, contents, contents_num);

        // 2. 새롭게 업로드된 파일 처리
        if (saved_file_names != null && !saved_file_names.isEmpty()) {
            for (String file_name : saved_file_names) {
                String file_url = "images/" + user_id + "/";
                fileRepository.fileInsertHandle(file_url, file_name, user_id, contents_num);
            }
        }

        // 3. 삭제할 이미지 처리
        if (del_img_names != null && !del_img_names.isEmpty()) {
            fileRepository.fileDeleteHandle(del_img_names, contents_num);
            imgService.deleteImages(user_id, del_img_names);  // 실제 파일 삭제
        }
    }
}
