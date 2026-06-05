package com.example.backend.api;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegistroEmpresaRequest;
import com.example.backend.dto.RegistroOferenteRequest;
import com.example.backend.logic.Service;
import com.example.backend.security.CustomUserDetailsService;
import com.example.backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final Service service;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          CustomUserDetailsService userDetailsService,
                          Service service) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getClave())
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);
        String rol = userDetails.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("");
        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, rol, userDetails.getUsername()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token requerido"));
        }
        try {
            String userId = jwtTokenProvider.getUsernameFromToken(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
            if (!jwtTokenProvider.validateToken(refreshToken, userDetails)) {
                return ResponseEntity.status(401).body(Map.of("error", "Refresh token inválido o expirado"));
            }
            return ResponseEntity.ok(Map.of("token", jwtTokenProvider.generateToken(userDetails)));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Refresh token inválido"));
        }
    }

    @PostMapping("/registro/empresa")
    public ResponseEntity<?> registrarEmpresa(@Valid @RequestBody RegistroEmpresaRequest request) {
        try {
            service.registrarEmpresa(request.getId(), request.getCorreo(), request.getClave(),
                    request.getNombre(), request.getLocalizacion(), request.getTelefono(), request.getDescripcion());
            return ResponseEntity.ok(Map.of("mensaje", "Empresa registrada. Pendiente de aprobación por el administrador."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/registro/oferente")
    public ResponseEntity<?> registrarOferente(@Valid @RequestBody RegistroOferenteRequest request) {
        try {
            service.registrarOferente(request.getId(), request.getCorreo(), request.getClave(),
                    request.getNombre(), request.getPrimerApellido(), request.getSegundoApellido(),
                    request.getNacionalidad(), request.getTelefono(), request.getResidencia());
            return ResponseEntity.ok(Map.of("mensaje", "Oferente registrado. Pendiente de aprobación por el administrador."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
