package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.models.Role;

import java.util.List;

public record RecoveryUsuarioDTO(
        Long id,
        String email,
        List<Role> roles
) {
}
