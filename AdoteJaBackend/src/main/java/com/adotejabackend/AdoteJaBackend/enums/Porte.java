package com.adotejabackend.AdoteJaBackend.enums;

public enum Porte {
    PEQUENO("Pequno"),
    MEDIO("Médio"),
    GRANDE("Grande");

    private final String porte;

    private Porte(String porte) {
        this.porte = porte;
    }

    public String getPorte() {
        return porte;
    }
}
