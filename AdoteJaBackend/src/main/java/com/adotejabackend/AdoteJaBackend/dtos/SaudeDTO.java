package com.adotejabackend.AdoteJaBackend.dtos;

public record SaudeDTO(
        Boolean vacinado,
        Boolean castrado,
        Boolean vermifugado,
        String historicoSaude
) {}
