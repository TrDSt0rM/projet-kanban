package com.example.servertomcat.comment;

import com.example.servertomcat.comment.dtos.*;

import java.util.List;

public interface CommentService {
    List<CommentDto> getComments(String taskId, String pseudo);
    CommentDto addComment(String taskId, CommentCreateDto dto, String pseudo);
    CommentDto updateComment(String taskId, String commentId, CommentUpdateDto dto, String pseudo);
    void deleteComment(String taskId, String commentId, String pseudo);
    CommentDto addAttachmentToComment(String taskId, String commentId, AttachmentCreateDto dto, String pseudo);
    void deleteAttachmentFromComment(String taskId, String commentId, String fileId, String pseudo);
    List<AttachmentDto> getTaskAttachments(String taskId, String pseudo);
    AttachmentDto addTaskAttachment(String taskId, AttachmentCreateDto dto, String pseudo);
    void deleteTaskAttachment(String taskId, String fileId, String pseudo);
}