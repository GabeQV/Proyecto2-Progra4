package com.example.backend.dto;

public class CaracteristicaRequest {

    private String nombre;
    private Integer idPadre;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getIdPadre() { return idPadre; }
    public void setIdPadre(Integer idPadre) { this.idPadre = idPadre; }
}
