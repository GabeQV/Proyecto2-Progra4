package com.example.proyecto1.api;

import com.example.proyecto1.dto.AgregarHabilidadRequest;
import com.example.proyecto1.logic.Oferente;
import com.example.proyecto1.logic.Service;
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
    public ResponseEntity<?> getMiPerfil(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Oferente oferente = service.buscarPorIdOf(userDetails.getUsername());
            return ResponseEntity.ok(oferente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/habilidades")
    public ResponseEntity<?> getMisHabilidades(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                service.obtenerHabilidadesDeOferente(userDetails.getUsername())
        );
    }

    @PostMapping("/habilidades")
    public ResponseEntity<?> agregarHabilidad(
            @Valid @RequestBody AgregarHabilidadRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.agregarHabilidadOferente(
                    userDetails.getUsername(),
                    request.getIdCaracteristica(),
                    request.getNivel()
            );
            return ResponseEntity.ok(Map.of("mensaje", "Habilidad registrada exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/cv")
    public ResponseEntity<?> subirCV(
            @RequestParam("archivo") MultipartFile archivo,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.guardarCV(userDetails.getUsername(), archivo, uploadDir);
            return ResponseEntity.ok(Map.of("mensaje", "CV subido exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al guardar el archivo"));
        }
    }


    @DeleteMapping("/cv")
    public ResponseEntity<?> eliminarCV(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            service.eliminarCV(userDetails.getUsername(), uploadDir);
            return ResponseEntity.ok(Map.of("mensaje", "CV eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al eliminar el archivo"));
        }
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> getCaracteristicas() {
        return ResponseEntity.ok(service.getAllCaracteristicas());
    }

    @GetMapping("/puestos/buscar")
    public ResponseEntity<?> buscarPuestos(
            @RequestParam(required = false) List<Integer> ids) {
        return ResponseEntity.ok(service.BuscarPuestos(ids));
    }
}