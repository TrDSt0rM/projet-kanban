package com.example.servertomcat.repositories;

// import com.example.servertomcat.repositories.entities.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTaskId(Long taskId);
}
