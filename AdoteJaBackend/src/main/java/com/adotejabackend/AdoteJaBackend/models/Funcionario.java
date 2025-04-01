package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "tb_funcionario")
@Data
public class Funcionario extends Usuario {

    private String cargo;

}
