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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private S3Service s3Service;

    public RecoveryPetDTO create(CreatePetDTO dto, MultipartFile imagem) {
        String imagemUrl = uploadIfPresent(imagem);

        Pet pet = Pet.builder()
                .nome(dto.nome())
                .descricao(dto.descricao())
                .imagemUrl(imagemUrl)
                .disponivel(true)
                .saude(toSaudeEntity(dto.saude()))
                .caracteristica(toCaracteristicaEntity(dto.caracteristica()))
                .build();
        return toRecoveryDTO(petRepository.save(pet));
    }

    public Page<RecoveryPetDTO> findAll(Especie especie, Porte porte, Sexo sexo, Boolean disponivel, Pageable pageable) {
        return petRepository.findWithFilters(especie, porte, sexo, disponivel, pageable)
                .map(this::toRecoveryDTO);
    }

    public RecoveryPetDTO findById(Long id) {
        return toRecoveryDTO(petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado: " + id)));
    }

    public RecoveryPetDTO update(Long id, UpdatePetDTO dto, MultipartFile imagem) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado: " + id));

        if (dto.nome() != null) pet.setNome(dto.nome());
        if (dto.descricao() != null) pet.setDescricao(dto.descricao());
        if (dto.disponivel() != null) pet.setDisponivel(dto.disponivel());

        String novaUrl = uploadIfPresent(imagem);
        if (novaUrl != null) pet.setImagemUrl(novaUrl);

        if (dto.saude() != null && pet.getSaude() != null) {
            Saude s = pet.getSaude();
            if (dto.saude().vacinado() != null) s.setVacinado(dto.saude().vacinado());
            if (dto.saude().castrado() != null) s.setCastrado(dto.saude().castrado());
            if (dto.saude().vermifugado() != null) s.setVermifugado(dto.saude().vermifugado());
            if (dto.saude().historicoSaude() != null) s.setHistoricoSaude(dto.saude().historicoSaude());
        }

        if (dto.caracteristica() != null && pet.getCaracteristica() != null) {
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

    private String uploadIfPresent(MultipartFile imagem) {
        if (imagem == null || imagem.isEmpty()) return null;
        String contentType = imagem.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Tipo de arquivo inválido: apenas imagens são aceitas.");
        }
        try {
            return s3Service.uploadFile(imagem, "pets");
        } catch (IOException e) {
            throw new RuntimeException("Falha ao fazer upload da imagem: " + e.getMessage(), e);
        }
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
        SaudeDTO saudeDTO = pet.getSaude() == null ? null : new SaudeDTO(
                pet.getSaude().getVacinado(),
                pet.getSaude().getCastrado(),
                pet.getSaude().getVermifugado(),
                pet.getSaude().getHistoricoSaude()
        );
        CaracteristicaDTO caracDTO = pet.getCaracteristica() == null ? null : new CaracteristicaDTO(
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
