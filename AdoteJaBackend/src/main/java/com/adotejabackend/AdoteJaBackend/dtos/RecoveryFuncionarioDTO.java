package com.adotejabackend.AdoteJaBackend.dtos;

public record RecoveryFuncionarioDTO(
        Long id,
        String nome,
        String email,
        String telefone1,
        String telefone2,
        String matricula,
        String cargo
) {}
