package com.example.backend.data;

import com.example.backend.logic.PuestoCaracteristica;
import com.example.backend.logic.PuestoCaracteristicaId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuestoCaracteristicaRepository extends CrudRepository<PuestoCaracteristica, PuestoCaracteristicaId> {
    List<PuestoCaracteristica> findByIdPuesto_Id(Integer idPuesto);
}
