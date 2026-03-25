package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.dtos.CreateSolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoverySolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateStatusSolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.enums.Especie;
import com.adotejabackend.AdoteJaBackend.enums.Porte;
import com.adotejabackend.AdoteJaBackend.enums.Sexo;
import com.adotejabackend.AdoteJaBackend.enums.StatusSolicitacao;
import com.adotejabackend.AdoteJaBackend.models.*;
import com.adotejabackend.AdoteJaBackend.repositories.AdotanteRepository;
import com.adotejabackend.AdoteJaBackend.repositories.PetRepository;
import com.adotejabackend.AdoteJaBackend.repositories.SolicitacaoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import org.mockito.ArgumentCaptor;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitacaoServiceTest {

    @Mock private SolicitacaoRepository solicitacaoRepository;
    @Mock private AdotanteRepository adotanteRepository;
    @Mock private PetRepository petRepository;
    @Mock private AuditService auditService;

    @InjectMocks
    private SolicitacaoService solicitacaoService;

    private Adotante adotante;
    private Pet pet;
    private Solicitacao solicitacao;

    @BeforeEach
    void setUp() {
        Authentication auth = mock(Authentication.class);
        lenient().when(auth.getName()).thenReturn("adotante@test.com");
        SecurityContext ctx = mock(SecurityContext.class);
        lenient().when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);

        adotante = new Adotante();
        adotante.setId(1L);
        adotante.setNome("João");
        adotante.setEmail("adotante@test.com");

        Caracteristica carac = Caracteristica.builder()
                .especie(Especie.CAO).porte(Porte.MEDIO).sexo(Sexo.MACHO).build();
        pet = Pet.builder().id(10L).nome("Rex").disponivel(true).caracteristica(carac).build();

        solicitacao = new Solicitacao();
        solicitacao.setId(100L);
        solicitacao.setAdotante(adotante);
        solicitacao.setPet(pet);
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void create_petDisponivel_criaSolicitacaoComStatusPendente() {
        when(adotanteRepository.findByEmail("adotante@test.com")).thenReturn(Optional.of(adotante));
        when(petRepository.findById(10L)).thenReturn(Optional.of(pet));
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenReturn(solicitacao);

        solicitacaoService.create(new CreateSolicitacaoDTO(10L, null));

        ArgumentCaptor<Solicitacao> captor = ArgumentCaptor.forClass(Solicitacao.class);
        verify(solicitacaoRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(StatusSolicitacao.PENDENTE);
        assertThat(captor.getValue().getPet().getId()).isEqualTo(10L);
        assertThat(captor.getValue().getAdotante().getId()).isEqualTo(1L);
    }

    @Test
    void create_petIndisponivel_lancaRuntimeException() {
        pet.setDisponivel(false);
        when(adotanteRepository.findByEmail("adotante@test.com")).thenReturn(Optional.of(adotante));
        when(petRepository.findById(10L)).thenReturn(Optional.of(pet));

        assertThatThrownBy(() -> solicitacaoService.create(new CreateSolicitacaoDTO(10L, null)))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("não está disponível");
    }

    @Test
    void create_adotanteNaoEncontrado_lancaEntityNotFoundException() {
        when(adotanteRepository.findByEmail("adotante@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> solicitacaoService.create(new CreateSolicitacaoDTO(10L, null)))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Adotante não encontrado");
    }

    @Test
    void findMinhas_retornaListaDoAdotanteLogado() {
        when(adotanteRepository.findByEmail("adotante@test.com")).thenReturn(Optional.of(adotante));
        when(solicitacaoRepository.findByAdotanteId(1L)).thenReturn(List.of(solicitacao));

        List<RecoverySolicitacaoDTO> result = solicitacaoService.findMinhas();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).nomeAdotante()).isEqualTo("João");
    }

    @Test
    void updateStatus_aprovado_marcaPetComoIndisponivel() {
        when(solicitacaoRepository.findById(100L)).thenReturn(Optional.of(solicitacao));
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenReturn(solicitacao);

        solicitacaoService.updateStatus(100L, new UpdateStatusSolicitacaoDTO(StatusSolicitacao.APROVADO, null));

        assertThat(pet.getDisponivel()).isFalse();
        verify(petRepository).save(pet);
    }

    @Test
    void updateStatus_rejeitado_naoAlteraPet() {
        when(solicitacaoRepository.findById(100L)).thenReturn(Optional.of(solicitacao));
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenReturn(solicitacao);

        solicitacaoService.updateStatus(100L, new UpdateStatusSolicitacaoDTO(StatusSolicitacao.REJEITADO, null));

        assertThat(pet.getDisponivel()).isTrue();
        verify(petRepository, never()).save(pet);
    }

    @Test
    void updateStatus_solicitacaoInexistente_lancaEntityNotFoundException() {
        when(solicitacaoRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> solicitacaoService.updateStatus(999L,
                new UpdateStatusSolicitacaoDTO(StatusSolicitacao.APROVADO, null)))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void updateStatus_registraAuditLog() {
        when(solicitacaoRepository.findById(100L)).thenReturn(Optional.of(solicitacao));
        when(solicitacaoRepository.save(any(Solicitacao.class))).thenReturn(solicitacao);

        solicitacaoService.updateStatus(100L, new UpdateStatusSolicitacaoDTO(StatusSolicitacao.APROVADO, null));

        verify(auditService).log(eq("STATUS_CHANGE"), eq("adotante@test.com"),
                contains("Solicitação #100"));
    }
}
