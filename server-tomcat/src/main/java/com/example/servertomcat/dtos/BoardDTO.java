package com.example.servertomcat.dtos;

import lombok.Data;
import java.util.List;

@Data
public class BoardDTO {
    private String id;
    private String name;
    private String ownerPseudo;
    private List<BoardColumnDTO> columns;
}
