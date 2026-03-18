package com.adotejabackend.AdoteJaBackend.components;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.adotejabackend.AdoteJaBackend.models.Usuario;
import com.adotejabackend.AdoteJaBackend.models.UsuarioDetailsImpl;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import com.adotejabackend.AdoteJaBackend.services.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
            try {
                String subject = jwtTokenService.getSubjectFromToken(token);
                Usuario usuario = usuarioRepository.findByEmail(subject)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + subject));
                UsuarioDetailsImpl usuarioDetails = new UsuarioDetailsImpl(usuario);

                Authentication authentication =
                        new UsernamePasswordAuthenticationToken(usuarioDetails.getUsername(), null, usuarioDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JWTVerificationException | UsernameNotFoundException ex) {
                sendUnauthorized(response, ex.getMessage());
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\":401,\"message\":\"" + message + "\"}");
    }

    private String recoveryToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}
