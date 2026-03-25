package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.models.UsuarioDetailsImpl;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class JwtTokenService {

    @Value("${api.security.token.secret}")
    private String secretKey;

    @Value("${api.security.token.issuer}")
    private String issuer;

    @PostConstruct
    void validateSecret() {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("JWT secret (api.security.token.secret) não pode ser vazio. Defina a variável JWT_SECRET.");
        }
    }

    public String generateToken(UsuarioDetailsImpl usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.create()
                    .withIssuer(issuer)
                    .withIssuedAt(creationDate())
                    .withExpiresAt(expirationDate())
                    .withSubject(usuario.getUsername())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new JWTCreationException("Erro ao gerar token", exception);
        }
    }

    public String getSubjectFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new JWTVerificationException("Token inválido ou expirado.");
        }
    }

    private Instant creationDate() {
        return ZonedDateTime.now(ZoneId.of("America/Recife")).toInstant();
    }

    private Instant expirationDate() {
        return ZonedDateTime.now(ZoneId.of("America/Recife")).plusHours(2).toInstant();
    }
}
