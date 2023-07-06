package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Cine;
import com.example.PIBackEnd.domain.Ciudad;
import com.example.PIBackEnd.domain.Funcion;
import com.example.PIBackEnd.domain.Sala;
import com.example.PIBackEnd.dtos.CineDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.ICineRepository;
import com.example.PIBackEnd.repository.ICiudadRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CineService {

    private static final Logger logger = Logger.getLogger(CineService.class);

    private ICineRepository cineRepository;

    private ICiudadRepository ciudadRepository;

    private SalaService salaService;

    @Autowired
    public CineService(ICineRepository cineRepository, ICiudadRepository ciudadRepository, SalaService salaService) {
        this.cineRepository = cineRepository;
        this.ciudadRepository = ciudadRepository;
        this.salaService = salaService;
    }

    public CineDTO guardarCine(CineDTO cine) throws ResourceBadRequestException {
        logger.info("Guardando Cine nuevo");
        if(cine.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. El Cine tiene que contener todos sus campos");
        }else{
            Optional<Cine> optionalCine = cineRepository.findByNombreAndVigenteTrue(cine.getNombre());
            if(optionalCine.isPresent()){
                throw new ResourceBadRequestException("Error. Ya existe Cine con nombre: " + cine.getNombre());
            }else{
                Optional<Ciudad> optionalCiudad = ciudadRepository.findByIdAndVigenteTrue(cine.getCiudad_id());
                if(optionalCiudad.isPresent()){
                    return convertirCineaCineDTO(cineRepository.save(convertirCineDTOaCine(cine)));
                }else{
                    throw new ResourceBadRequestException("Error. No se encontró la Ciudad con ID: " + cine.getCiudad_id());
                }
            }
        }
    }

    public List<Cine> buscarTodosCines() throws ResourceNoContentException {
        logger.info("Buscando todos los Cines");
        List<Cine> lista = cineRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Cines registrados.");
        }
    }

    public CineDTO actualizarCine(CineDTO cine) throws ResourceBadRequestException, ResourceNotFoundException {
        logger.info("Actualizando Cine");
        if(cine.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. El Cine tiene que contener todos sus campos");
        }else{
            Optional<Cine> optionalCine = cineRepository.findByIdAndVigenteTrue(cine.getId());
            if(optionalCine.isPresent()){
                Optional<Cine> cinePorNombre = cineRepository.findByNombreAndVigenteTrue(cine.getNombre());
                if (cinePorNombre.isPresent() && !cinePorNombre.get().getId().equals(cine.getId())) {
                    throw new ResourceBadRequestException("Error. Ya existe Cine con nombre: " + cine.getNombre());
                }else{
                    Optional<Ciudad> optionalCiudad = ciudadRepository.findByIdAndVigenteTrue(cine.getCiudad_id());
                    if(optionalCiudad.isPresent()){
                        Cine cineAGuardar = convertirCineDTOaCine(cine);
                        cineAGuardar.setSalas(optionalCine.get().getSalas());
                        return convertirCineaCineDTO(cineRepository.save(cineAGuardar));
                    }else{
                        throw new ResourceBadRequestException("Error. No se encontró la Ciudad con ID: " + cine.getCiudad_id());
                    }
                }
            }else{
                throw new ResourceNotFoundException("Error. El Cine con nombre = " + cine.getNombre() + " no existe o ya no esta vigente");
            }
        }
    }

    public Cine buscarCinePorId(Long id) throws ResourceNotFoundException {
        logger.info("Buscando Cine con id = " + id);
        Optional<Cine> cineBuscado = cineRepository.findByIdAndVigenteTrue(id);
        if (cineBuscado.isPresent()){
            return cineBuscado.get();
        }
        else{
            throw new ResourceNotFoundException("Error. No existe el Cine con id = " + id + ".");
        }
    }

    public List<Cine> buscarCinesPorTituloPelicula(String titulo){
        List<Cine> lista = cineRepository.findAllByVigenteTrue();
        List<Cine> cinesNuevos = new ArrayList<>();
        for (Cine cine:lista) {
            Set<Sala> salas = cine.getSalas();
            for (Sala sala:salas) {
                Set<Funcion> funciones = sala.getFunciones();
                for (Funcion funcion:funciones) {
                    if (funcion.getPelicula().getTitulo().equals(titulo) && (!cinesNuevos.contains(cine))) {
                        cinesNuevos.add(cine);
                    }
                }
            }
        }
        return cinesNuevos;
    }

    public Cine buscarCinePorNombre(String nombre) throws ResourceNotFoundException {
        logger.info("Buscando Cine con nombre = " + nombre);
        Optional<Cine> cineBuscado = cineRepository.findByNombreAndVigenteTrue(nombre);
        if(cineBuscado.isPresent()){
            return cineBuscado.get();
        }else{
            throw new ResourceNotFoundException("Error. No existe el Cine con nombre = " + nombre + " o no esta vigente");
        }
    }

    public void eliminarCine(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Cine con id = " + id);
        Optional<Cine> cineBuscado = cineRepository.findByIdAndVigenteTrue(id);
        if (cineBuscado.isPresent()){
            cineBuscado.get().setVigente(false);
            Set<Sala> salas = cineBuscado.get().getSalas();
            for (Sala sala:salas) {
                salaService.eliminarSalaCascada(sala.getId());
            }
            cineRepository.save(cineBuscado.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe el Cine con id = " + id + " o no esta vigente");
        }
    }

    public void eliminarCineCascada(Long id){
        logger.warn("Borrando Cine con id = " + id);
        Optional<Cine> cineBuscado = cineRepository.findByIdAndVigenteTrue(id);
        if (cineBuscado.isPresent()){
            cineBuscado.get().setVigente(false);
            Set<Sala> salas = cineBuscado.get().getSalas();
            for (Sala sala:salas) {
                salaService.eliminarSalaCascada(sala.getId());
            }
            cineRepository.save(cineBuscado.get());
        }
    }

    private Cine convertirCineDTOaCine(CineDTO cineDTO){
        Cine cine = new Cine();
        Ciudad ciudad = new Ciudad();

        cine.setId(cineDTO.getId());
        cine.setNombre(cineDTO.getNombre());
        cine.setDireccion(cineDTO.getDireccion());
        cine.setLatitud(cineDTO.getLatitud());
        cine.setLongitud(cineDTO.getLongitud());
        cine.setVigente(true);
        ciudad.setId(cineDTO.getCiudad_id());

        cine.setCiudad(ciudad);

        return cine;
    }

    private CineDTO convertirCineaCineDTO(Cine cine){
        CineDTO cineDTO = new CineDTO();

        cineDTO.setId(cine.getId());
        cineDTO.setNombre(cine.getNombre());
        cineDTO.setDireccion(cine.getDireccion());
        cineDTO.setLatitud(cine.getLatitud());
        cineDTO.setLongitud(cine.getLongitud());
        cineDTO.setCiudad_id(cine.getCiudad().getId());

        return cineDTO;
    }
}
