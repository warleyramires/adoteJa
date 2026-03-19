package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_endereco")
@Data
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String logradouro;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

}
