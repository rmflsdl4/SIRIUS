package com.culiso.culiso.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        
        // 저장된 엔티티의 ID를 가져옴
        int contents_num = savedContent.getContents_num();
        
        // 저장된 파일 이름을 사용하여 파일 정보를 데이터베이스에 저장
        for (String uniqueFileName : savedFileNames) {
            String fileUrl = "images/" + uniqueFileName; // 클라이언트가 접근할 수 있는 URL 경로로 변환
            fileRepository.fileInsertHandle(fileUrl, uniqueFileName, user_id, contents_num);
        }
    }
}
