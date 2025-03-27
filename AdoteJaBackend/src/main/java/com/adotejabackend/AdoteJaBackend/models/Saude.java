package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_saude")
@Data
public class Saude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean vacinado;
    private Boolean castrado;
    private Boolean vermifugado;
    private String historicoSaude;



}
