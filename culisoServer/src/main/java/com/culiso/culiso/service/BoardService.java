package com.culiso.culiso.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.culiso.culiso.dto.BoardMenuDTO;
import com.culiso.culiso.repository.BoardRepository;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public List<BoardMenuDTO> menuBarValue() {
        return boardRepository.boardMenuHandler();
    }

    public List<BoardMenuDTO> CheckBoard() {
        return boardRepository.checkBoardHandler();
    }
}
