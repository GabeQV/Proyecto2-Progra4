package com.example.backend.data;

import com.example.backend.logic.Oferente;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OferenteRepository extends CrudRepository<Oferente, String> {
    List<Oferente> findByAprobadoFalse();
}
