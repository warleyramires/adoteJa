package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.RoleName;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateFuncionarioDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotBlank String telefone1,
        String telefone2,
        @NotNull @Valid EnderecoDTO enderecoDTO,
        @NotBlank String matricula,
        @NotBlank String cargo,
        @NotNull RoleName role
) {}
