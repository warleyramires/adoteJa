package com.adotejabackend.AdoteJaBackend.repositories;

import com.adotejabackend.AdoteJaBackend.models.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {}
