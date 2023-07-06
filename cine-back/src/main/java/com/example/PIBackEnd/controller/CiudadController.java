package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Ciudad;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.CiudadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ciudades")
@CrossOrigin
public class CiudadController {

    @Autowired
    private CiudadService ciudadService;

    @PostMapping
    public ResponseEntity<Ciudad> guardarCiudad(@RequestBody Ciudad ciudad) throws ResourceBadRequestException {
        return ResponseEntity.ok(ciudadService.guardarCiudad(ciudad));
    }

    @GetMapping
    public ResponseEntity<List<Ciudad>> buscarTodasCiudades() throws ResourceNoContentException {
        return ResponseEntity.ok(ciudadService.buscarTodasCiudades());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ciudad> buscarCiudadPorId(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok(ciudadService.buscarCiudadPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarCiudad(@PathVariable Long id) throws ResourceNotFoundException {
        ciudadService.eliminarCiudad(id);
        return ResponseEntity.ok("Eliminación de la Ciudad con id = " + id + " con éxito");
    }

    @PutMapping
    public ResponseEntity<Ciudad> actualizarCiudad(@RequestBody Ciudad ciudad) throws ResourceBadRequestException, ResourceNotFoundException {
        return ResponseEntity.ok(ciudadService.actualizarCiudad(ciudad));
    }
}
