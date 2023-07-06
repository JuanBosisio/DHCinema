package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Funcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IFuncionRepository extends JpaRepository<Funcion, Long> {
    Optional<Funcion> findByIdAndVigente(Long id, Boolean vigente);
    List<Funcion> findAllByVigenteTrueAndPelicula_Titulo(String nombrePelicula);
    List<Funcion> findAllByVigenteTrue();
}
