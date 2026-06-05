package com.example.backend.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "puesto")
public class Puesto {

    public Puesto(Empresa idEmpresa, String descripcion, Double salario, String tipoPuesto, Boolean activo, LocalDate fechaRegistro, String moneda) {
        this.idEmpresa = idEmpresa;
        this.descripcion = descripcion;
        this.salario = salario;
        this.tipoPuesto = tipoPuesto;
        this.activo = activo;
        this.fechaRegistro = fechaRegistro;
        this.moneda = moneda;
    }
    public Puesto() {}

    @JsonIgnore
    @OneToMany(mappedBy = "idPuesto", fetch = FetchType.LAZY)
    private List<PuestoCaracteristica> caracteristicas = new ArrayList<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @JsonIgnoreProperties({"usuario", "aprobado", "telefono", "descripcion", "localizacion", "correo"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_empresa")
    private Empresa idEmpresa;

    @Size(max = 100)
    @Column(name = "descripcion", length = 100)
    private String descripcion;

    @Column(name = "salario")
    private Double salario;

    @Size(max = 20)
    @Column(name = "tipo_puesto", length = 20)
    private String tipoPuesto;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;

    @Size(max = 6)
    @Column(name = "moneda", length = 6)
    private String moneda;

    @Column(name = "es_publico")
    private Boolean esPublico = true;
}
