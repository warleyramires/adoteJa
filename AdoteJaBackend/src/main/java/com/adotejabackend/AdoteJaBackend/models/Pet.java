package com.adotejabackend.AdoteJaBackend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tb_pet")
@Data
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;

    @Column(name = "image_url")
    private String imagemUrl;

    @OneToOne
    @JoinColumn(name = "saude_id", referencedColumnName = "id", unique = true)
    private Saude saude;

    @OneToOne
    @JoinColumn(name = "caracteristica_id", referencedColumnName = "id", unique = true)
    private Caracteristica caracteristica;

}
