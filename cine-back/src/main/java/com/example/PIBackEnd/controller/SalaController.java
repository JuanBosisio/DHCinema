package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Sala;
import com.example.PIBackEnd.dtos.SalaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.SalaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/salas")
@CrossOrigin
public class SalaController {

    @Autowired
    private SalaService salaService;

    @PostMapping
    public ResponseEntity<SalaDTO> guardarSala(@RequestBody SalaDTO sala) throws ResourceBadRequestException {
        return ResponseEntity.ok(salaService.guardarSala(sala));
    }

    @GetMapping
    public ResponseEntity<List<Sala>> buscarTodasSalas() throws ResourceNoContentException {
        return ResponseEntity.ok(salaService.buscarTodasSalas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarSala(@PathVariable Long id) throws ResourceNotFoundException {
        salaService.eliminarSala(id);
        return ResponseEntity.ok("Eliminación de la Sala con id = " + id + " con éxito");
    }

    @PutMapping
    public ResponseEntity<SalaDTO> actualizarSala(@RequestBody SalaDTO sala) throws ResourceBadRequestException, ResourceNotFoundException {
        return ResponseEntity.ok(salaService.actualizarSala(sala));
    }
}
