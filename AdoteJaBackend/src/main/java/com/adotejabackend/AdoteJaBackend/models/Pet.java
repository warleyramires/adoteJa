package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_pet")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;

    @Column(name = "image_url")
    private String imagemUrl;

    private Boolean disponivel;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "saude_id", referencedColumnName = "id", unique = true)
    private Saude saude;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "caracteristica_id", referencedColumnName = "id", unique = true)
    private Caracteristica caracteristica;
}
