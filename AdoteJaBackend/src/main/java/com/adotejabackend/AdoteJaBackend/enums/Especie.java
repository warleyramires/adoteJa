package com.adotejabackend.AdoteJaBackend.enums;

public enum Especie {

    CAO("Cachorro"),
    GATO("Gato"),
    OUTRO("Outro");

    private final String especie;

    private Especie(String especie) {
        this.especie = especie;
    }

    public String getEspecie() {
        return especie;
    }
}
