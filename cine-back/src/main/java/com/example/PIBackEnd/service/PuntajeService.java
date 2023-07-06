package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Pelicula;
import com.example.PIBackEnd.domain.Puntaje;
import com.example.PIBackEnd.domain.Usuario;
import com.example.PIBackEnd.dtos.PuntajeDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.repository.IPeliculaRepository;
import com.example.PIBackEnd.repository.IPuntajeRepository;
import com.example.PIBackEnd.repository.IUsuarioRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PuntajeService {

    private static final Logger logger = Logger.getLogger(PuntajeService.class);

    private IPuntajeRepository puntajeRepository;

    private IPeliculaRepository peliculaRepository;

    private IUsuarioRepository usuarioRepository;

    @Autowired
    public PuntajeService(IPuntajeRepository puntajeRepository, IPeliculaRepository peliculaRepository, IUsuarioRepository usuarioRepository) {
        this.puntajeRepository = puntajeRepository;
        this.peliculaRepository = peliculaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public PuntajeDTO guardarPuntaje(PuntajeDTO puntaje) throws ResourceBadRequestException {
        if(puntaje.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. El Puntaje tiene que contener todos sus campos");
        }else{
            Optional<Pelicula> peliculaBuscada = peliculaRepository.findById(puntaje.getPelicula_id());
            Optional<Usuario> usuarioBuscado = usuarioRepository.findById(puntaje.getUsuario_id());
            boolean existePuntaje = puntajeRepository.existsByUsuarioAndPelicula(usuarioBuscado.orElse(null),
                    peliculaBuscada.orElse(null));

            if(existePuntaje){
                throw new ResourceBadRequestException("Error. El usuario ya registró reseña o puntaje");
            }else{
                logger.info("Guardando en tabla puntaje");
                return convertirPuntajeaPuntajeDTO(puntajeRepository.save(convertirPuntajeDTOaPuntaje(puntaje)));
            }
        }
    }

    public List<PuntajeDTO> devolverPuntajes(Long id) throws ResourceNoContentException {
        logger.info("Devuelvo todos los puntajes y reseñas de la película");
        Optional<Pelicula> peliculaBuscada = peliculaRepository.findById(id);
        if (peliculaBuscada.isEmpty()) {
            throw new ResourceNoContentException("Error. La película no existe");
        }

        List<Puntaje> puntajes = puntajeRepository.findAllByPelicula(peliculaBuscada.get());
        List<PuntajeDTO> puntajesDto = new ArrayList<>();
        if(puntajes.isEmpty()){
            throw new ResourceNoContentException("Error. La película no tiene valoraciones");
        }else{
            for (Puntaje puntaje:puntajes) {
                PuntajeDTO puntajeDTOAGuardar = convertirPuntajeaPuntajeDTO(puntaje);
                puntajesDto.add(puntajeDTOAGuardar);
            }
        }
        return puntajesDto;
    }

    private Puntaje convertirPuntajeDTOaPuntaje(PuntajeDTO puntajeDTO){
        Puntaje puntaje = new Puntaje();
        Pelicula pelicula= new Pelicula();
        Usuario usuario = new Usuario();

        puntaje.setId(puntajeDTO.getId());
        puntaje.setPuntaje(puntajeDTO.getPuntaje());
        puntaje.setValoracion(puntajeDTO.getValoracion());

        pelicula.setId(puntajeDTO.getPelicula_id());
        usuario.setId(puntajeDTO.getUsuario_id());
        puntaje.setPelicula(pelicula);
        puntaje.setUsuario(usuario);

        return puntaje;
    }

    private PuntajeDTO convertirPuntajeaPuntajeDTO(Puntaje puntaje){
        PuntajeDTO puntajeDTO = new PuntajeDTO();

        puntajeDTO.setId(puntaje.getId());
        puntajeDTO.setPelicula_id(puntaje.getPelicula().getId());
        puntajeDTO.setUsuario_id(puntaje.getUsuario().getId());
        puntajeDTO.setPuntaje(puntaje.getPuntaje());
        puntajeDTO.setValoracion(puntaje.getValoracion());

        return puntajeDTO;
    }

}
