package com.example.servertomcat.boardColumn.dtos;

import com.example.servertomcat.task.dtos.TaskDto;
import lombok.Data;
import java.util.List;

@Data

public class BoardColumnDto {
    private String idColumn;
    private String columnName;
    private int position;
    private List<TaskDto> tasks;
}
