package com.adotejabackend.AdoteJaBackend.dtos;

public record CreateAdotanteDTO(
        String email,
        String telefone1,
        String telefone2,
        EnderecoDTO endereco
) {
}
