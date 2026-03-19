package com.adotejabackend.AdoteJaBackend.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateAdotanteDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotBlank String telefone1,
        String telefone2,
        @NotNull @Valid EnderecoDTO enderecoDTO,
        @NotBlank String cpf,
        @NotNull LocalDate dataNascimento
) {}
