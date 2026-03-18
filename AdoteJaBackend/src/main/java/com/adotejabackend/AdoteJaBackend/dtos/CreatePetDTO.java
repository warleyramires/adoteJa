package com.adotejabackend.AdoteJaBackend.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePetDTO(
        @NotBlank String nome,
        String descricao,
        String imagemUrl,
        @NotNull @Valid SaudeDTO saude,
        @NotNull @Valid CaracteristicaDTO caracteristica
) {}
