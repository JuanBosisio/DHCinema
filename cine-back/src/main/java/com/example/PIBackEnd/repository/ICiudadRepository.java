package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ICiudadRepository extends JpaRepository<Ciudad, Long> {
    Optional<Ciudad> findByNombreAndVigenteTrue(String nombre);
    Optional<Ciudad> findByIdAndVigenteTrue(Long id);
    List<Ciudad> findAllByVigenteTrue();
}
