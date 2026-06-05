package com.example.backend.dto;

import jakarta.validation.constraints.NotNull;

public class AgregarHabilidadRequest {

    @NotNull(message = "La característica es obligatoria")
    private Integer idCaracteristica;

    @NotNull(message = "El nivel es obligatorio")
    private Integer nivel;

    public Integer getIdCaracteristica() { return idCaracteristica; }
    public void setIdCaracteristica(Integer idCaracteristica) { this.idCaracteristica = idCaracteristica; }
    public Integer getNivel() { return nivel; }
    public void setNivel(Integer nivel) { this.nivel = nivel; }
}
