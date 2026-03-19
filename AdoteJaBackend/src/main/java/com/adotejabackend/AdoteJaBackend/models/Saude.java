package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_saude")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Saude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean vacinado;
    private Boolean castrado;
    private Boolean vermifugado;
    private String historicoSaude;
}
