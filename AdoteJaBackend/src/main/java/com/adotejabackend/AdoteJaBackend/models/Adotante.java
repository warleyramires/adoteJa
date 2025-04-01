package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_adotantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Adotante extends Usuario {

    private String telefone1;
    private String telefone2;

    @OneToOne
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;
}
