package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.*;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IImagenRepository;
import com.example.PIBackEnd.repository.IPeliculaRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PeliculaService {

    private static final Logger logger = Logger.getLogger(PeliculaService.class);

    private IPeliculaRepository peliculaRepository;

    private CategoriaService categoriaService;

    private FuncionService funcionService;

    private IImagenRepository imagenRepository;

    private FavoritoService favoritoService;

    @Autowired
    public PeliculaService(IPeliculaRepository peliculaRepository, CategoriaService categoriaService, FuncionService funcionService, IImagenRepository imagenRepository, FavoritoService favoritoService) {
        this.peliculaRepository = peliculaRepository;
        this.categoriaService = categoriaService;
        this.funcionService = funcionService;
        this.imagenRepository = imagenRepository;
        this.favoritoService = favoritoService;
    }

    public Pelicula guardarPelicula(Pelicula pelicula) throws ResourceBadRequestException {
        logger.info("Guardando Pelicula nueva");
        if (pelicula.chequearAtributosVacios()) {
            throw new ResourceBadRequestException("Error. La Pelicula tiene que contener todos sus campos");
        } else {
            String titulo = pelicula.getTitulo();
            if (peliculaRepository.findByTitulo(titulo).isPresent()) {
                throw new ResourceBadRequestException("Error. Ya existe una Pelicula con el mismo titulo");
            } else {
                Set<Categoria> nuevasCategorias = categoriaService.guardarCategorias(pelicula.getCategorias());

                pelicula.setCategorias(nuevasCategorias);
                pelicula.setVigente(true);

                Set<Imagen> imagenes = pelicula.getImagenes();
                Set<String> urls = new HashSet<>();

                for(Imagen imagen : imagenes){
                    String url = imagen.getImagen();
                    if (urls.contains(url)) {
                        throw new ResourceBadRequestException("Error. Las imágenes contienen elementos duplicados");
                    }
                    urls.add(url);
                }

                Set<Imagen> imagenNuevas = new HashSet<>();
                for(Imagen imagen : imagenes){
                    Optional<Imagen> imagenBuscada = imagenRepository.findByImagen(imagen.getImagen());
                    if(imagenBuscada.isPresent()){
                        throw new ResourceBadRequestException("Error. La Imagen con URL: " + imagen.getImagen() + ", esta asignada a otra pelicula");
                    }else{
                        imagenNuevas.add(imagen);
                    }
                }
                pelicula.setImagenes(imagenNuevas);

                Pelicula peliculaGuardada = peliculaRepository.save(pelicula);

                for(Imagen imagen : peliculaGuardada.getImagenes()){
                    imagen.setPelicula(peliculaGuardada);
                    imagenRepository.save(imagen);
                }
                return peliculaGuardada;
            }
        }
    }

    public Pelicula actualizarPelicula(Pelicula pelicula) throws ResourceNotFoundException, ResourceBadRequestException {
        logger.info("Actualizando Pelicula con id " + pelicula.getId());
        Optional<Pelicula> peliculaBuscada = peliculaRepository.findByIdAndVigente(pelicula.getId(),true);
        if (peliculaBuscada.isPresent()) {
            if (pelicula.chequearAtributosVacios()) {
                throw new ResourceBadRequestException("Error. La Pelicula tiene que contener todos sus campos");
            } else {
                String titulo = pelicula.getTitulo();
                Optional<Pelicula> peliculaBuscadaPorTitulo = peliculaRepository.findByTitulo(titulo);
                if (peliculaBuscadaPorTitulo.isPresent() && !peliculaBuscadaPorTitulo.get().getId().equals(pelicula.getId())) {
                    throw new ResourceBadRequestException("Error. Ya existe una Pelicula con el mismo titulo");
                } else {
                    Set<Categoria> nuevasCategorias = categoriaService.guardarCategorias(pelicula.getCategorias());

                    pelicula.setCategorias(nuevasCategorias);
                    pelicula.setVigente(true);

                    Set<Imagen> imagenes = pelicula.getImagenes();
                    Set<String> urls = new HashSet<>();

                    for (Imagen imagen : imagenes) {
                        String url = imagen.getImagen();
                        if (urls.contains(url)) {
                            throw new ResourceBadRequestException("Error. Las imágenes contienen elementos duplicados");
                        }
                        urls.add(url);
                    }

                    Set<Imagen> imagenNuevas = new HashSet<>();
                    for (Imagen imagen : imagenes) {
                        Optional<Imagen> imagenBuscada = imagenRepository.findByImagen(imagen.getImagen());
                        if (imagenBuscada.isPresent() && imagenBuscada.get().getPelicula().getId().equals(pelicula.getId())) {
                            imagenNuevas.add(imagenBuscada.get());
                        }else if(imagenBuscada.isPresent() && !imagenBuscada.get().getPelicula().getId().equals(pelicula.getId())){
                            throw new ResourceBadRequestException("Error. La Imagen con URL: " + imagen.getImagen() + ", esta asignada a otra pelicula");
                        }else if(imagenBuscada.isEmpty()){
                            imagen.setPelicula(pelicula);
                            imagenRepository.save(imagen);
                            imagenNuevas.add(imagen);
                        }
                    }
                    pelicula.setImagenes(imagenNuevas);

                    pelicula.setFunciones(peliculaBuscada.get().getFunciones());

                    return peliculaRepository.save(pelicula);
                }
            }
        } else{
            throw new ResourceNotFoundException("Error. La pelicula con id = " + pelicula.getId() + " no existe o ya no esta vigente");
        }
    }

    public void eliminarPelicula(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Pelicula con id = " + id);
        Optional<Pelicula> peliculaBuscada = peliculaRepository.findByIdAndVigente(id,true);
        if (peliculaBuscada.isPresent()){
            peliculaBuscada.get().setVigente(false);
            Set<Funcion> funciones = peliculaBuscada.get().getFunciones();
            for (Funcion funcion:funciones) {
                funcionService.eliminarFuncionCascada(funcion.getId());
            }
            Set<Favorito> favoritos = peliculaBuscada.get().getFavoritos();
            for (Favorito favorito:favoritos) {
                favoritoService.eliminarFavoritoCascada(favorito.getId());
            }
            peliculaRepository.save(peliculaBuscada.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe la Pelicula con id = " + id + " o no esta vigente");
        }
    }

    public List<Pelicula> buscarPeliculaPorTitulo(String parteDelTitulo) throws ResourceNotFoundException {
        logger.info("Buscando Peliculas con titulo o parte del titulo: " + parteDelTitulo);
        List<Pelicula> peliculasBuscadas = peliculaRepository.findByTituloContainingIgnoreCaseAndVigente(parteDelTitulo, true);
        if (!peliculasBuscadas.isEmpty()){
            return peliculasBuscadas;
        }
        else{
            throw new ResourceNotFoundException("Error. No existen Peliculas con titulo o parte del titulo: " + parteDelTitulo + ".");
        }
    }

    public Optional<Pelicula> buscarPelicula(Long id) throws ResourceNotFoundException {
        logger.info("Buscando Pelicula con id = " + id);
        Optional<Pelicula> peliculaBuscada = peliculaRepository.findByIdAndVigente(id,true);
        if(peliculaBuscada.isPresent()){
            return peliculaBuscada;
        }
        else{
            throw new ResourceNotFoundException("Error. No existe la Pelicula con id = " + id + ".");
        }
    }

    public List<Pelicula> buscarPeliculasPorTitulo(String titulo) throws ResourceNoContentException {
        logger.info("Buscando todas las Peliculas por categoria");

        List<Pelicula> todasLasPeliculas = peliculaRepository.findAllByVigenteTrue();
        List<Pelicula> peliculasEncontradas = new ArrayList<>();
        for (Pelicula pelicula : todasLasPeliculas) {
            for (Categoria categoriaPelicula : pelicula.getCategorias()) {
                if (categoriaPelicula.getTitulo().equals(titulo)) {
                    peliculasEncontradas.add(pelicula);
                    break;
                }
            }
        }
        if(!peliculasEncontradas.isEmpty()){
            return peliculasEncontradas;
        }else{
            throw new ResourceNoContentException("Error. No existen Peliculas registradas con categoria: " + titulo + ".");
        }
    }

    public List<Pelicula> buscarTodasPeliculas() throws ResourceNoContentException {
        logger.info("Buscando todas las Peliculas");
        List<Pelicula> lista = peliculaRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Peliculas registradas.");
        }
    }

    public List<Pelicula> OchoPeliculasRandom() throws ResourceBadRequestException {
        logger.info("Creando lista de 8 Peliculas random");
        List<Pelicula> listaPeliculas = peliculaRepository.findAllByVigenteTrue();
        if(listaPeliculas.size() > 8){
            List<Pelicula> peliculasRandom = new ArrayList<>();
            int tamanoLista = listaPeliculas.size();
            Random random = new Random();
            while (peliculasRandom.size() < 8) {
                int indiceAleatorio = random.nextInt(tamanoLista);
                Pelicula peliculaAleatoria = listaPeliculas.get(indiceAleatorio);
                if(!peliculasRandom.contains(peliculaAleatoria)){
                    peliculasRandom.add(peliculaAleatoria);
                }
            }
            return peliculasRandom;
        }else{
            throw new ResourceBadRequestException("Error. Debe haber mas de 8 peliculas");
        }
    }

    public Page<Pelicula> paginacion(Pageable pageable){
        return peliculaRepository.findAllByVigenteTrue(pageable);
    }

    public Page<Pelicula> paginacionPorCategoria(Pageable pageable, String titulo){
        return peliculaRepository.findByCategoriasTitulo(titulo, pageable);
    }
}
