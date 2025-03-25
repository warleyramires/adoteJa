CREATE TABLE tb_saude(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vacinado BOOLEAN NOT NULL,
    castrado BOOLEAN NOT NULL,
    vermifugado BOOLEAN NOT NULL,
    historico_saude VARCHAR(255)
);