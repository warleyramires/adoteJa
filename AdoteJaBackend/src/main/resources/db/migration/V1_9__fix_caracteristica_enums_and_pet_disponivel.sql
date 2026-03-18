-- Corrigir colunas de tb_caracteristica: trocar ENUM por VARCHAR
-- JPA com @Enumerated(EnumType.STRING) armazena o nome do enum (CAO, PEQUENO, MACHO)
ALTER TABLE tb_caracteristica
    MODIFY COLUMN especie VARCHAR(50) NOT NULL,
    MODIFY COLUMN porte   VARCHAR(50) NOT NULL,
    MODIFY COLUMN sexo    VARCHAR(50) NOT NULL;

-- Adicionar campo disponivel em tb_pet
ALTER TABLE tb_pet
    ADD COLUMN disponivel BOOLEAN NOT NULL DEFAULT TRUE;
