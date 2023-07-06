package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IRolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombreAndVigenteTrue(String nombre);
    List<Rol> findAllByVigenteTrue();
}
