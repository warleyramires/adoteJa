CREATE TABLE tb_funcionario (
    id        BIGINT PRIMARY KEY,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    cargo     VARCHAR(100) NOT NULL,
    CONSTRAINT fk_funcionario_usuario FOREIGN KEY (id) REFERENCES tb_users(id)
);
