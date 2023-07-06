package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.*;
import com.example.PIBackEnd.dtos.ButacaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IButacaRepository;
import com.example.PIBackEnd.repository.IFuncionRepository;
import com.example.PIBackEnd.repository.IUsuarioRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ButacaService {

    private static final Logger logger = Logger.getLogger(ButacaService.class);

    private IButacaRepository butacaRepository;

    private IUsuarioRepository usuarioRepository;

    private IFuncionRepository funcionRepository;

    @Autowired
    public ButacaService(IButacaRepository butacaRepository, IUsuarioRepository usuarioRepository, IFuncionRepository funcionRepository) {
        this.butacaRepository = butacaRepository;
        this.usuarioRepository = usuarioRepository;
        this.funcionRepository = funcionRepository;
    }

    public List<Butaca> buscarButacasPorIdFuncion(Long id) throws ResourceNoContentException {
        logger.info("Buscando todas las Butacas por Funcion con Id: " + id);
        List<Butaca> lista = butacaRepository.findAllByFuncion_Id(id);
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Butacas registradas para la Funcion con Id: " + id);
        }
    }

    public ButacaDTO actualizarButaca(ButacaDTO butaca) throws ResourceBadRequestException {
        logger.info("Actualizando Butaca");
        if(butaca.chequearAtributosVacios()){
            throw new ResourceBadRequestException("Error. La Butaca tiene que contener todos sus campos");
        }else{
            Optional<Butaca> butacaBuscada = butacaRepository.findByIdAndIdUsuarioNull(butaca.getId());
            if(butacaBuscada.isPresent()){
                Optional<Funcion> funacionBuscada = funcionRepository.findByIdAndVigente(butaca.getFuncion_id(), true);
                if(funacionBuscada.isEmpty()){
                    throw new ResourceBadRequestException("Error. No se encontró la Funcion con ID: " + butaca.getFuncion_id());
                }
                Optional<Usuario> usuarioBuscado = usuarioRepository.findByIdAndActivoTrue(butaca.getUsuario_id());
                if(usuarioBuscado.isEmpty()){
                    throw new ResourceBadRequestException("Error. No se encontró el Usuario con ID: " + butaca.getUsuario_id());
                }
                return convertirButacaaButacaDTO(butacaRepository.save(convertirButacaDTOaButaca(butaca)));
            }else{
                throw new ResourceBadRequestException("Error. La Butaca ya esta ocupada");
            }
        }
    }

    public void eliminarButacaCascadaFuncion(Long id){
        logger.warn("Borrando Butacas de Funcion con id = " + id);
        List<Butaca> butacas = butacaRepository.findAllByFuncion_Id(id);
        if (!butacas.isEmpty()){
            butacaRepository.deleteAll(butacas);
        }
    }

    public void eliminarButaca(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Butaca con id = " + id);
        Optional<Butaca> butacaBuscada = butacaRepository.findByIdAndIdUsuarioNotNull(id);
        if (butacaBuscada.isPresent()){
            butacaBuscada.get().setIdUsuario(null);
            butacaBuscada.get().setOcupado(false);
            butacaBuscada.get().setPago(false);
            butacaRepository.save(butacaBuscada.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe la Butaca con id = " + id + " o no esta ocupada");
        }
    }

    public void eliminarButacaCascada(Long id){
        logger.warn("Borrando Butaca con id = " + id);
        Optional<Butaca> butacaBuscada = butacaRepository.findById(id);
        if (butacaBuscada.isPresent()){
            butacaBuscada.get().setIdUsuario(null);
            butacaBuscada.get().setOcupado(false);
            butacaBuscada.get().setPago(false);
            butacaRepository.save(butacaBuscada.get());
        }
    }

    private Butaca convertirButacaDTOaButaca(ButacaDTO butacaDTO){
        Butaca butaca = new Butaca();
        Funcion funcion = new Funcion();

        butaca.setId(butacaDTO.getId());
        butaca.setOcupado(butacaDTO.getOcupado());
        butaca.setPago(butacaDTO.getPago());
        butaca.setIdUsuario(butacaDTO.getUsuario_id());
        funcion.setId(butacaDTO.getFuncion_id());

        butaca.setFuncion(funcion);

        return butaca;
    }

    private ButacaDTO convertirButacaaButacaDTO(Butaca butaca){
        ButacaDTO butacaDTO = new ButacaDTO();

        butacaDTO.setId(butaca.getId());
        butacaDTO.setOcupado(butaca.getOcupado());
        butacaDTO.setPago(butaca.getPago());
        butacaDTO.setFuncion_id(butaca.getFuncion().getId());
        butacaDTO.setUsuario_id(butaca.getIdUsuario());

        return butacaDTO;
    }
}
