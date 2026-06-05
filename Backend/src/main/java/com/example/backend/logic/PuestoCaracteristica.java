package com.example.backend.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "puesto_caracteristica")
public class PuestoCaracteristica {
    @EmbeddedId
    private PuestoCaracteristicaId id;

    @JsonIgnore
    @MapsId("idPuesto")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_puesto", nullable = false)
    private Puesto idPuesto;

    @MapsId("idCaracteristica")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_caracteristica", nullable = false)
    private Caracteristica idCaracteristica;

    @Column(name = "nivel_requerido")
    private Integer nivelRequerido;
}
