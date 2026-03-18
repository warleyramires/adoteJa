package com.adotejabackend.AdoteJaBackend.services;

import com.adotejabackend.AdoteJaBackend.config.SecurityConfiguration;
import com.adotejabackend.AdoteJaBackend.dtos.CreateFuncionarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.EnderecoDTO;
import com.adotejabackend.AdoteJaBackend.dtos.RecoveryFuncionarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateFuncionarioDTO;
import com.adotejabackend.AdoteJaBackend.dtos.UpdateEnderecoDTO;
import com.adotejabackend.AdoteJaBackend.models.Endereco;
import com.adotejabackend.AdoteJaBackend.models.Funcionario;
import com.adotejabackend.AdoteJaBackend.repositories.FuncionarioRepository;
import com.adotejabackend.AdoteJaBackend.repositories.RoleRepository;
import com.adotejabackend.AdoteJaBackend.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SecurityConfiguration securityConfiguration;

    public RecoveryFuncionarioDTO create(CreateFuncionarioDTO dto) {
        if (usuarioRepository.findByEmail(dto.email()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        Endereco endereco = toEnderecoEntity(dto.enderecoDTO());

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(dto.nome());
        funcionario.setEmail(dto.email());
        funcionario.setPassword(securityConfiguration.passwordEncoder().encode(dto.password()));
        funcionario.setTelefone1(dto.telefone1());
        funcionario.setTelefone2(dto.telefone2());
        funcionario.setRoles(List.of(roleRepository.findByName(dto.role())
                .orElseThrow(() -> new RuntimeException("Role não encontrada: " + dto.role()))));
        funcionario.setMatricula(dto.matricula());
        funcionario.setCargo(dto.cargo());

        endereco.setUsuario(funcionario);
        funcionario.setEndereco(endereco);

        return toRecoveryDTO(funcionarioRepository.save(funcionario));
    }

    public List<RecoveryFuncionarioDTO> findAll() {
        return funcionarioRepository.findAll().stream().map(this::toRecoveryDTO).toList();
    }

    public RecoveryFuncionarioDTO findById(Long id) {
        return toRecoveryDTO(funcionarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado: " + id)));
    }

    public void delete(Long id) {
        if (!funcionarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Funcionário não encontrado: " + id);
        }
        funcionarioRepository.deleteById(id);
    }

    public RecoveryFuncionarioDTO update(Long id, UpdateFuncionarioDTO dto) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Funcionário não encontrado: " + id));

        if (dto.nome() != null) funcionario.setNome(dto.nome());
        if (dto.telefone1() != null) funcionario.setTelefone1(dto.telefone1());
        if (dto.telefone2() != null) funcionario.setTelefone2(dto.telefone2());
        if (dto.matricula() != null) funcionario.setMatricula(dto.matricula());
        if (dto.cargo() != null) funcionario.setCargo(dto.cargo());

        if (dto.endereco() != null && funcionario.getEndereco() != null) {
            Endereco e = funcionario.getEndereco();
            if (dto.endereco().logradouro() != null) e.setLogradouro(dto.endereco().logradouro());
            if (dto.endereco().numero() != null) e.setNumero(dto.endereco().numero());
            if (dto.endereco().bairro() != null) e.setBairro(dto.endereco().bairro());
            if (dto.endereco().cidade() != null) e.setCidade(dto.endereco().cidade());
            if (dto.endereco().estado() != null) e.setEstado(dto.endereco().estado());
            if (dto.endereco().cep() != null) e.setCep(dto.endereco().cep());
        }

        return toRecoveryDTO(funcionarioRepository.save(funcionario));
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

    private RecoveryFuncionarioDTO toRecoveryDTO(Funcionario f) {
        return new RecoveryFuncionarioDTO(
                f.getId(), f.getNome(), f.getEmail(),
                f.getTelefone1(), f.getTelefone2(), f.getMatricula(), f.getCargo()
        );
    }
}
