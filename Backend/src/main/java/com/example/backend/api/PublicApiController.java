package com.example.backend.api;

import com.example.backend.logic.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final Service service;

    public PublicApiController(Service service) {
        this.service = service;
    }

    @GetMapping("/puestos/recientes")
    public ResponseEntity<?> recientes() {
        return ResponseEntity.ok(service.getTop5PuestosPublicos());
    }

    @GetMapping("/puestos/buscar")
    public ResponseEntity<?> buscar(@RequestParam(required = false) String ids) {
        if (ids == null || ids.isBlank()) return ResponseEntity.ok(List.of());
        List<Integer> lista = java.util.Arrays.stream(ids.split(","))
                .map(String::trim).filter(s -> !s.isEmpty())
                .map(Integer::parseInt).toList();
        return ResponseEntity.ok(service.buscarPuestosPublicos(lista));
    }

    @GetMapping("/puestos/{id}/caracteristicas")
    public ResponseEntity<?> caracteristicasDePuesto(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getCaracteristicasDePuesto(id));
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<?> caracteristicas() {
        return ResponseEntity.ok(service.getAllCaracteristicas());
    }
}
