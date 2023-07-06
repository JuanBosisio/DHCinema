package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Politica;
import com.example.PIBackEnd.dtos.PoliticaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IPoliticaRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PoliticaService {

    private static final Logger logger = Logger.getLogger(PoliticaService.class);

    private IPoliticaRepository politicaRepository;

    @Autowired
    public PoliticaService(IPoliticaRepository politicaRepository) {
        this.politicaRepository = politicaRepository;
    }

    public PoliticaDTO guardarPolitica(PoliticaDTO politicaDTO) throws ResourceBadRequestException {
        logger.info("Guardando Politicas nuevas");
        if(politicaDTO.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. Las Politicas tienen que contener todos sus campos");
        }
        return convertirPoliticaaPoliticaDTO(politicaRepository.save(convertirPoliticaDTOaPolitica(politicaDTO)));
    }

    public PoliticaDTO actualizarPolitica(PoliticaDTO politicaDTO) throws ResourceBadRequestException {
        logger.info("Actualizando Politicas");
        if(politicaDTO.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. Las Politicas tienen que contener todos sus campos");
        }
        return convertirPoliticaaPoliticaDTO(politicaRepository.save(convertirPoliticaDTOaPolitica(politicaDTO)));
    }

    public PoliticaDTO buscarPoliticaPorId(Long id) throws ResourceNotFoundException {
        logger.info("Buscando Politicas con id = " + id);
        Optional<Politica> politicaBuscada = politicaRepository.findById(id);
        if (politicaBuscada.isPresent()){
            return convertirPoliticaaPoliticaDTO(politicaBuscada.get());
        }
        else{
            throw new ResourceNotFoundException("Error. No existen las Politicas con id = " + id + ".");
        }
    }

    public List<PoliticaDTO> buscarTodasPoliticas() throws ResourceNoContentException {
        logger.info("Buscando todas las Politicas");
        List<Politica> lista = politicaRepository.findAll();
        if(!lista.isEmpty()){
            List<PoliticaDTO> politicasDto = new ArrayList<>();
            for (Politica politica:lista) {
                PoliticaDTO politicaDTOAGuardar = convertirPoliticaaPoliticaDTO(politica);
                politicasDto.add(politicaDTOAGuardar);
            }
            return politicasDto;
        }else{
            throw new ResourceNoContentException("Error. No existen Cines registrados.");
        }
    }

    private Politica convertirPoliticaDTOaPolitica(PoliticaDTO politicaDTO){
        Politica politica = new Politica();

        politica.setId(politicaDTO.getId());
        politica.setPoliticaDeCancelacion(politicaDTO.getPoliticaDeCancelacion());
        politica.setNormasDeLaSala(politicaDTO.getNormasDeLaSala());
        politica.setSaludYSeguridad(politicaDTO.getSaludYSeguridad());

        return politica;
    }

    private PoliticaDTO convertirPoliticaaPoliticaDTO(Politica politica){
        PoliticaDTO politicaDTO = new PoliticaDTO();

        politicaDTO.setId(politica.getId());
        politicaDTO.setPoliticaDeCancelacion(politica.getPoliticaDeCancelacion());
        politicaDTO.setNormasDeLaSala(politica.getNormasDeLaSala());
        politicaDTO.setSaludYSeguridad(politica.getSaludYSeguridad());

        return politicaDTO;
    }
}
