package com.example.backend.data;

import com.example.backend.logic.Postulacion;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostulacionRepository extends CrudRepository<Postulacion, Integer> {
}
