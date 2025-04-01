package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.models.Endereco;

public record CreateAdotanteDTO(
        String email,
        String telefone1,
        String telefone2,
        EnderecoDTO endereco
) {
}
