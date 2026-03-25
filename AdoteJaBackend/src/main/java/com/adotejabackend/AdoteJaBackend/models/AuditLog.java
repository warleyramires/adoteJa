package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_audit_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(length = 150)
    private String email;

    @Column(length = 500)
    private String details;

    @Column(length = 45)
    private String ip;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
