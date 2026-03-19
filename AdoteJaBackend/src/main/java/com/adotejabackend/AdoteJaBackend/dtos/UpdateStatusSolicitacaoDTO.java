package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.StatusSolicitacao;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusSolicitacaoDTO(
        @NotNull StatusSolicitacao status,
        String observacao
) {}
