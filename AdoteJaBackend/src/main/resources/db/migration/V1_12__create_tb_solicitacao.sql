CREATE TABLE tb_solicitacao (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    adotante_id       BIGINT NOT NULL,
    pet_id            BIGINT NOT NULL,
    status            VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data_solicitacao  DATETIME NOT NULL,
    data_resposta     DATETIME,
    observacao        TEXT,
    CONSTRAINT fk_solicitacao_adotante FOREIGN KEY (adotante_id) REFERENCES tb_adotante(id),
    CONSTRAINT fk_solicitacao_pet      FOREIGN KEY (pet_id)      REFERENCES tb_pet(id)
);
