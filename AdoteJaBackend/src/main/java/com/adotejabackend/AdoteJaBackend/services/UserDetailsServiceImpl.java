package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.models.Usuario;
import com.adotejabackend.AdoteJaBackend.models.UsuarioDetailsImpl;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
        return new UsuarioDetailsImpl(usuario);
    }
}