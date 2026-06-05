package com.example.backend.data;

import com.example.backend.logic.OferenteHabilidad;
import com.example.backend.logic.OferenteHabilidadId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OferenteHabilidadRepository extends CrudRepository<OferenteHabilidad, OferenteHabilidadId> {
    List<OferenteHabilidad> findByIdOferente_Id(String idOferente);
    void deleteByIdOferente_Id(String idOferente);
}
