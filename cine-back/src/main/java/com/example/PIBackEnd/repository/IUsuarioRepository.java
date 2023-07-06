package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<Usuario> findByIdAndActivoTrue(Long id);
    Optional<Usuario> findByEmailAndActivoTrue(String email);
    List<Usuario> findAllByActivoTrue();
    List<Usuario> findByRolesNombreAndActivoTrue(String nombreRol);
}
