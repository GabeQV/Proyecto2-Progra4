package com.example.backend.data;

import com.example.backend.logic.Usuario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, String> {
    Optional<Usuario> findById(String id);
    Optional<Usuario> findByCorreo(String correo);
}
