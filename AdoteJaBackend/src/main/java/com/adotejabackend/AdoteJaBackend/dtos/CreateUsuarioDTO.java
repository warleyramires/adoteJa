package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.RoleName;

public record CreateUsuarioDTO(
        String email,
        String password,
        RoleName role) {
}
