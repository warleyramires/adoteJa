package com.adotejabackend.AdoteJaBackend.dtos;

public record UpdateEnderecoDTO(
        String logradouro,
        String numero,
        String bairro,
        String cidade,
        String estado,
        String cep
) {}
