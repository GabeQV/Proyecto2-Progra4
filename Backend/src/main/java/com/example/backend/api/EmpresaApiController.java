package com.example.backend.api;

import com.example.backend.dto.CrearPuestoRequest;
import com.example.backend.logic.Puesto;
import com.example.backend.logic.Service;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaApiController {

    private final Service service;

    public EmpresaApiController(Service service) {
        this.service = service;
    }

    @GetMapping("/puestos")
    public ResponseEntity<?> getMisPuestos(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(service.getPuestosDeEmpresa(userDetails.getUsername()));
    }

    @GetMapping("/puestos/{id}")
    public ResponseEntity<?> getPuesto(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(service.getPuesto(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/puestos")
    public ResponseEntity<?> crearPuesto(@Valid @RequestBody CrearPuestoRequest request,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Puesto puesto = service.crearPuesto(userDetails.getUsername(), request.getDescripcion(),
                    request.getSalario(), request.getTipoPuesto(), request.getMoneda(), request.getEsPublico());

            if (request.getCaracteristicas() != null) {
                for (CrearPuestoRequest.CaracteristicaNivel cn : request.getCaracteristicas()) {
                    System.out.println(">>> idCaracteristica=" + cn.getIdCaracteristica() + " nivel=" + cn.getNivel());
                    service.agregarCaracteristicaAPuesto(puesto.getId(), cn.getIdCaracteristica(), cn.getNivel());
                }
            }
            return ResponseEntity.ok(Map.of("mensaje", "Puesto creado exitosamente", "idPuesto", puesto.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/puestos/{id}/desactivar")
    public ResponseEntity<?> desactivarPuesto(@PathVariable Integer id) {
        service.desactivar(id);
        return ResponseEntity.ok(Map.of("mensaje", "Puesto desactivado exitosamente"));
    }

    @GetMapping("/puestos/{id}/candidatos")
    public ResponseEntity<?> buscarCandidatos(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(
                service.buscarCandidatos(id).stream()
                    .map(r -> r.oferente)
                    .toList()
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al buscar candidatos"));
        }
    }

    @GetMapping("/puestos/{id}/caracteristicas")
    public ResponseEntity<?> getCaracteristicasDePuesto(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getCaracteristicasDePuesto(id));
    }

    @GetMapping("/oferentes/{id}")
    public ResponseEntity<?> getDetalleCandidato(@PathVariable String id) {
        try {
            return ResponseEntity.ok(service.buscarPorIdOf(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/oferentes/{id}/habilidades")
    public ResponseEntity<?> getHabilidadesCandidato(@PathVariable String id) {
        return ResponseEntity.ok(service.obtenerHabilidadesDeOferente(id));
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> getCaracteristicas() {
        return ResponseEntity.ok(service.getAllCaracteristicas());
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPuestos(@RequestParam(required = false) List<Integer> ids) {
        return ResponseEntity.ok(service.BuscarPuestos(ids));
    }
}
