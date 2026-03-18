package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.dtos.*;
import com.adotejabackend.AdoteJaBackend.enums.Especie;
import com.adotejabackend.AdoteJaBackend.enums.Porte;
import com.adotejabackend.AdoteJaBackend.enums.Sexo;
import com.adotejabackend.AdoteJaBackend.models.Caracteristica;
import com.adotejabackend.AdoteJaBackend.models.Pet;
import com.adotejabackend.AdoteJaBackend.models.Saude;
import com.adotejabackend.AdoteJaBackend.repositories.PetRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    public RecoveryPetDTO create(CreatePetDTO dto) {
        Pet pet = Pet.builder()
                .nome(dto.nome())
                .descricao(dto.descricao())
                .imagemUrl(dto.imagemUrl())
                .disponivel(true)
                .saude(toSaudeEntity(dto.saude()))
                .caracteristica(toCaracteristicaEntity(dto.caracteristica()))
                .build();
        return toRecoveryDTO(petRepository.save(pet));
    }

    public List<RecoveryPetDTO> findAll(Especie especie, Porte porte, Sexo sexo, Boolean disponivel) {
        return petRepository.findWithFilters(especie, porte, sexo, disponivel)
                .stream().map(this::toRecoveryDTO).toList();
    }

    public RecoveryPetDTO findById(Long id) {
        return toRecoveryDTO(petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado: " + id)));
    }

    public RecoveryPetDTO update(Long id, UpdatePetDTO dto) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado: " + id));

        if (dto.nome() != null) pet.setNome(dto.nome());
        if (dto.descricao() != null) pet.setDescricao(dto.descricao());
        if (dto.imagemUrl() != null) pet.setImagemUrl(dto.imagemUrl());
        if (dto.disponivel() != null) pet.setDisponivel(dto.disponivel());

        if (dto.saude() != null) {
            Saude s = pet.getSaude();
            if (dto.saude().vacinado() != null) s.setVacinado(dto.saude().vacinado());
            if (dto.saude().castrado() != null) s.setCastrado(dto.saude().castrado());
            if (dto.saude().vermifugado() != null) s.setVermifugado(dto.saude().vermifugado());
            if (dto.saude().historicoSaude() != null) s.setHistoricoSaude(dto.saude().historicoSaude());
        }

        if (dto.caracteristica() != null) {
            Caracteristica c = pet.getCaracteristica();
            if (dto.caracteristica().raca() != null) c.setRaca(dto.caracteristica().raca());
            if (dto.caracteristica().cor() != null) c.setCor(dto.caracteristica().cor());
            if (dto.caracteristica().especie() != null) c.setEspecie(dto.caracteristica().especie());
            if (dto.caracteristica().porte() != null) c.setPorte(dto.caracteristica().porte());
            if (dto.caracteristica().sexo() != null) c.setSexo(dto.caracteristica().sexo());
        }

        return toRecoveryDTO(petRepository.save(pet));
    }

    public void delete(Long id) {
        if (!petRepository.existsById(id)) {
            throw new EntityNotFoundException("Pet não encontrado: " + id);
        }
        petRepository.deleteById(id);
    }

    private Saude toSaudeEntity(SaudeDTO dto) {
        return Saude.builder()
                .vacinado(dto.vacinado())
                .castrado(dto.castrado())
                .vermifugado(dto.vermifugado())
                .historicoSaude(dto.historicoSaude())
                .build();
    }

    private Caracteristica toCaracteristicaEntity(CaracteristicaDTO dto) {
        return Caracteristica.builder()
                .raca(dto.raca())
                .cor(dto.cor())
                .especie(dto.especie())
                .porte(dto.porte())
                .sexo(dto.sexo())
                .build();
    }

    private RecoveryPetDTO toRecoveryDTO(Pet pet) {
        SaudeDTO saudeDTO = new SaudeDTO(
                pet.getSaude().getVacinado(),
                pet.getSaude().getCastrado(),
                pet.getSaude().getVermifugado(),
                pet.getSaude().getHistoricoSaude()
        );
        CaracteristicaDTO caracDTO = new CaracteristicaDTO(
                pet.getCaracteristica().getRaca(),
                pet.getCaracteristica().getCor(),
                pet.getCaracteristica().getEspecie(),
                pet.getCaracteristica().getPorte(),
                pet.getCaracteristica().getSexo()
        );
        return new RecoveryPetDTO(
                pet.getId(), pet.getNome(), pet.getDescricao(),
                pet.getImagemUrl(), pet.getDisponivel(), saudeDTO, caracDTO
        );
    }
}
