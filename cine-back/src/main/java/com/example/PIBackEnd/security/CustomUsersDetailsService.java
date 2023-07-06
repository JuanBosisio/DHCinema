package com.example.PIBackEnd.security;

import com.example.PIBackEnd.domain.Rol;
import com.example.PIBackEnd.domain.Usuario;
import com.example.PIBackEnd.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUsersDetailsService implements UserDetailsService  {
    private IUsuarioRepository usuariosRepo;

    @Autowired
    public CustomUsersDetailsService(IUsuarioRepository usuariosRepo) {
        this.usuariosRepo = usuariosRepo;
    }

    public Collection<GrantedAuthority> mapToAuthorities(List<Rol> roles){
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getNombre())).collect(Collectors.toList());
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuarios = usuariosRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new User(usuarios.getEmail(), usuarios.getPassword(), mapToAuthorities(usuarios.getRoles()));
    }
}
