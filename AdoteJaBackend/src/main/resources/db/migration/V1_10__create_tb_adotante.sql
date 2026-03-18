CREATE TABLE tb_adotante (
    id             BIGINT PRIMARY KEY,
    cpf            VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    CONSTRAINT fk_adotante_usuario FOREIGN KEY (id) REFERENCES tb_users(id)
);
