package com.example.PIBackEnd.service;

import com.example.PIBackEnd.domain.Rol;
import com.example.PIBackEnd.domain.Usuario;
import com.example.PIBackEnd.exceptions.ResourceBadRequestException;
import com.example.PIBackEnd.exceptions.ResourceNoContentException;
import com.example.PIBackEnd.exceptions.ResourceNotFoundException;
import com.example.PIBackEnd.repository.IRolRepository;
import com.example.PIBackEnd.repository.IUsuarioRepository;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RolService {

    private static final Logger logger = Logger.getLogger(RolService.class);

    private IRolRepository rolesRepository;

    private IUsuarioRepository usuarioRepository;

    @Autowired
    public RolService(IRolRepository rolesRepository, IUsuarioRepository usuarioRepository) {
        this.rolesRepository = rolesRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Rol guardarRol(Rol rol) throws ResourceBadRequestException {
        logger.info("Guardando Rol nuevo");
        Optional<Rol> optionalRol = rolesRepository.findByNombreAndVigenteTrue(rol.getNombre());
        if(optionalRol.isPresent()){
            throw new ResourceBadRequestException("Error. Ya existe Rol con nombre: " + rol.getNombre());
        }else{
            rol.setVigente(true);
            return rolesRepository.save(rol);
        }
    }

    public List<Rol> buscarTodosRoles() throws ResourceNoContentException {
        logger.info("Buscando todos los Roles");
        List<Rol> lista = rolesRepository.findAllByVigenteTrue();
        if(!lista.isEmpty()){
            return lista;
        }else{
            throw new ResourceNoContentException("Error. No existen Roles registradas.");
        }
    }

    public Rol buscarRolPorNombre(String nombre) throws ResourceNotFoundException {
        logger.info("Buscando Rol con nombre: " + nombre);
        Optional<Rol> rolBuscado = rolesRepository.findByNombreAndVigenteTrue(nombre);
        if(rolBuscado.isPresent()){
            return rolBuscado.get();
        }
        else{
            throw new ResourceNotFoundException("Error. No existe el Rol con nombre = " + nombre + ".");
        }
    }

    public void eliminarRol(String nombre) throws ResourceNotFoundException, ResourceBadRequestException {
        logger.warn("Borrando Rol con nombre = " + nombre);
        Optional<Rol> rolBuscado = rolesRepository.findByNombreAndVigenteTrue(nombre);
        List<Usuario> usuariosConRol = usuarioRepository.findByRolesNombreAndActivoTrue(nombre);
        if(usuariosConRol.isEmpty()){
            if (rolBuscado.isPresent()){
                rolBuscado.get().setVigente(false);
                rolesRepository.save(rolBuscado.get());
            }else{
                throw new ResourceNotFoundException("Error. No existe el Rol con nombre = " + nombre + " o no esta vigente");
            }
        }else{
            throw new ResourceBadRequestException("Error. Debe eliminar o cambiarles el Rol a los Usuarios con Rol: " + nombre);
        }
    }
}
