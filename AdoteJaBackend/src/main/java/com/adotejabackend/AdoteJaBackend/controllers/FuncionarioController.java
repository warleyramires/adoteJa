package com.adotejabackend.AdoteJaBackend.controllers;

import com.adotejabackend.AdoteJaBackend.dtos.CreateFuncionarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryFuncionarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateFuncionarioDTO;
import com.adotejabackend.AdoteJaBackend.services.FuncionarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @PostMapping
    public ResponseEntity<RecoveryFuncionarioDTO> create(@Valid @RequestBody CreateFuncionarioDTO dto) {
        return new ResponseEntity<>(funcionarioService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecoveryFuncionarioDTO>> findAll() {
        return ResponseEntity.ok(funcionarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecoveryFuncionarioDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(funcionarioService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecoveryFuncionarioDTO> update(
            @PathVariable Long id,
            @RequestBody UpdateFuncionarioDTO dto) {
        return ResponseEntity.ok(funcionarioService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        funcionarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
