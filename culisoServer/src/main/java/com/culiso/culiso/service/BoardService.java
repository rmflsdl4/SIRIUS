package com.culiso.culiso.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.entity.BoardEntity;
import com.culiso.culiso.repository.BoardRepository;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public List<BoardEntity> menuBarValue() {
        return boardRepository.boardMenuHandler();
    }
}
