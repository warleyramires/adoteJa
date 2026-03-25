package com.adotejabackend.AdoteJaBackend.repositories;

import com.adotejabackend.AdoteJaBackend.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByAdotanteId(Long adotanteId);
    boolean existsByAdotanteIdAndPetId(Long adotanteId, Long petId);
}
