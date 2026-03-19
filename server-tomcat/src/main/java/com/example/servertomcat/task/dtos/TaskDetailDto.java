package com.example.servertomcat.task.dtos;

import com.example.servertomcat.comment.dtos.AttachmentDto;
import com.example.servertomcat.comment.dtos.CommentDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TaskDetailDto extends TaskSummaryDto{
    private List<CommentDto> comments = new ArrayList<>();
    private List<AttachmentDto> taskAttachments = new ArrayList<>();
}
