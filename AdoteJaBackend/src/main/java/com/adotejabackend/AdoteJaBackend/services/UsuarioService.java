package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration;
import com.adotejabackend.AdoteJaBackend.dtos.CreateUsuarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.EnderecoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.LoginUsuarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryJwtTokenDTO;
import com.adotejabackend.AdoteJaBackend.models.Endereco;
import com.adotejabackend.AdoteJaBackend.models.Usuario;
import com.adotejabackend.AdoteJaBackend.models.UsuarioDetailsImpl;
import com.adotejabackend.AdoteJaBackend.repositories.RoleRepository;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SecurityConfiguration securityConfiguration;

    public RecoveryJwtTokenDTO authenticateUsuario(LoginUsuarioDTO loginUsuarioDTO) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(loginUsuarioDTO.email(), loginUsuarioDTO.password());
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        UsuarioDetailsImpl usuarioDetails = (UsuarioDetailsImpl) authentication.getPrincipal();

        return new RecoveryJwtTokenDTO(jwtTokenService.generateToken(usuarioDetails));
    }

    public void createUsuario(CreateUsuarioDTO createUsuarioDTO) {

        Optional<Usuario> usuario = usuarioRepository.findByEmail(createUsuarioDTO.email());

        if (usuario.isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Endereco endereco = convertEnderecoDTOToEntity(createUsuarioDTO.enderecoDTO());

        Usuario newUsuario = Usuario.builder()
                .nome(createUsuarioDTO.nome())
                .email(createUsuarioDTO.email())
                .password(securityConfiguration.passwordEncoder().encode(createUsuarioDTO.password()))
                .roles(List.of(roleRepository.findByName(createUsuarioDTO.role())
                        .orElseThrow(() -> new RuntimeException("Role não encontrada: " + createUsuarioDTO.role()))))
                .telefone1(createUsuarioDTO.telefone1())
                .telefone2(createUsuarioDTO.telefone2())
                .endereco(endereco)
                .build();

        endereco.setUsuario(newUsuario);
        usuarioRepository.save(newUsuario);
    }

    private Endereco convertEnderecoDTOToEntity(EnderecoDTO dto) {
        Endereco endereco = new Endereco();
        endereco.setCep(dto.cep());
        endereco.setEstado(dto.estado());
        endereco.setCidade(dto.cidade());
        endereco.setBairro(dto.bairro());
        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        return endereco;
    }

}
