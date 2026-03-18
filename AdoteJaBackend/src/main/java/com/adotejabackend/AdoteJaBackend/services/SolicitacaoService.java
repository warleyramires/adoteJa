package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.dtos.CreateSolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoverySolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateStatusSolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.enums.StatusSolicitacao;
import com.adotejabackend.AdoteJaBackend.models.Adotante;
import com.adotejabackend.AdoteJaBackend.models.Pet;
import com.adotejabackend.AdoteJaBackend.models.Solicitacao;
import com.adotejabackend.AdoteJaBackend.repositories.AdotanteRepository;
import com.adotejabackend.AdoteJaBackend.repositories.PetRepository;
import com.adotejabackend.AdoteJaBackend.repositories.SolicitacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private PetRepository petRepository;

    public RecoverySolicitacaoDTO create(CreateSolicitacaoDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Adotante adotante = adotanteRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Adotante não encontrado para o usuário logado"));

        Pet pet = petRepository.findById(dto.petId())
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado: " + dto.petId()));

        if (!pet.getDisponivel()) {
            throw new RuntimeException("Pet não está disponível para adoção.");
        }

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setAdotante(adotante);
        solicitacao.setPet(pet);
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);
        solicitacao.setDataSolicitacao(LocalDateTime.now());
        solicitacao.setObservacao(dto.observacao());

        return toRecoveryDTO(solicitacaoRepository.save(solicitacao));
    }

    public List<RecoverySolicitacaoDTO> findAll() {
        return solicitacaoRepository.findAll().stream().map(this::toRecoveryDTO).toList();
    }

    public List<RecoverySolicitacaoDTO> findMinhas() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Adotante adotante = adotanteRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Adotante não encontrado para o usuário logado"));
        return solicitacaoRepository.findByAdotanteId(adotante.getId())
                .stream().map(this::toRecoveryDTO).toList();
    }

    public RecoverySolicitacaoDTO updateStatus(Long id, UpdateStatusSolicitacaoDTO dto) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada: " + id));

        solicitacao.setStatus(dto.status());
        solicitacao.setDataResposta(LocalDateTime.now());
        if (dto.observacao() != null) solicitacao.setObservacao(dto.observacao());

        if (dto.status() == StatusSolicitacao.APROVADO) {
            solicitacao.getPet().setDisponivel(false);
            petRepository.save(solicitacao.getPet());
        }

        return toRecoveryDTO(solicitacaoRepository.save(solicitacao));
    }

    private RecoverySolicitacaoDTO toRecoveryDTO(Solicitacao s) {
        return new RecoverySolicitacaoDTO(
                s.getId(),
                s.getAdotante().getId(),
                s.getAdotante().getNome(),
                s.getPet().getId(),
                s.getPet().getNome(),
                s.getStatus(),
                s.getDataSolicitacao(),
                s.getDataResposta(),
                s.getObservacao()
        );
    }
}
