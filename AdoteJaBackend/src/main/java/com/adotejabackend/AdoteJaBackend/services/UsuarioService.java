package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration;
import com.adotejabackend.AdoteJaBackend.dtos.CreateUsuarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.LoginUsuarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryJwtTokenDTO;
import com.adotejabackend.AdoteJaBackend.models.Role;
import com.adotejabackend.AdoteJaBackend.models.Usuario;
import com.adotejabackend.AdoteJaBackend.models.UsuarioDetailsImpl;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

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


        Usuario newUsuario = Usuario.builder()
                .email(createUsuarioDTO.email())
                .password(securityConfiguration.passwordEncoder().encode(createUsuarioDTO.password()))
                .roles(List.of(Role.builder().name(createUsuarioDTO.role()).build()))
                .build();

        usuarioRepository.save(newUsuario);
    }
}
