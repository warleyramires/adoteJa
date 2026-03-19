package com.adotejabackend.AdoteJaBackend.enums;

public enum Sexo {
    MACHO("Macho"),
    FEMEA("Fêmea");

    private final String sexo;

    private Sexo(String sexo) {
        this.sexo = sexo;
    }

    public String getDescricao() {
        return sexo;
    }
}