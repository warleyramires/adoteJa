package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_adotante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Adotante extends Usuario {

    private String cpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;
}
