package com.adotejabackend.AdoteJaBackend.dtos;

public record UpdatePetDTO(
        String nome,
        String descricao,
        String imagemUrl,
        Boolean disponivel,
        SaudeDTO saude,
        CaracteristicaDTO caracteristica
) {}
