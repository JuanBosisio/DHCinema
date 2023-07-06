package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Funcion;
import com.example.PIBackEnd.dtos.FuncionDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.FuncionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/funciones")
@CrossOrigin
public class FuncionController {

    @Autowired
    private FuncionService funcionService;

    @PostMapping
    public ResponseEntity<FuncionDTO> guardarFuncion(@RequestBody FuncionDTO funcion) throws ResourceBadRequestException {
        return ResponseEntity.ok(funcionService.guardarFuncion(funcion));
    }

    @GetMapping
    public ResponseEntity<List<Funcion>> buscarTodasFunciones() throws ResourceNoContentException {
        return ResponseEntity.ok(funcionService.buscarTodasFunciones());
    }

    @GetMapping("/{peliculaNombre}")
    public ResponseEntity<List<Funcion>> buscarFuncionesPorNombrePelicula(@PathVariable String peliculaNombre) throws ResourceNoContentException {
        return ResponseEntity.ok(funcionService.buscarFuncionesPorNombrePelicula(peliculaNombre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarFuncion(@PathVariable Long id) throws ResourceNotFoundException {
        funcionService.eliminarFuncion(id);
        return ResponseEntity.ok("Eliminación de la Funcion con id = " + id + " con éxito");
    }

    @PutMapping
    public ResponseEntity<FuncionDTO> actualizarFuncion(@RequestBody FuncionDTO funcion) throws ResourceBadRequestException, ResourceNotFoundException {
        return ResponseEntity.ok(funcionService.actualizarFuncion(funcion));
    }

    @GetMapping("/buscador")
    public ResponseEntity<List<Funcion>> buscador(@RequestParam(required = false) String cine,
                                                  @RequestParam(required = false) String pelicula) throws ResourceBadRequestException, ResourceNoContentException {
        return ResponseEntity.ok(funcionService.buscador(cine, pelicula));
    }
}
