package com.adotejabackend.AdoteJaBackend.dtos;

import jakarta.validation.constraints.NotNull;

public record CreateSolicitacaoDTO(
        @NotNull Long petId,
        String observacao
) {}
