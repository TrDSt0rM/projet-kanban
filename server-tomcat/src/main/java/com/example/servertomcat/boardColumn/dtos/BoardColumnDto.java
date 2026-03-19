package com.example.servertomcat.boardColumn.dtos;

import com.example.servertomcat.task.dtos.TaskSummaryDto;
import lombok.Data;
import java.util.List;

@Data

public class BoardColumnDto {
    private String idColumn;
    private String columnName;
    private int position;
    private List<TaskSummaryDto> tasks;
}
