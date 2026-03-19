package com.adotejabackend.AdoteJaBackend.dtos;

public record RecoveryPetDTO(
        Long id,
        String nome,
        String descricao,
        String imagemUrl,
        Boolean disponivel,
        SaudeDTO saude,
        CaracteristicaDTO caracteristica
) {}
