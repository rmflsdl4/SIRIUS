package com.culiso.culiso.service;

import com.culiso.culiso.dto.CommentDTO;
import com.culiso.culiso.repository.CommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository CommentRepository;

    public List<CommentDTO> commentInsert(String comment_content, String user_id, int contents_num) {

        CommentRepository.commentInsertHandle(comment_content, user_id, contents_num);

        return CommentRepository.commentSelectHandle(contents_num);
    }

    public List<CommentDTO> commentDelete(int comment_num, int contents_num) {

        CommentRepository.commentDeleteHandle(comment_num);

        return CommentRepository.commentSelectHandle(contents_num);
    }
}
