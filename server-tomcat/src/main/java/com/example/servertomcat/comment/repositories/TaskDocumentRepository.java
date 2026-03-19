package com.example.servertomcat.comment.repositories;

import com.example.servertomcat.comment.documents.TaskDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskDocumentRepository extends MongoRepository<TaskDocument, String> {
    Optional<TaskDocument> findByTaskId(String taskId);
    void deleteByTaskId(String taskId);
}
