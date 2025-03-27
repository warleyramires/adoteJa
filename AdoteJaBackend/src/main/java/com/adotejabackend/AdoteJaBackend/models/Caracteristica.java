package com.adotejabackend.AdoteJaBackend.models;

import com.adotejabackend.AdoteJaBackend.enums.Especie;
import com.adotejabackend.AdoteJaBackend.enums.Porte;
import com.adotejabackend.AdoteJaBackend.enums.Sexo;
import jakarta.persistence.*;

@Entity
@Table(name="tb_caracteristica")
public class Caracteristica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String raca;
    private String cor;

    @Enumerated(EnumType.STRING)
    private Especie especie;
    @Enumerated(EnumType.STRING)
    private Porte porte;
    @Enumerated(EnumType.STRING)
    private Sexo sexo;


}
