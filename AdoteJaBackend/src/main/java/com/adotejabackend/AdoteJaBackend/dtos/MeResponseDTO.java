package com.adotejabackend.AdoteJaBackend.dtos;

public record MeResponseDTO(
    Long id,
    String nome,
    String email,
    String role
) {}
