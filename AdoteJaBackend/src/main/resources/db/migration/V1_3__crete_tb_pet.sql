CREATE TABLE tb_pet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    image_url VARCHAR(255),
    caracteristica_id BIGINT UNIQUE,
    saude_id BIGINT UNIQUE,
    CONSTRAINT fk_pet_caracteristica FOREIGN KEY (caracteristica_id) REFERENCES tb_caracteristica(id) ON DELETE CASCADE,
    CONSTRAINT fk_pet_saude FOREIGN KEY (saude_id) REFERENCES tb_saude(id) ON DELETE CASCADE
);