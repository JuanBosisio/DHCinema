package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Pelicula;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.PeliculaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/peliculas")
@CrossOrigin
public class PeliculaController {

    @Autowired
    private PeliculaService peliculaService;

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarPelicula(@PathVariable Long id) throws ResourceNotFoundException {
        peliculaService.eliminarPelicula(id);
        return ResponseEntity.ok("Eliminación de la Pelicula con id = " + id + ", con éxito");
    }

    @PostMapping
    public ResponseEntity<Pelicula> guardarPelicula(@RequestBody Pelicula pelicula) throws ResourceBadRequestException {
        return ResponseEntity.ok(peliculaService.guardarPelicula(pelicula));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pelicula> buscarPelicula(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok(peliculaService.buscarPelicula(id).get());
    }

    @GetMapping("/titulo/{titulo}")
    public ResponseEntity<List<Pelicula>> buscarPeliculaPorTitulo(@PathVariable String titulo) throws ResourceNotFoundException {
        return ResponseEntity.ok(peliculaService.buscarPeliculaPorTitulo(titulo));
    }

    @GetMapping
    public ResponseEntity<List<Pelicula>> buscarTodasPeliculas() throws ResourceNoContentException {
        return ResponseEntity.ok(peliculaService.buscarTodasPeliculas());
    }

    @PutMapping
    public ResponseEntity<Pelicula> actualizarPelicula(@RequestBody Pelicula pelicula) throws ResourceBadRequestException, ResourceNotFoundException {
        return ResponseEntity.ok(peliculaService.actualizarPelicula(pelicula));
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Pelicula>> buscarPeliculasPorTitulo(@PathVariable String categoria) throws ResourceNoContentException {
        return ResponseEntity.ok(peliculaService.buscarPeliculasPorTitulo(categoria));
    }

    @GetMapping("/random")
    public ResponseEntity<List<Pelicula>> OchoPeliculasRandom() throws ResourceBadRequestException {
        return ResponseEntity.ok(peliculaService.OchoPeliculasRandom());
    }

    @GetMapping("/pagina/{pagina}")
    public ResponseEntity<Page<Pelicula>> paginacion(@PathVariable Integer pagina){
        return ResponseEntity.ok(peliculaService.paginacion(PageRequest.of(pagina,12)));
    }

    @GetMapping("/pagina/{pagina}/{titulo}")
    public ResponseEntity<Page<Pelicula>> paginacionPorCategoria(@PathVariable Integer pagina, @PathVariable String titulo){
        return ResponseEntity.ok(peliculaService.paginacionPorCategoria(PageRequest.of(pagina,12), titulo));
    }
}
