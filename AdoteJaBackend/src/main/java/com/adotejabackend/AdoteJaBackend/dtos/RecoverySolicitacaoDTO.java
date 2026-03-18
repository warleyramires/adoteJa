package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.StatusSolicitacao;

import java.time.LocalDateTime;

public record RecoverySolicitacaoDTO(
        Long id,
        Long adotanteId,
        String nomeAdotante,
        Long petId,
        String nomePet,
        StatusSolicitacao status,
        LocalDateTime dataSolicitacao,
        LocalDateTime dataResposta,
        String observacao
) {}
