package com.adotejabackend.AdoteJaBackend.dtos;

import java.time.LocalDate;

public record RecoveryAdotanteDTO(
        Long id,
        String nome,
        String email,
        String telefone1,
        String telefone2,
        String cpf,
        LocalDate dataNascimento
) {}
