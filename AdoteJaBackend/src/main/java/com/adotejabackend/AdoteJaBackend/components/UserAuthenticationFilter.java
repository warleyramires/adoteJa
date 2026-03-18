package com.adotejabackend.AdoteJaBackend.components;

import com.adotejabackend.AdoteJaBackend.models.Usuario;
import com.adotejabackend.AdoteJaBackend.models.UsuarioDetailsImpl;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import com.adotejabackend.AdoteJaBackend.services.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class UserAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = recoveryToken(request);
        if (token != null) {
            String subject = jwtTokenService.getSubjectFromToken(token);
            Usuario usuario = usuarioRepository.findByEmail(subject)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + subject));
            UsuarioDetailsImpl usuarioDetails = new UsuarioDetailsImpl(usuario);

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(usuarioDetails.getUsername(), null, usuarioDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String recoveryToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }

}
