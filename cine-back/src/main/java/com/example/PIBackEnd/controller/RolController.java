package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Rol;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/roles")
@CrossOrigin
public class RolController {

    @Autowired
    private RolService rolService;

    @PostMapping
    public ResponseEntity<Rol> guardarRol(@RequestBody Rol rol) throws ResourceBadRequestException {
        return ResponseEntity.ok(rolService.guardarRol(rol));
    }

    @GetMapping
    public ResponseEntity<List<Rol>> buscarTodosRoles() throws ResourceNoContentException {
        return ResponseEntity.ok(rolService.buscarTodosRoles());
    }

    @DeleteMapping("/{nombre}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable String nombre) throws ResourceNotFoundException, ResourceBadRequestException {
        rolService.eliminarRol(nombre);
        return ResponseEntity.ok("Eliminación del Rol con nombre = " + nombre + ", con éxito");
    }

    @GetMapping("/{nombre}")
    public ResponseEntity<Rol> buscarRol(@PathVariable String nombre) throws ResourceNotFoundException {
        return ResponseEntity.ok(rolService.buscarRolPorNombre(nombre));
    }
}
