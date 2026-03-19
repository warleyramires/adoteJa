package com.adotejabackend.AdoteJaBackend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginUsuarioDTO(
        @NotBlank @Email String email,
        @NotBlank String password
) {}
