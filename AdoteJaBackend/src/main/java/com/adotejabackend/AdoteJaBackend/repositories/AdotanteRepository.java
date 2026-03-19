package com.adotejabackend.AdoteJaBackend.repositories;

import com.adotejabackend.AdoteJaBackend.models.Adotante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdotanteRepository extends JpaRepository<Adotante, Long> {
    Optional<Adotante> findByEmail(String email);
}
