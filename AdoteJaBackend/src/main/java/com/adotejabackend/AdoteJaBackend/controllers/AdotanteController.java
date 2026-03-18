package com.adotejabackend.AdoteJaBackend.controllers;

import com.adotejabackend.AdoteJaBackend.dtos.CreateAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.services.AdotanteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adotantes")
public class AdotanteController {

    @Autowired
    private AdotanteService adotanteService;

    @PostMapping
    public ResponseEntity<RecoveryAdotanteDTO> create(@Valid @RequestBody CreateAdotanteDTO dto) {
        return new ResponseEntity<>(adotanteService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecoveryAdotanteDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(adotanteService.findById(id));
    }
}
