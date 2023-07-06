package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.dtos.ReservaDTO;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reservas")
@CrossOrigin
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping
    public ResponseEntity<ReservaDTO> guardarReserva(@RequestBody ReservaDTO reserva) throws ResourceBadRequestException {
        return ResponseEntity.ok(reservaService.guardarReserva(reserva));
    }

    @PutMapping
    public ResponseEntity<ReservaDTO> actualizarReserva(@RequestBody ReservaDTO reserva) throws ResourceBadRequestException, ResourceNotFoundException {
        return ResponseEntity.ok(reservaService.actualizarReserva(reserva));
    }

    @GetMapping
    public ResponseEntity<List<ReservaDTO>> buscarTodasReservas() throws ResourceNoContentException {
        return ResponseEntity.ok(reservaService.buscarTodasReservas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> buscarReservaPorId(@PathVariable Long id) throws ResourceNotFoundException {
        return ResponseEntity.ok(reservaService.buscarReservaPorId(id));
    }

    @GetMapping("/usuario/{email}")
    public ResponseEntity<List<ReservaDTO>> buscarTodasReservasPorUsuario(@PathVariable String email){
        return ResponseEntity.ok(reservaService.buscarTodasReservasPorUsuario(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarReserva(@PathVariable Long id) throws ResourceNotFoundException {
        reservaService.eliminarReserva(id);
        return ResponseEntity.ok("Eliminación de la Reserva con id = " + id + " con éxito");
    }
}
