package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Cine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ICineRepository extends JpaRepository<Cine, Long> {
    Optional<Cine> findByIdAndVigenteTrue(Long id);
    Optional<Cine> findByNombreAndVigenteTrue(String nombre);
    List<Cine> findAllByVigenteTrue();
}
