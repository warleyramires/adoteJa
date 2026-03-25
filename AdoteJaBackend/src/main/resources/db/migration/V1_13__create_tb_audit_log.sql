CREATE TABLE tb_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    details VARCHAR(500),
    ip VARCHAR(45),
    timestamp DATETIME NOT NULL
);
