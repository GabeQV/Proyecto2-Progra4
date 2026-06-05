package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public class CrearPuestoRequest {

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull @Positive(message = "El salario debe ser mayor a 0")
    private Double salario;

    @NotBlank(message = "El tipo de puesto es obligatorio")
    private String tipoPuesto;

    @NotBlank(message = "La moneda es obligatoria")
    private String moneda;

    private List<CaracteristicaNivel> caracteristicas;

    public static class CaracteristicaNivel {
        private Integer idCaracteristica;
        private Integer nivel;

        public Integer getIdCaracteristica() { return idCaracteristica; }
        public void setIdCaracteristica(Integer idCaracteristica) { this.idCaracteristica = idCaracteristica; }
        public Integer getNivel() { return nivel; }
        public void setNivel(Integer nivel) { this.nivel = nivel; }
    }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getSalario() { return salario; }
    public void setSalario(Double salario) { this.salario = salario; }
    public String getTipoPuesto() { return tipoPuesto; }
    public void setTipoPuesto(String tipoPuesto) { this.tipoPuesto = tipoPuesto; }
    public String getMoneda() { return moneda; }
    public void setMoneda(String moneda) { this.moneda = moneda; }
    public List<CaracteristicaNivel> getCaracteristicas() { return caracteristicas; }
    public void setCaracteristicas(List<CaracteristicaNivel> caracteristicas) { this.caracteristicas = caracteristicas; }
}
