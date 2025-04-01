package com.adotejabackend.AdoteJaBackend.controllers;

import com.adotejabackend.AdoteJaBackend.dtos.CreateAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.dtos.CreateUsuarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.LoginUsuarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryJwtTokenDTO;
import com.adotejabackend.AdoteJaBackend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<RecoveryJwtTokenDTO> authenticate(@RequestBody LoginUsuarioDTO loginUsuarioDTO){
        RecoveryJwtTokenDTO token = usuarioService.authenticateUsuario(loginUsuarioDTO);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Void> createUsuarioCustomer(
                                @RequestBody CreateUsuarioDTO createUsuarioDTO){
        usuarioService.createUsuario(createUsuarioDTO);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @GetMapping("/test")
    public ResponseEntity<String> getAuthenticationTest() {
        return new ResponseEntity<>("Autenticado com sucesso", HttpStatus.OK);
    }
    @GetMapping("/test/customer")
    public ResponseEntity<String> getCustomerAuthenticationTest() {
        return new ResponseEntity<>("Cliente autenticado com sucesso", HttpStatus.OK);
    }
    @GetMapping("/test/administrator")
    public ResponseEntity<String> getAdminAuthenticationTest() {
        return new ResponseEntity<>("Administrador autenticado com sucesso", HttpStatus.OK);
    }

}
