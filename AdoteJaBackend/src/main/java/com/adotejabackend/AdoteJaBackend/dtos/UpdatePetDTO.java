package com.adotejabackend.AdoteJaBackend.dtos;

public record UpdatePetDTO(
        String nome,
        String descricao,
        Boolean disponivel,
        SaudeDTO saude,
        CaracteristicaDTO caracteristica
) {}
