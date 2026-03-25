package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.models.AuditLog;
import com.adotejabackend.AdoteJaBackend.repositories.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String action, String email, String details) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .action(action)
                    .email(email)
                    .details(details)
                    .timestamp(LocalDateTime.now())
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Falha ao salvar audit log: action={}, email={}", action, email, e);
        }
    }
}
