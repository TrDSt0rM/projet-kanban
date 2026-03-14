package com.example.servertomcat.dtos;

import lombok.Data;
import java.util.List;

@Data
public class BoardColumnDTO {
    private String id;
    private String name;
    private int order;
    private List<TaskDTO> tasks;
}
