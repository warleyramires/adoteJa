package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.RoleName;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateUsuarioDTO(
        @NotBlank @Size(max = 100) String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres") String password,
        @NotNull RoleName role,
        @NotBlank String telefone1,
        String telefone2,
        @NotNull @Valid EnderecoDTO enderecoDTO
) {}
