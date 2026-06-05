package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegistroEmpresaRequest {

    @NotBlank(message = "La identificación es obligatoria")
    private String id;

    @NotBlank @Email(message = "Correo inválido")
    private String correo;

    @NotBlank(message = "La clave es obligatoria")
    private String clave;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String localizacion;
    private String telefono;
    private String descripcion;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getLocalizacion() { return localizacion; }
    public void setLocalizacion(String localizacion) { this.localizacion = localizacion; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
