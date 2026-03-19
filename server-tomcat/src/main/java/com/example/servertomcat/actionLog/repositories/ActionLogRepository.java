package com.example.servertomcat.actionLog.repositories;

import com.example.servertomcat.actionLog.entities.ActionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActionLogRepository extends JpaRepository<ActionLog, Long> {

    Page<ActionLog> findByTargetIdAndTargetTypeOrderByDatetimeDesc(
            String targetId, String targetType, Pageable pageable);
}
