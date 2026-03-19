package com.adotejabackend.AdoteJaBackend.dtos;

import java.time.LocalDate;

public record UpdateAdotanteDTO(
        String nome,
        String telefone1,
        String telefone2,
        String cpf,
        LocalDate dataNascimento,
        UpdateEnderecoDTO endereco
) {}
