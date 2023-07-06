package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.*;
import com.example.PIBackEnd.dtos.ReservaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.*;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private static final Logger logger = Logger.getLogger(ReservaService.class);

    private IReservaRepository reservaRepository;

    private IFuncionRepository funcionRepository;

    private IPeliculaRepository peliculaRepository;

    private IUsuarioRepository usuarioRepository;

    private ISalaRepository salaRepository;

    private EmailService emailService;

    private ButacaService butacaService;

    private IButacaRepository butacaRepository;

    @Autowired
    public ReservaService(IReservaRepository reservaRepository, IFuncionRepository funcionRepository, IPeliculaRepository peliculaRepository, IUsuarioRepository usuarioRepository, ISalaRepository salaRepository, EmailService emailService, ButacaService butacaService, IButacaRepository butacaRepository) {
        this.reservaRepository = reservaRepository;
        this.funcionRepository = funcionRepository;
        this.peliculaRepository = peliculaRepository;
        this.usuarioRepository = usuarioRepository;
        this.salaRepository = salaRepository;
        this.emailService = emailService;
        this.butacaService = butacaService;
        this.butacaRepository = butacaRepository;
    }

    public ReservaDTO guardarReserva(ReservaDTO reserva) throws ResourceBadRequestException {
        logger.info("Guardando Reserva nueva");
        if (reserva.chequearAtributosVacios()) {
            throw new ResourceBadRequestException("Error. La Reserva tiene que contener todos sus campos");
        }else{
            Optional<Usuario> optionalUsuario = usuarioRepository.findByIdAndActivoTrue(reserva.getUsuario_id());
            if(optionalUsuario.isEmpty()){
                throw new ResourceBadRequestException("Error. No se encontró el Usuario con ID: " + reserva.getUsuario_id());
            }
            Optional<Funcion> optionalFuncion = funcionRepository.findByIdAndVigente(reserva.getFuncion_id(), true);
            if(optionalFuncion.isEmpty()){
                throw new ResourceBadRequestException("Error. No se encontró la Funcion con ID: " + reserva.getFuncion_id());
            }

            SimpleMailMessage mensajeEmail = new SimpleMailMessage();
            mensajeEmail.setFrom("dhcinemaauth@gmail.com");
            mensajeEmail.setTo(optionalUsuario.get().getEmail());
            mensajeEmail.setSubject("Confirmación de reserva");
            mensajeEmail.setText("Tu reserva ha sido guardada exitosamente.");

            emailService.sendEmail(mensajeEmail);

            return convertirReservaaReservaDTO(reservaRepository.save(convertirReservaDTOaReserva(reserva)));
        }
    }

    public ReservaDTO actualizarReserva(ReservaDTO reserva) throws ResourceBadRequestException, ResourceNotFoundException {
        logger.info("Actualizando Reserva");
        if (reserva.chequearAtributosVacios()) {
            throw new ResourceBadRequestException("Error. La Reserva tiene que contener todos sus campos");
        }else{
            Optional<Reserva> reservaBuscada = reservaRepository.findByIdAndVigenteTrue(reserva.getId());
            if(reservaBuscada.isEmpty()){
                throw new ResourceNotFoundException("Error. La Reserva con id = " + reserva.getId() + " no existe o ya no esta vigente");
            }
            ReservaDTO reservaDTOBuscada = convertirReservaaReservaDTO(reservaBuscada.get());
            if(!(reserva.getUsuario_id().equals(reservaDTOBuscada.getUsuario_id()) && reserva.getFuncion_id().equals(reservaDTOBuscada.getFuncion_id()))){
                throw new ResourceBadRequestException("Error. La Reserva tiene que contener el mismo Usuario y la misma Funcion");
            }
            return convertirReservaaReservaDTO(reservaRepository.save(convertirReservaDTOaReserva(reserva)));
        }
    }

    public ReservaDTO buscarReservaPorId(Long id) throws ResourceNotFoundException {
        logger.info("Buscando Reserva con ID: " + id);
        Optional<Reserva> reservaBuscada = reservaRepository.findById(id);
        if(reservaBuscada.isPresent()){
            return convertirReservaaReservaDTO(reservaBuscada.get());
        }
        else{
            throw new ResourceNotFoundException("Error. No existe la Reserva con ID = " + id + ".");
        }
    }

    public List<ReservaDTO> buscarTodasReservas() throws ResourceNoContentException {
        logger.info("Buscando todas las Reservas");
        List<Reserva> lista = reservaRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            List<ReservaDTO> reservasDto = new ArrayList<>();
            for (Reserva reserva:lista) {
                ReservaDTO reservaDTOAGuardar = convertirReservaaReservaDTO(reserva);
                reservasDto.add(reservaDTOAGuardar);
            }
            return reservasDto;
        }else{
            throw new ResourceNoContentException("Error. No existen Reservas registradas.");
        }
    }

    //HISTORIAL CON SOLO RESERVAS ACTIVAS (falta retornar ReservaDTO si se llega a usar)

    /*public List<Reserva> buscarTodasReservasPorUsuario(String email) throws ResourceNoContentException {
        logger.info("Buscando todas las Reservas para Usuario: " + email);
        List<Reserva> lista = reservaRepository.findAllByVigenteTrueAndUsuarioEmail(email);
        List<Reserva> nuevaLista = new ArrayList<>();
        LocalDate fechaActual = LocalDate.now();
        LocalTime horaActual = LocalTime.now();
        for (Reserva reserva:lista) {
            if (reserva.getFechaProyeccion().isAfter(fechaActual) || (reserva.getFechaProyeccion().isEqual(fechaActual) && reserva.getHoraProyeccion().isAfter(horaActual))) {
                nuevaLista.add(reserva);
            }else{
                reserva.setVigente(false);
                reservaRepository.save(reserva);
            }
        }
        if(nuevaLista.size() < 1){
            throw new ResourceNoContentException("Error. No existen Reservas vigentes registradas para el Usuario: " + email);
        }
        return nuevaLista;
    }*/

    //HISTORIAL CON TODAS LAS RESERVAS

    public List<ReservaDTO> buscarTodasReservasPorUsuario(String email){
        logger.info("Buscando todas las Reservas para Usuario: " + email);
        List<Reserva> listaAModificar = reservaRepository.findAllByVigenteTrueAndUsuarioEmail(email);
        List<Reserva> lista = reservaRepository.findAllByUsuarioEmail(email);
        LocalDate fechaActual = LocalDate.now();
        LocalTime horaActual = LocalTime.now();
        for (Reserva reserva:listaAModificar) {
            if(!(reserva.getFechaProyeccion().isAfter(fechaActual) || (reserva.getFechaProyeccion().isEqual(fechaActual) && reserva.getHoraProyeccion().isAfter(horaActual)))){
                reserva.setVigente(false);
                reservaRepository.save(reserva);
            }
        }
        List<ReservaDTO> reservas = new ArrayList<>();
        for (Reserva reserva:lista) {
            ReservaDTO reservaDTO = convertirReservaaReservaDTO(reserva);
            reservas.add(reservaDTO);
        }
        return reservas;
    }

    public void eliminarReserva(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Reserva con id = " + id);
        Optional<Reserva> reservaBuscada = reservaRepository.findByIdAndVigenteTrue(id);
        if (reservaBuscada.isPresent()){
            reservaBuscada.get().setVigente(false);
            List<Butaca> butacas = butacaRepository.findAllByIdUsuarioAndFuncion_Id(reservaBuscada.get().getUsuario().getId(), reservaBuscada.get().getFuncion().getId());
            for (Butaca butaca:butacas) {
                butacaService.eliminarButacaCascada(butaca.getId());
            }
            reservaRepository.save(reservaBuscada.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe la Reserva con id = " + id + " o no esta vigente");
        }
    }

    /*public void eliminarReservaCascada(Long id) throws ResourceNotFoundException {
        logger.warn("Borrando Reserva con id = " + id);
        Optional<Reserva> reservaBuscada = reservaRepository.findByIdAndVigenteTrue(id);
        if (reservaBuscada.isPresent()){
            reservaBuscada.get().setVigente(false);
            List<Butaca> butacas = butacaRepository.findAllByIdUsuarioAndFuncion_Id(reservaBuscada.get().getUsuario().getId(), reservaBuscada.get().getFuncion().getId());
            for (Butaca butaca:butacas) {
                butacaService.eliminarButacaCascada(butaca.getId());
            }
            reservaRepository.save(reservaBuscada.get());
        }
    }
    }*/

    private Reserva convertirReservaDTOaReserva(ReservaDTO reservaDTO){
        Reserva reserva = new Reserva();

        Optional<Funcion> func = funcionRepository.findById(reservaDTO.getFuncion_id());
        Optional<Pelicula> pelicula = peliculaRepository.findById(func.get().getPelicula().getId());
        Optional<Usuario> usuario = usuarioRepository.findById(reservaDTO.getUsuario_id());
        Optional<Sala> sala = salaRepository.findById(func.get().getSala().getId());

        reserva.setId(reservaDTO.getId());
        reserva.setNombre(reservaDTO.getNombre());
        reserva.setApellido(reservaDTO.getApellido());
        reserva.setDni(reservaDTO.getDni());
        reserva.setEmail(reservaDTO.getEmail());
        reserva.setButacas(reservaDTO.getButacas());
        reserva.setMonto(reservaDTO.getMonto());
        reserva.setModalidad(func.get().getModalidad());
        reserva.setFechaProyeccion(func.get().getFechaProyeccion());
        reserva.setHoraProyeccion(func.get().getHoraProyeccion());
        reserva.setOpcionesIdioma(func.get().getOpcionesIdioma());
        reserva.setUsuarioEmail(usuario.get().getEmail());
        reserva.setPeliculaNombre(pelicula.get().getTitulo());
        reserva.setSala(sala.get().getNombre());
        reserva.setCine(sala.get().getCine().getNombre());
        reserva.setPortadaPelicula(pelicula.get().getPortada());
        reserva.setBanner(pelicula.get().getBanner());
        reserva.setVigente(true);

        reserva.setUsuario(usuario.get());
        reserva.setFuncion(func.get());

        return reserva;
    }

    private ReservaDTO convertirReservaaReservaDTO(Reserva reserva){
        ReservaDTO reservaDTO = new ReservaDTO();

        reservaDTO.setId(reserva.getId());
        reservaDTO.setNombre(reserva.getNombre());
        reservaDTO.setApellido(reserva.getApellido());
        reservaDTO.setDni(reserva.getDni());
        reservaDTO.setEmail(reserva.getEmail());
        reservaDTO.setButacas(reserva.getButacas());
        reservaDTO.setMonto(reserva.getMonto());
        reservaDTO.setPeliculaNombre(reserva.getPeliculaNombre());
        reservaDTO.setUsuarioEmail(reserva.getUsuarioEmail());
        reservaDTO.setFechaProyeccion(reserva.getFechaProyeccion());
        reservaDTO.setHoraProyeccion(reserva.getHoraProyeccion());
        reservaDTO.setCine(reserva.getCine());
        reservaDTO.setBanner(reserva.getBanner());
        reservaDTO.setPortadaPelicula(reserva.getPortadaPelicula());
        reservaDTO.setSala(reserva.getSala());
        reservaDTO.setModalidad(reserva.getModalidad());
        reservaDTO.setOpcionesIdioma(reserva.getOpcionesIdioma());
        reservaDTO.setVigente(reserva.getVigente());
        reservaDTO.setUsuario_id(reserva.getUsuario().getId());
        reservaDTO.setFuncion_id(reserva.getFuncion().getId());

        return reservaDTO;
    }
}
