package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_funcionario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Funcionario extends Usuario {

    @Column(unique = true, nullable = false)
    private String matricula;

    @Column(nullable = false)
    private String cargo;
}
