package com.example.backend.api;

import com.example.backend.dto.CaracteristicaRequest;
import com.example.backend.logic.Caracteristica;
import com.example.backend.logic.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    private final Service service;

    public AdminApiController(Service service) {
        this.service = service;
    }

    @GetMapping("/empresas/pendientes")
    public ResponseEntity<?> getEmpresasPendientes() {
        return ResponseEntity.ok(service.obtenerEmpresasPendientes());
    }

    @PutMapping("/empresas/{id}/aprobar")
    public ResponseEntity<?> aprobarEmpresa(@PathVariable String id) {
        service.aprobarEmpresa(id);
        return ResponseEntity.ok(Map.of("mensaje", "Empresa aprobada exitosamente"));
    }

    @PutMapping("/empresas/{id}/rechazar")
    public ResponseEntity<?> rechazarEmpresa(@PathVariable String id) {
        service.rechazarEmpresa(id);
        return ResponseEntity.ok(Map.of("mensaje", "Empresa rechazada"));
    }

    @GetMapping("/oferentes/pendientes")
    public ResponseEntity<?> getOferentesPendientes() {
        return ResponseEntity.ok(service.obtenerOferentesPendientes());
    }

    @PutMapping("/oferentes/{id}/aprobar")
    public ResponseEntity<?> aprobarOferente(@PathVariable String id) {
        service.aprobarOferente(id);
        return ResponseEntity.ok(Map.of("mensaje", "Oferente aprobado exitosamente"));
    }

    @PutMapping("/oferentes/{id}/rechazar")
    public ResponseEntity<?> rechazarOferente(@PathVariable String id) {
        service.rechazarOferente(id);
        return ResponseEntity.ok(Map.of("mensaje", "Oferente rechazado"));
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> getCaracteristicas() {
        return ResponseEntity.ok(service.getAllCaracteristicas());
    }

    @GetMapping("/caracteristicas/raiz")
    public ResponseEntity<?> getCaracteristicasRaiz() {
        return ResponseEntity.ok(service.getCaracteristicasRaiz());
    }

    @GetMapping("/caracteristicas/{id}/hijos")
    public ResponseEntity<?> getHijos(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getSubCaracteristicas(id));
    }

    @PostMapping("/caracteristicas")
    public ResponseEntity<?> addCaracteristica(@RequestBody CaracteristicaRequest request) {
        try {
            Caracteristica nueva = new Caracteristica();
            nueva.setNombre(request.getNombre());
            if (request.getIdPadre() != null) {
                Caracteristica padre = new Caracteristica();
                padre.setId(request.getIdPadre());
                nueva.setIdPadre(padre);
            }
            service.addCaracteristica(nueva);
            return ResponseEntity.ok(Map.of("mensaje", "Característica creada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/caracteristicas/{id}")
    public ResponseEntity<?> updateCaracteristica(@PathVariable Integer id, @RequestBody CaracteristicaRequest request) {
        try {
            service.actualizarCaracteristica(id, request.getNombre(), request.getIdPadre());
            return ResponseEntity.ok(Map.of("mensaje", "Característica actualizada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/caracteristicas/{id}")
    public ResponseEntity<?> deleteCaracteristica(@PathVariable Integer id) {
        try {
            service.eliminarCaracteristica(id);
            return ResponseEntity.ok(Map.of("mensaje", "Característica eliminada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/reportes")
    public ResponseEntity<?> getReporte(@RequestParam int mes, @RequestParam int anio) {
        return ResponseEntity.ok(service.getReportePorMes(mes, anio));
    }
}
