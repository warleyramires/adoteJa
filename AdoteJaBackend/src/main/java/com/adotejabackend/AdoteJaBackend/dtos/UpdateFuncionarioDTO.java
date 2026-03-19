package com.adotejabackend.AdoteJaBackend.dtos;

public record UpdateFuncionarioDTO(
        String nome,
        String telefone1,
        String telefone2,
        String matricula,
        String cargo,
        UpdateEnderecoDTO endereco
) {}
