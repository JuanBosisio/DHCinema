package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Cine;
import com.example.PIBackEnd.dtos.CineDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.CineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cines")
@CrossOrigin
public class CineController {

    @Autowired
    private CineService cineService;

    @PostMapping
    public ResponseEntity<CineDTO> guardarCine(@RequestBody CineDTO cine) throws ResourceBadRequestException {
        return ResponseEntity.ok(cineService.guardarCine(cine));
    }

    @GetMapping
    public ResponseEntity<List<Cine>> buscarTodosCines() throws ResourceNoContentException {
        return ResponseEntity.ok(cineService.buscarTodosCines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cine> buscarCinePorId(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok(cineService.buscarCinePorId(id));
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<Cine> buscarCinePorNombre(@PathVariable String nombre) throws ResourceNotFoundException {
        return ResponseEntity.ok(cineService.buscarCinePorNombre(nombre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCine(@PathVariable Long id) throws ResourceNotFoundException {
        cineService.eliminarCine(id);
        return ResponseEntity.ok("Eliminación del Cine con id = " + id + " con éxito");
    }

    @PutMapping
    public ResponseEntity<CineDTO> actualizarCiudad(@RequestBody CineDTO cine) throws ResourceBadRequestException, ResourceNotFoundException {
        return ResponseEntity.ok(cineService.actualizarCine(cine));
    }

    @GetMapping("/buscar/{titulo}")
    public ResponseEntity<List<Cine>> buscarCinesPorTituloPelicula(@PathVariable String titulo){
        return ResponseEntity.ok(cineService.buscarCinesPorTituloPelicula(titulo));
    }
}
