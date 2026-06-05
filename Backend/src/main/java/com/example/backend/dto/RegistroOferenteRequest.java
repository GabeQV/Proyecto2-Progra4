package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegistroOferenteRequest {

    @NotBlank(message = "La identificación es obligatoria")
    private String id;

    @NotBlank @Email(message = "Correo inválido")
    private String correo;

    @NotBlank(message = "La clave es obligatoria")
    private String clave;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String primerApellido;
    private String segundoApellido;
    private String nacionalidad;
    private String telefono;

    @NotBlank(message = "La residencia es obligatoria")
    private String residencia;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getPrimerApellido() { return primerApellido; }
    public void setPrimerApellido(String primerApellido) { this.primerApellido = primerApellido; }
    public String getSegundoApellido() { return segundoApellido; }
    public void setSegundoApellido(String segundoApellido) { this.segundoApellido = segundoApellido; }
    public String getNacionalidad() { return nacionalidad; }
    public void setNacionalidad(String nacionalidad) { this.nacionalidad = nacionalidad; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getResidencia() { return residencia; }
    public void setResidencia(String residencia) { this.residencia = residencia; }
}
