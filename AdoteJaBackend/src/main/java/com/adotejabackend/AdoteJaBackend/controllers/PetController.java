package com.adotejabackend.AdoteJaBackend.controllers;

import com.adotejabackend.AdoteJaBackend.dtos.CreatePetDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryPetDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdatePetDTO;
import com.adotejabackend.AdoteJaBackend.enums.Especie;
import com.adotejabackend.AdoteJaBackend.enums.Porte;
import com.adotejabackend.AdoteJaBackend.enums.Sexo;
import com.adotejabackend.AdoteJaBackend.services.PetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
public class PetController {

    @Autowired
    private PetService petService;

    @PostMapping
    public ResponseEntity<RecoveryPetDTO> create(@Valid @RequestBody CreatePetDTO dto) {
        return new ResponseEntity<>(petService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecoveryPetDTO>> findAll(
            @RequestParam(required = false) Especie especie,
            @RequestParam(required = false) Porte porte,
            @RequestParam(required = false) Sexo sexo,
            @RequestParam(required = false) Boolean disponivel) {
        return ResponseEntity.ok(petService.findAll(especie, porte, sexo, disponivel));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecoveryPetDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecoveryPetDTO> update(@PathVariable Long id, @RequestBody UpdatePetDTO dto) {
        return ResponseEntity.ok(petService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        petService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
