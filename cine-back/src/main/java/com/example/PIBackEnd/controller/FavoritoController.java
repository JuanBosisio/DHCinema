package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Favorito;
import com.example.PIBackEnd.dtos.FavoritoDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.FavoritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/favoritos")
@CrossOrigin
public class FavoritoController {
    @Autowired
    private FavoritoService favoritoService;

    @PostMapping
    public ResponseEntity<FavoritoDTO> guardoFavorito(@RequestBody FavoritoDTO favorito) throws ResourceBadRequestException{
        return ResponseEntity.ok(favoritoService.guardarFavorito(favorito));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FavoritoDTO> actualizarFavorito(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok(favoritoService.actualizarFavorito(id));
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<FavoritoDTO>> buscarFavoritosPorUsuario(@PathVariable String email) throws ResourceNoContentException{
        return ResponseEntity.ok(favoritoService.buscarFavoritosPorUsuario(email));
    }
}
