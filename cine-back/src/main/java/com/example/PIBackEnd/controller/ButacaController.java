package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Butaca;
import com.example.PIBackEnd.dtos.ButacaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.ButacaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/butacas")
@CrossOrigin
public class ButacaController {

    @Autowired
    private ButacaService butacaService;

    @GetMapping("/{id}")
    public ResponseEntity<List<Butaca>> buscarButacasPorIdFuncion(@PathVariable Long id) throws ResourceNoContentException {
        return ResponseEntity.ok(butacaService.buscarButacasPorIdFuncion(id));
    }

    @PutMapping
    public ResponseEntity<ButacaDTO> actualizarButaca(@RequestBody ButacaDTO butaca) throws ResourceBadRequestException {
        return ResponseEntity.ok(butacaService.actualizarButaca(butaca));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarButaca(@PathVariable Long id) throws ResourceNotFoundException {
        butacaService.eliminarButaca(id);
        return ResponseEntity.ok("Eliminación de la Butaca con id = " + id + " con éxito");
    }
}
