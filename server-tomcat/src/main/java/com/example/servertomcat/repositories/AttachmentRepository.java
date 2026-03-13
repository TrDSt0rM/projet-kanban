package com.example.servertomcat.repositories;

// import com.example.servertomcat.entities.Attachment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    List<Attachment> findByTaskId(Long taskId);
}
