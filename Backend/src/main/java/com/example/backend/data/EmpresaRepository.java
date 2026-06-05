package com.example.backend.data;

import com.example.backend.logic.Empresa;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaRepository extends CrudRepository<Empresa, String> {
    List<Empresa> findByAprobadoFalse();
}
