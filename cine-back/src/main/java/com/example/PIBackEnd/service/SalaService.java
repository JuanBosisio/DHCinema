package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Cine;
import com.example.PIBackEnd.domain.Funcion;
import com.example.PIBackEnd.domain.Sala;
import com.example.PIBackEnd.dtos.SalaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IButacaRepository;
import com.example.PIBackEnd.repository.ICineRepository;
import com.example.PIBackEnd.repository.ISalaRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class SalaService {

    private static final Logger logger = Logger.getLogger(SalaService.class);

    private ISalaRepository salaRepository;

    private ICineRepository cineRepository;

    private FuncionService funcionService;

    @Autowired
    private IButacaRepository butacaRepository;

    @Autowired
    public SalaService(ISalaRepository salaRepository, ICineRepository cineRepository, FuncionService funcionService) {
        this.salaRepository = salaRepository;
        this.cineRepository = cineRepository;
        this.funcionService = funcionService;
    }

    public SalaDTO guardarSala(SalaDTO sala) throws ResourceBadRequestException {
        logger.info("Guardando Sala nueva");
        if (sala.chequearAtributosVacios()) {
            throw new ResourceBadRequestException("Error. La Sala tiene que contener todos sus campos");
        }else{
            Optional<Sala> optionalSala = salaRepository.findByNombreAndCine_IdAndVigenteTrue(sala.getNombre(), sala.getCine_id());
            if(optionalSala.isPresent()){
                throw new ResourceBadRequestException("Error. Ya existe Sala con nombre: " + sala.getNombre());
            }else{
                Optional<Cine> optionalCine = cineRepository.findByIdAndVigenteTrue(sala.getCine_id());
                if(optionalCine.isPresent()){
                    return convertirSalaaSalaDTO(salaRepository.save(convertirSalaDTOaSala(sala)));
                }else{
                    throw new ResourceBadRequestException("Error. No se encontró el Cine con ID: " + sala.getCine_id());
                }
            }
        }
    }

    public List<Sala> buscarTodasSalas() throws ResourceNoContentException {
        logger.info("Buscando todas los Salas");
        List<Sala> lista = salaRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Salas registradas.");
        }
    }

    public SalaDTO actualizarSala(SalaDTO sala) throws ResourceBadRequestException, ResourceNotFoundException {
        logger.info("Actualizando Sala");
        if(sala.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. La Sala tiene que contener todos sus campos");
        }else{
            Optional<Sala> optionalSala = salaRepository.findByIdAndVigenteTrue(sala.getId());
            if(optionalSala.isPresent()){
                Optional<Sala> salaPorNombre = salaRepository.findByNombreAndCine_IdAndVigenteTrue(sala.getNombre(), sala.getCine_id());
                if (salaPorNombre.isPresent()) {
                    throw new ResourceBadRequestException("Error. Ya existe Sala con nombre: " + sala.getNombre());
                }else{
                    Optional<Cine> optionalCine = cineRepository.findByIdAndVigenteTrue(sala.getCine_id());
                    if(optionalCine.isPresent()){
                        Sala salaAGuardar = convertirSalaDTOaSala(sala);
                        salaAGuardar.setFunciones(optionalSala.get().getFunciones());
                        return convertirSalaaSalaDTO(salaRepository.save(salaAGuardar));
                    }else{
                        throw new ResourceBadRequestException("Error. No se encontró el Cine con ID: " + sala.getCine_id());
                    }
                }
            }else{
                throw new ResourceNotFoundException("Error. La Sala con nombre = " + sala.getNombre() + " no existe o ya no esta vigente");
            }
        }
    }

    public void eliminarSala(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Sala con id = " + id);
        Optional<Sala> salaBuscada = salaRepository.findByIdAndVigenteTrue(id);
        if (salaBuscada.isPresent()){
            salaBuscada.get().setVigente(false);
            Set<Funcion> funciones = salaBuscada.get().getFunciones();
            for (Funcion funcion:funciones) {
                funcionService.eliminarFuncionCascada(funcion.getId());
            }
            salaRepository.save(salaBuscada.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe la Sala con id = " + id + " o no esta vigente");
        }
    }

    public void eliminarSalaCascada(Long id){
        logger.warn("Borrando Sala con id = " + id);
        Optional<Sala> salaBuscada = salaRepository.findByIdAndVigenteTrue(id);
        if (salaBuscada.isPresent()){
            salaBuscada.get().setVigente(false);
            Set<Funcion> funciones = salaBuscada.get().getFunciones();
            for (Funcion funcion:funciones) {
                funcionService.eliminarFuncionCascada(funcion.getId());
            }
            salaRepository.save(salaBuscada.get());
        }
    }

    private Sala convertirSalaDTOaSala(SalaDTO salaDTO){
        Sala sala = new Sala();
        Cine cine = new Cine();

        sala.setId(salaDTO.getId());
        sala.setNombre(salaDTO.getNombre());
        sala.setVigente(true);
        cine.setId(salaDTO.getCine_id());

        sala.setCine(cine);

        return sala;
    }

    private SalaDTO convertirSalaaSalaDTO(Sala sala){
        SalaDTO salaDTO = new SalaDTO();

        salaDTO.setId(sala.getId());
        salaDTO.setNombre(sala.getNombre());
        salaDTO.setCine_id(sala.getCine().getId());

        return salaDTO;
    }
}
