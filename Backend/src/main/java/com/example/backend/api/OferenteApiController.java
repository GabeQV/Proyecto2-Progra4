package com.example.backend.api;

import com.example.backend.dto.AgregarHabilidadRequest;
import com.example.backend.logic.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/oferente")
public class OferenteApiController {

    private final Service service;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public OferenteApiController(Service service) {
        this.service = service;
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> getMiPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(service.buscarPorIdOf(userDetails.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@RequestBody Map<String, String> body,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.actualizarPerfilOferente(userDetails.getUsername(),
                    body.get("nombre"), body.get("telefono"), body.get("localizacion"));
            return ResponseEntity.ok(Map.of("mensaje", "Perfil actualizado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/habilidades")
    public ResponseEntity<?> getMisHabilidades(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(service.obtenerHabilidadesDeOferente(userDetails.getUsername()));
    }

    @PutMapping("/habilidades")
    public ResponseEntity<?> actualizarHabilidades(@RequestBody List<AgregarHabilidadRequest> habilidades,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.reemplazarHabilidades(userDetails.getUsername(), habilidades);
            return ResponseEntity.ok(Map.of("mensaje", "Habilidades actualizadas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/habilidades")
    public ResponseEntity<?> agregarHabilidad(@Valid @RequestBody AgregarHabilidadRequest request,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.agregarHabilidadOferente(userDetails.getUsername(), request.getIdCaracteristica(), request.getNivel());
            return ResponseEntity.ok(Map.of("mensaje", "Habilidad registrada exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cv")
    public ResponseEntity<?> subirCV(@RequestParam("file") MultipartFile archivo,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.guardarCV(userDetails.getUsername(), archivo, uploadDir);
            return ResponseEntity.ok(Map.of("mensaje", "CV subido exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al guardar el archivo"));
        }
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<?> descargarCV(@PathVariable String id) {
        try {
            return service.descargarCV(id, uploadDir);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/cv")
    public ResponseEntity<?> eliminarCV(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.eliminarCV(userDetails.getUsername(), uploadDir);
            return ResponseEntity.ok(Map.of("mensaje", "CV eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al eliminar el archivo"));
        }
    }
}
