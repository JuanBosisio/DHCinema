package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.*;
import com.example.PIBackEnd.dtos.FuncionDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IFuncionRepository;
import com.example.PIBackEnd.repository.IPeliculaRepository;
import com.example.PIBackEnd.repository.ISalaRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Service
public class FuncionService {

    private static final Logger logger = Logger.getLogger(FuncionService.class);

    private IFuncionRepository funcionRepository;

    private ISalaRepository salaRepository;

    private IPeliculaRepository peliculaRepository;

    private ButacaService butacaService;

    @Autowired
    public FuncionService(IFuncionRepository funcionRepository, ISalaRepository salaRepository, IPeliculaRepository peliculaRepository, ButacaService butacaService) {
        this.funcionRepository = funcionRepository;
        this.salaRepository = salaRepository;
        this.peliculaRepository = peliculaRepository;
        this.butacaService = butacaService;
    }

    public FuncionDTO guardarFuncion(FuncionDTO funcion) throws ResourceBadRequestException {
        logger.info("Guardando Funcion nueva");
        if (funcion.chequearAtributosVacios()) {
            throw new ResourceBadRequestException("Error. La Funcion tiene que contener todos sus campos");
        }else{
            Optional<Sala> optionalSala = salaRepository.findByIdAndVigenteTrue(funcion.getSala_id());
            if(optionalSala.isEmpty()){
                throw new ResourceBadRequestException("Error. No se encontró la Sala con ID: " + funcion.getSala_id());
            }
            Optional<Pelicula> optionalPelicula = peliculaRepository.findByIdAndVigente(funcion.getPelicula_id(), true);
            if(optionalPelicula.isEmpty()){
                throw new ResourceBadRequestException("Error. No se encontró la Pelicula con ID: " + funcion.getPelicula_id());
            }

            LocalDate fechaActual = LocalDate.now();
            LocalTime horaActual = LocalTime.now();
            List<Funcion> lista = funcionRepository.findAllByVigenteTrue();
            if(funcion.getFechaProyeccion().isAfter(fechaActual) || (funcion.getFechaProyeccion().isEqual(fechaActual) && funcion.getHoraProyeccion().isAfter(horaActual))){
                for(Funcion func : lista){
                    if(Objects.equals(func.getSala().getId(), funcion.getSala_id()) && func.getFechaProyeccion().isEqual(funcion.getFechaProyeccion())){
                        Duration dif = Duration.between(func.getHoraProyeccion(), funcion.getHoraProyeccion());
                        long difHoras = Math.abs(dif.toHours());
                        if(difHoras < 4){
                            throw new ResourceBadRequestException("Error. Existe otra Funcion en esa Fecha con menos de 4 horas de diferencia entre ellas");
                        }
                    }
                }
                return convertirFuncionaFuncionDTO(funcionRepository.save(convertirFuncionDTOaFuncion(funcion)));
            }else{
                throw new ResourceBadRequestException("Error. La Fecha o la Hora son anteriores a la Fecha y Hora actual");
            }
        }
    }

    public List<Funcion> buscarTodasFunciones() throws ResourceNoContentException {
        logger.info("Buscando todas los Funciones");
        List<Funcion> lista = funcionRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Funciones registradas.");
        }
    }

    public List<Funcion> buscarFuncionesPorNombrePelicula(String peliculaNombre) throws ResourceNoContentException {
        List<Funcion> lista = funcionRepository.findAllByVigenteTrueAndPelicula_Titulo(peliculaNombre);
        List<Funcion> nuevaLista = new ArrayList<>();
        LocalDate fechaActual = LocalDate.now();
        LocalTime horaActual = LocalTime.now();
        for (Funcion funcion:lista) {
            if(funcion.getFechaProyeccion().isAfter(fechaActual)){
                nuevaLista.add(funcion);
            }else{
                if(funcion.getFechaProyeccion().isEqual(fechaActual) && funcion.getHoraProyeccion().isAfter(horaActual)){
                    nuevaLista.add(funcion);
                }else{
                    eliminarFuncionCascada(funcion.getId());
                }
            }
        }
        if(nuevaLista.isEmpty()){
            throw new ResourceNoContentException("Error. No existen Funciones registradas para la Pelicula: " + peliculaNombre);
        }
        return nuevaLista;
    }

    public FuncionDTO actualizarFuncion(FuncionDTO funcion) throws ResourceBadRequestException, ResourceNotFoundException {
        logger.info("Actualizando Funcion");
            if (funcion.chequearAtributosVacios()) {
                throw new ResourceBadRequestException("Error. La Funcion tiene que contener todos sus campos");
            }else{
                Optional<Funcion> optionalFuncion = funcionRepository.findByIdAndVigente(funcion.getId(), true);
                if(optionalFuncion.isPresent()){
                    Set<Reserva> reservas = convertirFuncionDTOaFuncion(funcion).getReservas();
                    if(!reservas.isEmpty()){
                        throw new ResourceBadRequestException("Error. No se puede modificar la Funcion con Reservas activas");
                    }
                    Optional<Sala> optionalSala = salaRepository.findByIdAndVigenteTrue(funcion.getSala_id());
                    if(optionalSala.isEmpty()){
                        throw new ResourceBadRequestException("Error. No se encontró la Sala con ID: " + funcion.getSala_id());
                    }
                    Optional<Pelicula> optionalPelicula = peliculaRepository.findByIdAndVigente(funcion.getPelicula_id(), true);
                    if(optionalPelicula.isEmpty()){
                        throw new ResourceBadRequestException("Error. No se encontró la Pelicula con ID: " + funcion.getPelicula_id());
                    }

                    LocalDate fechaActual = LocalDate.now();
                    LocalTime horaActual = LocalTime.now();
                    List<Funcion> lista = funcionRepository.findAllByVigenteTrue();
                    if(funcion.getFechaProyeccion().isAfter(fechaActual) || (funcion.getFechaProyeccion().isEqual(fechaActual) && funcion.getHoraProyeccion().isAfter(horaActual))){
                        if (!optionalFuncion.get().getFechaProyeccion().equals(funcion.getFechaProyeccion()) || !optionalFuncion.get().getHoraProyeccion().equals(funcion.getHoraProyeccion()) || !optionalFuncion.get().getSala().getId().equals(funcion.getSala_id())){
                            for (Funcion func : lista) {
                                if(Objects.equals(func.getSala().getId(), funcion.getSala_id()) && func.getFechaProyeccion().isEqual(funcion.getFechaProyeccion())){
                                    Duration dif = Duration.between(func.getHoraProyeccion(), funcion.getHoraProyeccion());
                                    long difHoras = Math.abs(dif.toHours());
                                    if(difHoras < 4){
                                        throw new ResourceBadRequestException("Error. Existe otra Funcion en esa Fecha con menos de 4 horas de diferencia entre ellas");
                                    }
                                }
                            }
                        }
                        Funcion funcionAGuardar = convertirFuncionDTOaFuncion(funcion);
                        funcionAGuardar.setReservas(optionalFuncion.get().getReservas());
                        funcionAGuardar.setButacas(optionalFuncion.get().getButacas());
                        return convertirFuncionaFuncionDTO(funcionRepository.save(funcionAGuardar));
                    }else{
                        throw new ResourceBadRequestException("Error. La Fecha o la Hora son anteriores a la Fecha y Hora actual");
                    }
                }else{
                    throw new ResourceNotFoundException("Error. La Funcion con id = " + funcion.getId() + " no existe o ya no esta vigente");
                }
            }
    }

    public List<Funcion> buscador(String cine, String pelicula) throws ResourceBadRequestException, ResourceNoContentException {
        List<Funcion> funciones = funcionRepository.findAllByVigenteTrue();
        List<Funcion> lista = new ArrayList<>();

        if (cine == null || pelicula == null) {
            throw new ResourceBadRequestException("Error. Debe proporcionar valores para ambos parámetros 'cine' y 'pelicula'");
        }

        for(Funcion funcion : funciones){
            boolean coincideCine = funcion.getSala().getCine().getNombre().equals(cine);
            boolean coincidePelicula = funcion.getPelicula().getTitulo().equals(pelicula);

            if(coincideCine && coincidePelicula){
                lista.add(funcion);
            }
        }

        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Funciones disponibles con esos criterios");
        }
    }

    public void eliminarFuncion(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Funcion con id = " + id);
        Optional<Funcion> funcionBuscada = funcionRepository.findByIdAndVigente(id, true);
        if (funcionBuscada.isPresent()){
            funcionBuscada.get().setVigente(false);
            butacaService.eliminarButacaCascadaFuncion(id);
            funcionRepository.save(funcionBuscada.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe la Funcion con id = " + id + " o no esta vigente");
        }
    }

    public void eliminarFuncionCascada(Long id){
        logger.warn("Borrando Funcion con id = " + id);
        Optional<Funcion> funcionBuscada = funcionRepository.findByIdAndVigente(id, true);
        if (funcionBuscada.isPresent()){
            funcionBuscada.get().setVigente(false);
            butacaService.eliminarButacaCascadaFuncion(id);
            funcionRepository.save(funcionBuscada.get());
        }
    }

    private Funcion convertirFuncionDTOaFuncion(FuncionDTO funcionDTO){
        Funcion funcion = new Funcion();
        Sala sala = new Sala();
        Pelicula pelicula = new Pelicula();

        funcion.setId(funcionDTO.getId());
        funcion.setOpcionesIdioma(funcionDTO.getOpcionesIdioma());
        funcion.setModalidad(funcionDTO.getModalidad());
        funcion.setFechaProyeccion(funcionDTO.getFechaProyeccion());
        funcion.setHoraProyeccion(funcionDTO.getHoraProyeccion());
        funcion.setVigente(true);
        sala.setId(funcionDTO.getSala_id());
        pelicula.setId(funcionDTO.getPelicula_id());

        funcion.setSala(sala);
        funcion.setPelicula(pelicula);

        return funcion;
    }

    private FuncionDTO convertirFuncionaFuncionDTO(Funcion funcion){
        FuncionDTO funcionDTO = new FuncionDTO();

        funcionDTO.setId(funcion.getId());
        funcionDTO.setOpcionesIdioma(funcion.getOpcionesIdioma());
        funcionDTO.setModalidad(funcion.getModalidad());
        funcionDTO.setFechaProyeccion(funcion.getFechaProyeccion());
        funcionDTO.setHoraProyeccion(funcion.getHoraProyeccion());
        funcionDTO.setSala_id(funcion.getSala().getId());
        funcionDTO.setPelicula_id(funcion.getPelicula().getId());

        return funcionDTO;
    }
}
