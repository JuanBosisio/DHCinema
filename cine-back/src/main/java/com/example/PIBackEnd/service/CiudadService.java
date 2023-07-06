package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Cine;
import com.example.PIBackEnd.domain.Ciudad;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.ICiudadRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CiudadService {

    private static final Logger logger = Logger.getLogger(CiudadService.class);

    private ICiudadRepository ciudadRepository;

    private CineService cineService;

    @Autowired
    public CiudadService(ICiudadRepository ciudadRepository, CineService cineService) {
        this.ciudadRepository = ciudadRepository;
        this.cineService = cineService;
    }

    public Ciudad guardarCiudad(Ciudad ciudad) throws ResourceBadRequestException {
        logger.info("Guardando Ciudad nueva");
        if (ciudad.chequearAtributosVacios()) {
            throw new ResourceBadRequestException("Error. La Ciudad tiene que contener todos sus campos");
        }else{
            Optional<Ciudad> optionalCiudad = ciudadRepository.findByNombreAndVigenteTrue(ciudad.getNombre());
            if(optionalCiudad.isPresent()){
                throw new ResourceBadRequestException("Error. Ya existe Ciudad con nombre: " + ciudad.getNombre());
            }else{
                ciudad.setVigente(true);
                return ciudadRepository.save(ciudad);
            }
        }
    }

    public Ciudad actualizarCiudad(Ciudad ciudad) throws ResourceBadRequestException, ResourceNotFoundException {
        logger.info("Actualizando Ciudad");
        if (ciudad.chequearAtributosVacios()) {
            throw new ResourceBadRequestException("Error. La Ciudad tiene que contener todos sus campos");
        }else{
            Optional<Ciudad> optionalCiudad = ciudadRepository.findByIdAndVigenteTrue(ciudad.getId());
            if(optionalCiudad.isPresent()){
                Optional<Ciudad> ciudadPorNombre = ciudadRepository.findByNombreAndVigenteTrue(ciudad.getNombre());
                if (ciudadPorNombre.isPresent() && !ciudadPorNombre.get().getId().equals(ciudad.getId())) {
                    throw new ResourceBadRequestException("Error. Ya existe Ciudad con nombre: " + ciudad.getNombre());
                }else{
                    ciudad.setCines(optionalCiudad.get().getCines());
                    ciudad.setVigente(true);
                    return ciudadRepository.save(ciudad);
                }
            }else{
                throw new ResourceNotFoundException("Error. La Ciudad con nombre = " + ciudad.getNombre() + " no existe o ya no esta vigente");
            }
        }
    }

    public List<Ciudad> buscarTodasCiudades() throws ResourceNoContentException {
        logger.info("Buscando todas las Ciudades");
        List<Ciudad> lista = ciudadRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Ciudades registradas.");
        }
    }

    public Ciudad buscarCiudadPorId(Long id) throws ResourceNotFoundException {
        logger.info("Buscando Ciudad con ID: " + id);
        Optional<Ciudad> ciudadBuscada = ciudadRepository.findByIdAndVigenteTrue(id);
        if(ciudadBuscada.isPresent()){
            return ciudadBuscada.get();
        }
        else{
            throw new ResourceNotFoundException("Error. No existe la Ciudad con ID = " + id + ".");
        }
    }

    public void eliminarCiudad(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Ciudad con id = " + id);
        Optional<Ciudad> ciudadBuscado = ciudadRepository.findByIdAndVigenteTrue(id);
        if (ciudadBuscado.isPresent()){
            ciudadBuscado.get().setVigente(false);
            Set<Cine> cines = ciudadBuscado.get().getCines();
            for (Cine cine:cines) {
                cineService.eliminarCineCascada(cine.getId());
            }
            ciudadRepository.save(ciudadBuscado.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe la Ciudad con id = " + id + " o no esta vigente");
        }
    }
}
