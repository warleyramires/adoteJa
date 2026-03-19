package com.adotejabackend.AdoteJaBackend.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreatePetDTO(
        @NotBlank @Size(max = 100) String nome,
        @Size(max = 1000) String descricao,
        @NotNull @Valid SaudeDTO saude,
        @NotNull @Valid CaracteristicaDTO caracteristica
) {}
