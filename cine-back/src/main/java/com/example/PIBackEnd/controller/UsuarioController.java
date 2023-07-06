package com.example.PIBackEnd.controller;

import com.example.PIBackEnd.domain.Rol;
import com.example.PIBackEnd.domain.Usuario;
import com.example.PIBackEnd.dtos.DtoAuthRespuesta;
import com.example.PIBackEnd.dtos.DtoLogin;
import com.example.PIBackEnd.dtos.DtoRegistro;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.security.JwtGenerador;
import com.example.PIBackEnd.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class UsuarioController {

    private AuthenticationManager authenticationManager;
    private JwtGenerador jwtGenerador;
    private UsuarioService usuarioService;

    @Autowired
    public UsuarioController(AuthenticationManager authenticationManager, JwtGenerador jwtGenerador, UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.jwtGenerador = jwtGenerador;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> guardarUsuario(@RequestBody DtoRegistro dtoRegistro) throws ResourceBadRequestException {
        System.out.println(dtoRegistro.getNombre());
        return ResponseEntity.ok(usuarioService.guardarUsuario(dtoRegistro));
    }

    @PostMapping("/registerAdm")
    public ResponseEntity<String> guardarUsuarioAdm(@RequestBody DtoRegistro dtoRegistro) throws ResourceBadRequestException {
        return ResponseEntity.ok(usuarioService.guardarUsuarioAdm(dtoRegistro));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DtoLogin dtoLogin) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                dtoLogin.getEmail(), dtoLogin.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerador.generarToken(authentication);
        Boolean activo = usuarioService.usuarioActivo(dtoLogin);
        DtoAuthRespuesta dtoAuthRespuesta = new DtoAuthRespuesta(token);
        if (activo){
            return new ResponseEntity<>(new DtoAuthRespuesta(token), HttpStatus.OK);
        } else {
            return ResponseEntity.badRequest().body("Usted no posee una cuenta o debe verificarla.");
        }
    }

    @PutMapping("/{email}/roles")
    public ResponseEntity<String> cambiarRolesUsuario(@PathVariable("email") String email, @RequestBody List<Rol> nuevosRoles) throws ResourceBadRequestException {
        usuarioService.asignarRoles(email, nuevosRoles);
        return ResponseEntity.ok("Roles cambiados exitosamente");
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> buscarTodosUsuarios() throws ResourceNoContentException {
        return ResponseEntity.ok(usuarioService.buscarTodosUsuarios());
    }

    @GetMapping("/roles/{nombre}")
    public ResponseEntity<List<Usuario>> buscarTodosUsuariosPorRol(@PathVariable String nombre) throws ResourceNoContentException {
        return ResponseEntity.ok(usuarioService.buscarTodosUsuariosPorRol(nombre));
    }

    @GetMapping("/{email}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable String email) throws ResourceNotFoundException {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorEmail(email));
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable String email) throws ResourceNotFoundException {
        usuarioService.eliminarUsuario(email);
        return ResponseEntity.ok("Eliminación del Usuario con email = " + email + ", con éxito");
    }

    @GetMapping ("/confirmar-cuenta")
    public ResponseEntity<String> confirmUserAccount(@RequestParam("token")String confirmacionToken) {
        ResponseEntity <String>  confirmar = usuarioService.confirmarEmail(confirmacionToken);
        return confirmar;
    }
}
