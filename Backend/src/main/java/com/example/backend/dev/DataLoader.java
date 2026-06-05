package com.example.backend.dev;

import com.example.backend.data.UsuarioRepository;
import com.example.backend.logic.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (usuarioRepository.findByCorreo("admin@bolsaempleo.com").isEmpty()) {
            System.out.println("Creando usuario administrador por defecto...");
            String password = passwordEncoder.encode("admin123");
            Usuario admin = new Usuario();
            admin.setId("admin");
            admin.setCorreo("admin@bolsaempleo.com");
            admin.setClave(password);
            admin.setRolUsuario("ADMIN");
            admin.setActivo(true);
            usuarioRepository.save(admin);
            System.out.println("Usuario administrador creado.");
        } else {
            System.out.println("El usuario administrador ya existe. No se creará de nuevo.");
        }
    }
}
