package com.adotejabackend.AdoteJaBackend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EnderecoDTO(
        @NotBlank @Size(max = 200) String logradouro,
        @Size(max = 20) String numero,
        @Size(max = 100) String bairro,
        @NotBlank @Size(max = 100) String cidade,
        @NotBlank @Size(max = 2) String estado,
        @NotBlank @Size(max = 9) String cep
) {}
