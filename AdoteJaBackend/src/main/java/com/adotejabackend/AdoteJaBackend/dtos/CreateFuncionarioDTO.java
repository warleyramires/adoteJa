package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.RoleName;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateFuncionarioDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
                message = "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um dígito")
        String password,
        @NotBlank String telefone1,
        String telefone2,
        @NotNull @Valid EnderecoDTO enderecoDTO,
        @NotBlank String matricula,
        @NotBlank String cargo,
        @NotNull RoleName role
) {}
