ALTER TABLE tb_caracteristica
    MODIFY COLUMN especie ENUM('Cachorro', 'Gato', 'Outro') NOT NULL,
    MODIFY COLUMN porte ENUM('Pequeno', 'Médio', 'Grande') NOT NULL,
    MODIFY COLUMN sexo ENUM('Macho', 'Fêmea') NOT NULL;
