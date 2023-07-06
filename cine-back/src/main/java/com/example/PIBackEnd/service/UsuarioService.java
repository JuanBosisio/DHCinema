package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Rol;
import com.example.PIBackEnd.domain.Usuario;
import com.example.PIBackEnd.dtos.DtoLogin;
import com.example.PIBackEnd.dtos.DtoRegistro;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IRolRepository;
import com.example.PIBackEnd.repository.IUsuarioRepository;
import com.example.PIBackEnd.security.JwtGenerador;
import com.example.PIBackEnd.security.JwtUtil;
import org.apache.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private static final Logger logger = Logger.getLogger(UsuarioService.class);

    private PasswordEncoder passwordEncoder;

    private IRolRepository rolesRepository;

    private IUsuarioRepository usuarioRepository;

    private JwtGenerador jwtGenerador;

    private AuthenticationManager authenticationManager;

    private EmailService emailService;

    private JwtUtil jwtUtil;


    public UsuarioService(PasswordEncoder passwordEncoder, IRolRepository rolesRepository, IUsuarioRepository usuarioRepository, JwtGenerador jwtGenerador, AuthenticationManager authenticationManager, EmailService emailService, JwtUtil jwtUtil) {
        this.passwordEncoder = passwordEncoder;
        this.rolesRepository = rolesRepository;
        this.usuarioRepository = usuarioRepository;
        this.jwtGenerador = jwtGenerador;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    public String guardarUsuario(DtoRegistro dtoRegistro) throws ResourceBadRequestException {
        logger.info("Guardando Usuario USER nuevo");
        if (usuarioRepository.existsByEmail(dtoRegistro.getEmail())) {
            throw new ResourceBadRequestException("Error. Ya existe una Usuario con el mismo email");
        }
        Usuario usuarios = new Usuario();
        usuarios.setNombre(dtoRegistro.getNombre());
        usuarios.setApellido(dtoRegistro.getApellido());
        usuarios.setEmail(dtoRegistro.getEmail());
        usuarios.setPassword(passwordEncoder.encode(dtoRegistro.getPassword()));
        Optional<Rol> roles = rolesRepository.findByNombreAndVigenteTrue("USER");
        usuarios.setActivo(false);
        if(roles.isPresent()){
            usuarios.setRoles(Collections.singletonList(roles.get()));
            usuarioRepository.save(usuarios);
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    dtoRegistro.getEmail(), dtoRegistro.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtGenerador.generarToken(authentication);
            token = jwtUtil.encodeToken(token);
            SimpleMailMessage mensajeEmail = new SimpleMailMessage();
            mensajeEmail.setFrom("dhcinemaauth@gmail.com");
            mensajeEmail.setTo(dtoRegistro.getEmail());
            mensajeEmail.setSubject("Completa tu registro a DHCinema");
            mensajeEmail.setText("Para confirmar tu cuenta, por favor has click en el siguiente enlace: "
                    + "http://localhost:5173/confirmar-cuenta?token=" + token);
            emailService.sendEmail(mensajeEmail);

            return "Registro de usuario exitoso. Verifica tu casilla de correo para validar tu email.";
        }else{
            throw new ResourceBadRequestException("Error. Debe existir Rol USER");
        }
    }

    public String guardarUsuarioAdm(DtoRegistro dtoRegistro) throws ResourceBadRequestException {
        logger.info("Guardando Usuario ADMIN nuevo");
        if (usuarioRepository.existsByEmail(dtoRegistro.getEmail())) {
            throw new ResourceBadRequestException("Error. Ya existe una Usuario Admin con el mismo email");
        }
        Usuario usuarios = new Usuario();
        usuarios.setNombre(dtoRegistro.getNombre());
        usuarios.setApellido(dtoRegistro.getApellido());
        usuarios.setEmail(dtoRegistro.getEmail());
        usuarios.setActivo(true);
        usuarios.setPassword(passwordEncoder.encode(dtoRegistro.getPassword()));
        Optional<Rol> roles = rolesRepository.findByNombreAndVigenteTrue("ADMIN");
        if(roles.isPresent()){
            usuarios.setRoles(Collections.singletonList(roles.get()));
            usuarioRepository.save(usuarios);
            return "Registro de admin exitoso";
        }else{
            throw new ResourceBadRequestException("Error. Debe existir Rol ADMIN");
        }
    }

    public void asignarRoles(String email, List<Rol> roles) throws ResourceBadRequestException {
        logger.info("Asignando Roles nuevos a Usuario con email = " + email);
        Optional<Usuario> optionalUsuario = usuarioRepository.findByEmailAndActivoTrue(email);
        if(optionalUsuario.isPresent()){
            Usuario usuario = optionalUsuario.get();
            List<Rol> rolesNuevos = new ArrayList<>();
            for (Rol rol : roles) {
                Optional<Rol> rolBuscado = rolesRepository.findByNombreAndVigenteTrue(rol.getNombre());
                if (rolBuscado.isPresent()) {
                    if (!rolesNuevos.contains(rolBuscado.get())) {
                        rolesNuevos.add(rolBuscado.get());
                    } else {
                        throw new ResourceBadRequestException("Error. El Rol con nombre '" + rol.getNombre() + "' no debe repetirse.");
                    }
                } else {
                    throw new ResourceBadRequestException("Error. El Rol con nombre '" + rol.getNombre() + "' debe existir para ser asignado.");
                }
            }
            usuario.setRoles(rolesNuevos);
            usuarioRepository.save(usuario);
        }else{
            throw new ResourceBadRequestException("Error. El Usuario con email '" + email + "' no existe");
        }
    }

    public Usuario buscarUsuarioPorEmail(String email) throws ResourceNotFoundException {
        logger.info("Buscando Usuario con email: " + email);
        Optional<Usuario> usuarioBuscado = usuarioRepository.findByEmailAndActivoTrue(email);
        if(usuarioBuscado.isPresent()){
            return usuarioBuscado.get();
        }
        else{
            throw new ResourceNotFoundException("Error. No existe el Usuario con email = " + email + ".");
        }
    }

    public List<Usuario> buscarTodosUsuarios() throws ResourceNoContentException {
        logger.info("Buscando todos los Usuarios");
        List<Usuario> lista = usuarioRepository.findAllByActivoTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Usuarios registrados.");
        }
    }

    public List<Usuario> buscarTodosUsuariosPorRol(String rol) throws ResourceNoContentException {
        logger.info("Buscando todos los Usuarios por Rol");
        List<Usuario> lista = usuarioRepository.findByRolesNombreAndActivoTrue(rol);
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Usuarios registrados.");
        }
    }

    public void eliminarUsuario(String email) throws ResourceNotFoundException {
        logger.warn("Borrando Usuario con email = " + email);
        Optional<Usuario> usuarioBuscado = usuarioRepository.findByEmailAndActivoTrue(email);
        if (usuarioBuscado.isPresent()){
            usuarioBuscado.get().setActivo(false);
            usuarioRepository.save(usuarioBuscado.get());
        }else{
            throw new ResourceNotFoundException("Error. No existe el Usuario con email = " + email + " o no esta vigente");
        }
    }

    //Verifica el token y en caso de ser positivo actualiza el usuario.
    public ResponseEntity<String> confirmarEmail(String confirmacionToken) {

        if(confirmacionToken != null) {
            confirmacionToken = jwtUtil.decodeToken(confirmacionToken);
            Boolean validacion = jwtGenerador.validarToken(confirmacionToken);
            if(validacion){
                String email = jwtGenerador.obtenerUsernameDeJwt(confirmacionToken);
                Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
                if(usuario.isPresent()) {
                    Usuario actualizarUsuario = usuario.get();
                    if(actualizarUsuario.getActivo()){
                        return ResponseEntity.badRequest().body("El usuario ya se encuentra verificado.");
                    }
                    actualizarUsuario.setActivo(true);
                    usuarioRepository.save(actualizarUsuario);
                    return ResponseEntity.ok("Email verificado correctamente!");
                }
            }
        }
        return ResponseEntity.badRequest().body("Error: No se pudo verificar el email.");
    }

    public Boolean usuarioActivo (DtoLogin dtoLogin){
        Optional<Usuario> usuario = usuarioRepository.findByEmail(dtoLogin.getEmail());
        if(usuario.isPresent()){
            return usuario.get().getActivo();
        }
        return false;
    }
}
