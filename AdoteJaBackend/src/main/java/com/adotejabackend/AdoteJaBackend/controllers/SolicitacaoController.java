package com.adotejabackend.AdoteJaBackend.controllers;

import com.adotejabackend.AdoteJaBackend.dtos.CreateSolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoverySolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateStatusSolicitacaoDTO;
import com.adotejabackend.AdoteJaBackend.services.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @PostMapping
    public ResponseEntity<RecoverySolicitacaoDTO> create(@Valid @RequestBody CreateSolicitacaoDTO dto) {
        return new ResponseEntity<>(solicitacaoService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecoverySolicitacaoDTO>> findAll() {
        return ResponseEntity.ok(solicitacaoService.findAll());
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<RecoverySolicitacaoDTO>> findMinhas() {
        return ResponseEntity.ok(solicitacaoService.findMinhas());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RecoverySolicitacaoDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusSolicitacaoDTO dto) {
        return ResponseEntity.ok(solicitacaoService.updateStatus(id, dto));
    }
}
