package com.adotejabackend.AdoteJaBackend.dtos;

import com.adotejabackend.AdoteJaBackend.enums.Especie;
import com.adotejabackend.AdoteJaBackend.enums.Porte;
import com.adotejabackend.AdoteJaBackend.enums.Sexo;

public record CaracteristicaDTO(
        String raca,
        String cor,
        Especie especie,
        Porte porte,
        Sexo sexo
) {}
