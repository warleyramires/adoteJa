package com.adotejabackend.AdoteJaBackend.repositories;

import com.adotejabackend.AdoteJaBackend.enums.RoleName;
import com.adotejabackend.AdoteJaBackend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
