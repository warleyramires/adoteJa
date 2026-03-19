package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration;
import com.adotejabackend.AdoteJaBackend.dtos.CreateUsuarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.EnderecoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.MeResponseDTO;
import com.adotejabackend.AdoteJaBackend.enums.RoleName;
import com.adotejabackend.AdoteJaBackend.models.Role;
import com.adotejabackend.AdoteJaBackend.models.Usuario;
import com.adotejabackend.AdoteJaBackend.repositories.RoleRepository;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private SecurityConfiguration securityConfiguration;
    @Mock private JwtTokenService jwtTokenService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private UsuarioService usuarioService;

    private CreateUsuarioDTO buildCreateDto(String email) {
        EnderecoDTO endereco = new EnderecoDTO("Rua A", "10", "Centro", "São Paulo", "SP", "01310-100");
        return new CreateUsuarioDTO("João", email, "senha123", RoleName.ROLE_CUSTOMER,
                "11999999999", null, endereco);
    }

    @Test
    void createUsuario_emailNovo_salvaComSucesso() {
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        when(securityConfiguration.passwordEncoder()).thenReturn(encoder);
        when(encoder.encode(anyString())).thenReturn("hashed");
        when(usuarioRepository.findByEmail("novo@test.com")).thenReturn(Optional.empty());

        Role role = Role.builder().name(RoleName.ROLE_CUSTOMER).build();
        when(roleRepository.findByName(RoleName.ROLE_CUSTOMER)).thenReturn(Optional.of(role));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(new Usuario());

        assertThatCode(() -> usuarioService.createUsuario(buildCreateDto("novo@test.com")))
                .doesNotThrowAnyException();
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void createUsuario_emailDuplicado_lancaRuntimeException() {
        when(usuarioRepository.findByEmail("existente@test.com"))
                .thenReturn(Optional.of(new Usuario()));

        assertThatThrownBy(() -> usuarioService.createUsuario(buildCreateDto("existente@test.com")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("E-mail já cadastrado");
    }

    @Test
    void getMe_usuarioExistente_retornaDTO() {
        Role role = Role.builder().name(RoleName.ROLE_CUSTOMER).build();
        Usuario usuario = Usuario.builder()
                .id(1L).nome("João").email("joao@test.com")
                .roles(List.of(role)).build();
        when(usuarioRepository.findByEmail("joao@test.com")).thenReturn(Optional.of(usuario));

        MeResponseDTO result = usuarioService.getMe("joao@test.com");

        assertThat(result.nome()).isEqualTo("João");
        assertThat(result.email()).isEqualTo("joao@test.com");
        assertThat(result.role()).isEqualTo("ROLE_CUSTOMER");
    }

    @Test
    void getMe_usuarioInexistente_lancaResponseStatusException() {
        when(usuarioRepository.findByEmail("nao@existe.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.getMe("nao@existe.com"))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }
}
