package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Categoria;
import com.example.PIBackEnd.domain.Pelicula;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.ICategoriaRepository;
import com.example.PIBackEnd.repository.IPeliculaRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CategoriaService {

    private static final Logger logger = Logger.getLogger(CategoriaService.class);

    private ICategoriaRepository categoriaRepository;

    private IPeliculaRepository peliculaRepository;

    @Autowired
    public CategoriaService(ICategoriaRepository categoriaRepository, IPeliculaRepository peliculaRepository) {
        this.categoriaRepository = categoriaRepository;
        this.peliculaRepository = peliculaRepository;
    }

    public Set<Categoria> guardarCategorias(Set<Categoria> categorias) {
        logger.info("Guardando Categoria nueva");
        Set<Categoria> nuevasCategorias = new HashSet<>();
        for (Categoria categoria : categorias) {
            Optional<Categoria> categoriaExistente = categoriaRepository.findByTituloAndVigenteTrue(categoria.getTitulo());
            if (categoriaExistente.isPresent()) {
                nuevasCategorias.add(categoriaExistente.get());
            } else {
                categoria.setVigente(true);
                categoriaRepository.save(categoria);
                nuevasCategorias.add(categoria);
            }
        }
        return nuevasCategorias;
    }

    public Categoria guardarCategoria(Categoria categoria) throws ResourceBadRequestException {
        logger.info("Guardando Categoria nueva");
        Optional<Categoria> optionalCategoria = categoriaRepository.findByTituloAndVigenteTrue(categoria.getTitulo());
        if (optionalCategoria.isPresent()){
            throw new ResourceBadRequestException("La categoría ya existe en la base de datos");
        } else {
            categoria.setVigente(true);
            return categoriaRepository.save(categoria);
        }
    }

    public List<Categoria> buscarTodasCategorias() throws ResourceNoContentException {
        logger.info("Buscando todas las Categorías");
        List<Categoria> lista = categoriaRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen categorías registradas.");
        }
    }

    public void eliminarCategoria(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Categoria con id = " + id);
        Optional<Categoria> categoriaBuscada = categoriaRepository.findByIdAndVigenteTrue(id);
        if (categoriaBuscada.isPresent()){
            categoriaBuscada.get().setVigente(false);
            categoriaRepository.save(categoriaBuscada.get());
            List<Pelicula> peliculas = peliculaRepository.findByCategoriasId(id);
            for (Pelicula pelicula:peliculas) {
                Set<Categoria> categorias = pelicula.getCategorias();
                Set<Categoria> nuevasCategorias = new HashSet<>();
                for (Categoria categoria : categorias) {
                    Optional<Categoria> categoriaExistente = categoriaRepository.findByTituloAndVigenteTrue(categoria.getTitulo());
                    if (categoriaExistente.isPresent()) {
                        nuevasCategorias.add(categoriaExistente.get());
                    }
                }
                pelicula.setCategorias(nuevasCategorias);
                peliculaRepository.save(pelicula);
            }
        }else{
            throw new ResourceNotFoundException("Error. No existe la Categoria con id = " + id + " o no esta vigente");
        }
    }
}