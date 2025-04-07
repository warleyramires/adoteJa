package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.RoleName;

public record CreateUsuarioDTO(
        String nome,
        String email,
        String password,
        RoleName role,
        String telefon1,
        String telefone2,
        EnderecoDTO enderecoDTO
) {
}
