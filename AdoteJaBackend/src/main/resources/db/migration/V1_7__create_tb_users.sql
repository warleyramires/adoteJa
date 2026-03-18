CREATE TABLE tb_users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    nome       VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    telefone1  VARCHAR(20),
    telefone2  VARCHAR(20)
);

ALTER TABLE tb_endereco
    ADD COLUMN usuario_id BIGINT,
    ADD CONSTRAINT fk_endereco_usuario FOREIGN KEY (usuario_id) REFERENCES tb_users(id);
