package com.example.backend.security;

import com.example.backend.data.UsuarioRepository;
import com.example.backend.logic.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(identifier)
                .orElseGet(() -> usuarioRepository.findById(identifier)
                        .orElseThrow(() -> new UsernameNotFoundException(
                                "No se encontró el usuario: " + identifier)));

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRolUsuario()));

        boolean accountNonLocked = usuario.getActivo() != null && usuario.getActivo();

        return new User(
                usuario.getId(),
                usuario.getClave(),
                true, true, true,
                accountNonLocked,
                authorities
        );
    }
}
