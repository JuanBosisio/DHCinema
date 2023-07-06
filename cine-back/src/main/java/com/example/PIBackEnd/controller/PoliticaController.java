package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.dtos.PoliticaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.PoliticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/politicas")
@CrossOrigin
public class PoliticaController {

    @Autowired
    private PoliticaService politicaService;

    @PostMapping
    public ResponseEntity<PoliticaDTO> guardarPolitica(@RequestBody PoliticaDTO politica) throws ResourceBadRequestException {
        return ResponseEntity.ok(politicaService.guardarPolitica(politica));
    }

    @GetMapping
    public ResponseEntity<List<PoliticaDTO>> buscarTodasPoliticas() throws ResourceNoContentException {
        return ResponseEntity.ok(politicaService.buscarTodasPoliticas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PoliticaDTO> buscarPoliticaPorId(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok(politicaService.buscarPoliticaPorId(id));
    }

    @PutMapping
    public ResponseEntity<PoliticaDTO> actualizarPolitica(@RequestBody PoliticaDTO politica) throws ResourceBadRequestException, ResourceNotFoundException {
        return ResponseEntity.ok(politicaService.actualizarPolitica(politica));
    }
}
