package com.adotejabackend.AdoteJaBackend.dtos;

import java.time.LocalDateTime;

public record ErrorResponseDTO(
        int status,
        String message,
        LocalDateTime timestamp
) {}
