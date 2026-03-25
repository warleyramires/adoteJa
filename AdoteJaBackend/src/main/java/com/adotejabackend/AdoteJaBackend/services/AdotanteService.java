package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration;
import com.adotejabackend.AdoteJaBackend.dtos.CreateAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.exceptions.RegistrationException;
import com.adotejabackend.AdoteJaBackend.dtos.EnderecoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateAdotanteDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateEnderecoDTO;
import com.adotejabackend.AdoteJaBackend.enums.RoleName;
import com.adotejabackend.AdoteJaBackend.models.Adotante;
import com.adotejabackend.AdoteJaBackend.models.Endereco;
import com.adotejabackend.AdoteJaBackend.repositories.AdotanteRepository;
import com.adotejabackend.AdoteJaBackend.repositories.RoleRepository;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class AdotanteService {

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SecurityConfiguration securityConfiguration;

    @Autowired
    private AuditService auditService;

    public RecoveryAdotanteDTO create(CreateAdotanteDTO dto) {
        if (Period.between(dto.dataNascimento(), LocalDate.now()).getYears() < 18) {
            throw new IllegalArgumentException("Adotante deve ter no mínimo 18 anos.");
        }

        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RegistrationException("E-mail já cadastrado.");
        }

        Endereco endereco = toEnderecoEntity(dto.enderecoDTO());

        Adotante adotante = new Adotante();
        adotante.setNome(dto.nome());
        adotante.setEmail(dto.email());
        adotante.setPassword(securityConfiguration.passwordEncoder().encode(dto.password()));
        adotante.setTelefone1(dto.telefone1());
        adotante.setTelefone2(dto.telefone2());
        adotante.setRoles(List.of(roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseThrow(() -> new RuntimeException("Role ROLE_CUSTOMER não encontrada"))));
        adotante.setCpf(dto.cpf());
        adotante.setDataNascimento(dto.dataNascimento());

        endereco.setUsuario(adotante);
        adotante.setEndereco(endereco);

        RecoveryAdotanteDTO result = toRecoveryDTO(adotanteRepository.save(adotante));
        auditService.log("REGISTER", dto.email(), "Adotante cadastrado");
        return result;
    }

    public RecoveryAdotanteDTO findById(Long id) {
        Adotante adotante = adotanteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Adotante não encontrado: " + id));
        verifyOwnership(adotante);
        return toRecoveryDTO(adotante);
    }

    @Transactional
    public RecoveryAdotanteDTO update(Long id, UpdateAdotanteDTO dto) {
        Adotante adotante = adotanteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Adotante não encontrado: " + id));
        verifyOwnership(adotante);

        if (dto.nome() != null) adotante.setNome(dto.nome());
        if (dto.telefone1() != null) adotante.setTelefone1(dto.telefone1());
        if (dto.telefone2() != null) adotante.setTelefone2(dto.telefone2());
        if (dto.cpf() != null) adotante.setCpf(dto.cpf());
        if (dto.dataNascimento() != null) adotante.setDataNascimento(dto.dataNascimento());

        if (dto.endereco() != null && adotante.getEndereco() != null) {
            Endereco e = adotante.getEndereco();
            if (dto.endereco().logradouro() != null) e.setLogradouro(dto.endereco().logradouro());
            if (dto.endereco().numero() != null) e.setNumero(dto.endereco().numero());
            if (dto.endereco().bairro() != null) e.setBairro(dto.endereco().bairro());
            if (dto.endereco().cidade() != null) e.setCidade(dto.endereco().cidade());
            if (dto.endereco().estado() != null) e.setEstado(dto.endereco().estado());
            if (dto.endereco().cep() != null) e.setCep(dto.endereco().cep());
        }

        return toRecoveryDTO(adotanteRepository.save(adotante));
    }

    private void verifyOwnership(Adotante adotante) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Acesso negado.");
        }
        boolean isPrivileged = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(RoleName.ROLE_MEMBER.name())
                           || a.getAuthority().equals(RoleName.ROLE_ADMINISTRATOR.name()));
        if (isPrivileged) return;
        if (!adotante.getEmail().equals(auth.getName())) {
            throw new AccessDeniedException("Acesso negado.");
        }
    }

    private Endereco toEnderecoEntity(EnderecoDTO dto) {
        Endereco endereco = new Endereco();
        endereco.setCep(dto.cep());
        endereco.setEstado(dto.estado());
        endereco.setCidade(dto.cidade());
        endereco.setBairro(dto.bairro());
        endereco.setLogradouro(dto.logradouro());
        endereco.setNumero(dto.numero());
        return endereco;
    }

    private RecoveryAdotanteDTO toRecoveryDTO(Adotante a) {
        return new RecoveryAdotanteDTO(
                a.getId(), a.getNome(), a.getEmail(),
                a.getTelefone1(), a.getTelefone2(),
                a.getCpf(), a.getDataNascimento()
        );
    }
}
