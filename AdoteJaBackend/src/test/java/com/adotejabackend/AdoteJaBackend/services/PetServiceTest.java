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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository petRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private PetService petService;

    private CreatePetDTO createDto;
    private Pet savedPet;

    @BeforeEach
    void setUp() {
        SaudeDTO saudeDTO = new SaudeDTO(true, false, true, null);
        CaracteristicaDTO caracDTO = new CaracteristicaDTO("SRD", "Caramelo", Especie.CAO, Porte.MEDIO, Sexo.MACHO);
        createDto = new CreatePetDTO("Rex", "Cão amigável", saudeDTO, caracDTO);

        Saude saude = Saude.builder().vacinado(true).castrado(false).vermifugado(true).build();
        Caracteristica carac = Caracteristica.builder()
                .raca("SRD").cor("Caramelo").especie(Especie.CAO).porte(Porte.MEDIO).sexo(Sexo.MACHO).build();
        savedPet = Pet.builder()
                .id(1L).nome("Rex").descricao("Cão amigável")
                .imagemUrl(null).disponivel(true).saude(saude).caracteristica(carac).build();
    }

    @Test
    void create_semImagem_salvaPetComImagemUrlNull() {
        when(petRepository.save(any(Pet.class))).thenReturn(savedPet);

        RecoveryPetDTO result = petService.create(createDto, null);

        assertThat(result.nome()).isEqualTo("Rex");
        assertThat(result.imagemUrl()).isNull();
        verify(s3Service, never()).uploadFile(any(), any());
    }

    @Test
    void create_comImagemValida_chamS3EsalvaPetComUrl() {
        MultipartFile imagem = mock(MultipartFile.class);
        when(imagem.isEmpty()).thenReturn(false);
        when(imagem.getContentType()).thenReturn("image/jpeg");
        when(s3Service.uploadFile(imagem, "pets")).thenReturn("https://s3/pets/rex.jpg");

        Pet petComUrl = Pet.builder()
                .id(1L).nome("Rex").descricao("Cão amigável")
                .imagemUrl("https://s3/pets/rex.jpg").disponivel(true)
                .saude(savedPet.getSaude()).caracteristica(savedPet.getCaracteristica()).build();
        when(petRepository.save(any(Pet.class))).thenReturn(petComUrl);

        RecoveryPetDTO result = petService.create(createDto, imagem);

        assertThat(result.imagemUrl()).isEqualTo("https://s3/pets/rex.jpg");
        verify(s3Service).uploadFile(imagem, "pets");
    }

    @Test
    void create_comImagemInvalida_lancaIllegalArgumentException() {
        MultipartFile imagem = mock(MultipartFile.class);
        when(imagem.isEmpty()).thenReturn(false);
        when(imagem.getContentType()).thenReturn("application/pdf");

        assertThatThrownBy(() -> petService.create(createDto, imagem))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Tipo de arquivo inválido");
    }

    @Test
    void findById_petExistente_retornaDTO() {
        when(petRepository.findById(1L)).thenReturn(Optional.of(savedPet));

        RecoveryPetDTO result = petService.findById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.nome()).isEqualTo("Rex");
    }

    @Test
    void findById_petInexistente_lancaEntityNotFoundException() {
        when(petRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> petService.findById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void update_camposParciais_atualizaApenasOsEnviados() {
        when(petRepository.findById(1L)).thenReturn(Optional.of(savedPet));
        when(petRepository.save(any(Pet.class))).thenReturn(savedPet);

        UpdatePetDTO dto = new UpdatePetDTO("NovoNome", null, null, null, null);
        RecoveryPetDTO result = petService.update(1L, dto, null);

        assertThat(result.nome()).isEqualTo("NovoNome");
        assertThat(result.descricao()).isEqualTo("Cão amigável");
    }

    @Test
    void update_comNovaImagem_fazUploadEAtualiza() {
        when(petRepository.findById(1L)).thenReturn(Optional.of(savedPet));
        when(petRepository.save(any(Pet.class))).thenReturn(savedPet);

        MultipartFile imagem = mock(MultipartFile.class);
        when(imagem.isEmpty()).thenReturn(false);
        when(imagem.getContentType()).thenReturn("image/png");
        when(s3Service.uploadFile(imagem, "pets")).thenReturn("https://s3/pets/nova.png");

        UpdatePetDTO dto = new UpdatePetDTO(null, null, null, null, null);
        petService.update(1L, dto, imagem);

        assertThat(savedPet.getImagemUrl()).isEqualTo("https://s3/pets/nova.png");
    }

    @Test
    void update_petInexistente_lancaEntityNotFoundException() {
        when(petRepository.findById(99L)).thenReturn(Optional.empty());

        UpdatePetDTO dto = new UpdatePetDTO("Nome", null, null, null, null);
        assertThatThrownBy(() -> petService.update(99L, dto, null))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void delete_petExistente_deletaComSucesso() {
        when(petRepository.existsById(1L)).thenReturn(true);

        petService.delete(1L);

        verify(petRepository).deleteById(1L);
    }

    @Test
    void delete_petInexistente_lancaEntityNotFoundException() {
        when(petRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> petService.delete(99L))
                .isInstanceOf(EntityNotFoundException.class);
        verify(petRepository, never()).deleteById(any());
    }

    @Test
    void create_imagemMaiorQue5MB_lancaIllegalArgumentException() {
        MultipartFile imagem = mock(MultipartFile.class);
        when(imagem.isEmpty()).thenReturn(false);
        when(imagem.getSize()).thenReturn(6L * 1024 * 1024); // 6 MB

        CreatePetDTO dto = new CreatePetDTO("Rex", null,
                new SaudeDTO(true, true, true, null),
                new CaracteristicaDTO(null, null, Especie.CAO, Porte.MEDIO, Sexo.MACHO));

        assertThatThrownBy(() -> petService.create(dto, imagem))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("5 MB");
    }
}
