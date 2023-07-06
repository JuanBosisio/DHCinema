package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.*;
import com.example.PIBackEnd.dtos.FavoritoDTO;
import com.example.PIBackEnd.dtos.ReservaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IFavoritoRepository;
import com.example.PIBackEnd.repository.IPeliculaRepository;
import com.example.PIBackEnd.repository.IUsuarioRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FavoritoService {

    private static final Logger logger = Logger.getLogger(FavoritoService.class);

    private IFavoritoRepository iFavoritoRepository;

    private IPeliculaRepository peliculaRepository;

    private IUsuarioRepository usuarioRepository;

    @Autowired
    public FavoritoService(IFavoritoRepository iFavoritoRepository, IPeliculaRepository peliculaRepository, IUsuarioRepository usuarioRepository) {
        this.iFavoritoRepository = iFavoritoRepository;
        this.peliculaRepository = peliculaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public FavoritoDTO guardarFavorito(FavoritoDTO favorito) throws ResourceBadRequestException {
        logger.info("Guardando en tabla Favoritos");
        if(favorito.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. El Favorito tiene que contener todos sus campos");
        }else{
            Optional<Pelicula> peliculaBuscada = peliculaRepository.findByIdAndVigente(favorito.getPelicula_id(), true);
            Optional<Usuario> usuarioBuscado = usuarioRepository.findByIdAndActivoTrue(favorito.getUsuario_id());
            if (peliculaBuscada.isEmpty()) throw new ResourceBadRequestException("Error. No se encontró la Pelicula con ID: " + favorito.getPelicula_id());
            if (usuarioBuscado.isEmpty()) throw new ResourceBadRequestException("Error. No se encontró el Usuario con ID: " + favorito.getUsuario_id());

            boolean existe = iFavoritoRepository.existsByUsuarioAndPelicula(usuarioBuscado.get(),peliculaBuscada.get());
            if(existe){
                throw new ResourceBadRequestException("Error. El favorito ya existe para el Usuario y la Película");
            }

            return convertirFavoritoaFavoritoDTO(iFavoritoRepository.save(convertirFavoritoDTOaFavorito(favorito)));
        }
    }

    public FavoritoDTO actualizarFavorito(Long id) throws ResourceNotFoundException {
        logger.warn("Actualizando Favorito con id = " + id);
        Optional<Favorito> fav = iFavoritoRepository.findById(id);
        if(fav.isEmpty()){
            throw new ResourceNotFoundException("Error. No existe el Favorito con id = " + id);
        }else{
            Favorito favorito = fav.get();
            favorito.setFavorito(!favorito.getFavorito());
            return convertirFavoritoaFavoritoDTO(iFavoritoRepository.save(favorito));
        }
    }

    public List<FavoritoDTO> buscarFavoritosPorUsuario(String email) throws ResourceNoContentException {
        logger.info("Buscando todos los Favoritos para Usuario con email = " + email);
        List<Favorito> favoritos = iFavoritoRepository.findAllByVigenteTrueAndUsuario_Email(email);
        if(!favoritos.isEmpty()){
            List<FavoritoDTO> favoritosDto = new ArrayList<>();
            for (Favorito fav:favoritos) {
                FavoritoDTO favoritoDTOAGuardar = convertirFavoritoaFavoritoDTO(fav);
                favoritosDto.add(favoritoDTOAGuardar);
            }
            return favoritosDto;
        }else{
            throw new ResourceNoContentException("Error. No existen Favoritos registrados o no estan vigentes.");
        }
    }

    public void eliminarFavoritoCascada(Long id){
        logger.warn("Borrando Favorito con id = " + id);
        Optional<Favorito> favoritoBuscado = iFavoritoRepository.findByIdAndVigenteTrue(id);
        if (favoritoBuscado.isPresent()){
            favoritoBuscado.get().setVigente(false);
            iFavoritoRepository.save(favoritoBuscado.get());
        }
    }

    private Favorito convertirFavoritoDTOaFavorito(FavoritoDTO favoritoDTO){
        Favorito favorito = new Favorito();
        Pelicula pelicula= new Pelicula();
        Usuario usuario = new Usuario();

        favorito.setId(favoritoDTO.getId());
        favorito.setFavorito(true);
        favorito.setVigente(true);
        pelicula.setId(favoritoDTO.getPelicula_id());
        usuario.setId(favoritoDTO.getUsuario_id());

        favorito.setPelicula(pelicula);
        favorito.setUsuario(usuario);

        return favorito;
    }

    private FavoritoDTO convertirFavoritoaFavoritoDTO(Favorito favorito){
        FavoritoDTO favoritoDTO = new FavoritoDTO();

        favoritoDTO.setId(favorito.getId());
        favoritoDTO.setPelicula_id(favorito.getPelicula().getId());
        favoritoDTO.setUsuario_id(favorito.getUsuario().getId());
        favoritoDTO.setFavorito(favorito.getFavorito());
        favoritoDTO.setVigente(favorito.getVigente());

        return favoritoDTO;
    }
}
