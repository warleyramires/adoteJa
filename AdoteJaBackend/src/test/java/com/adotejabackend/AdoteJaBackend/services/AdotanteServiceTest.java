package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration;
import com.adotejabackend.AdoteJaBackend.dtos.CreateAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.dtos.EnderecoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.models.Adotante;
import com.adotejabackend.AdoteJaBackend.repositories.AdotanteRepository;
import com.adotejabackend.AdoteJaBackend.repositories.RoleRepository;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdotanteServiceTest {

    @InjectMocks private AdotanteService adotanteService;
    @Mock private AdotanteRepository adotanteRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private SecurityConfiguration securityConfiguration;
    @Mock private AuditService auditService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void mockAuth(String email, String role) {
        Authentication auth = new UsernamePasswordAuthenticationToken(
                email, null, List.of(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private Adotante adotanteComEmail(Long id, String email) {
        Adotante a = new Adotante();
        a.setId(id);
        a.setEmail(email);
        a.setNome("Test");
        return a;
    }

    @Test
    void findById_dono_retornaDTO() {
        mockAuth("dono@email.com", "ROLE_CUSTOMER");
        when(adotanteRepository.findById(1L))
                .thenReturn(Optional.of(adotanteComEmail(1L, "dono@email.com")));

        RecoveryAdotanteDTO result = adotanteService.findById(1L);

        assertThat(result.id()).isEqualTo(1L);
    }

    @Test
    void findById_outroUsuario_lancaAccessDeniedException() {
        mockAuth("invasor@email.com", "ROLE_CUSTOMER");
        when(adotanteRepository.findById(1L))
                .thenReturn(Optional.of(adotanteComEmail(1L, "dono@email.com")));

        assertThatThrownBy(() -> adotanteService.findById(1L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void findById_admin_bypassOwnership() {
        mockAuth("admin@email.com", "ROLE_ADMINISTRATOR");
        when(adotanteRepository.findById(1L))
                .thenReturn(Optional.of(adotanteComEmail(1L, "outro@email.com")));

        RecoveryAdotanteDTO result = adotanteService.findById(1L);
        assertThat(result).isNotNull();
    }

    @Test
    void findById_member_bypassOwnership() {
        mockAuth("func@email.com", "ROLE_MEMBER");
        when(adotanteRepository.findById(1L))
                .thenReturn(Optional.of(adotanteComEmail(1L, "outro@email.com")));

        RecoveryAdotanteDTO result = adotanteService.findById(1L);
        assertThat(result).isNotNull();
    }

    @Test
    void findById_semAutenticacao_lancaAccessDeniedException() {
        // No auth set — SecurityContextHolder returns null authentication
        SecurityContextHolder.clearContext();
        when(adotanteRepository.findById(1L))
                .thenReturn(Optional.of(adotanteComEmail(1L, "dono@email.com")));

        assertThatThrownBy(() -> adotanteService.findById(1L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void update_outroUsuario_lancaAccessDeniedException() {
        mockAuth("invasor@email.com", "ROLE_CUSTOMER");
        when(adotanteRepository.findById(1L))
                .thenReturn(Optional.of(adotanteComEmail(1L, "dono@email.com")));

        UpdateAdotanteDTO dto = new UpdateAdotanteDTO(null, null, null, null, null, null);

        assertThatThrownBy(() -> adotanteService.update(1L, dto))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void create_menorDe18_lancaIllegalArgumentException() {
        LocalDate nascimento17anos = LocalDate.now().minusYears(17);
        EnderecoDTO endereco = new EnderecoDTO("Rua A", "10", "Centro", "Cidade", "SP", "01000-000");
        CreateAdotanteDTO dto = new CreateAdotanteDTO(
                "Menor", "menor@email.com", "Senha123", "11999999999",
                null, endereco, "12345678900", nascimento17anos);

        assertThatThrownBy(() -> adotanteService.create(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("mínimo 18 anos");
    }
}
