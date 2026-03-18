package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.RoleName;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateUsuarioDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotNull RoleName role,
        @NotBlank String telefone1,
        String telefone2,
        @NotNull @Valid EnderecoDTO enderecoDTO
) {}
