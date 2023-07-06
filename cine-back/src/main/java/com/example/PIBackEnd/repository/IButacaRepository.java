package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Butaca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IButacaRepository extends JpaRepository<Butaca, Long> {
    List<Butaca> findAllByFuncion_Id(Long id);
    List<Butaca> findAllByIdUsuarioAndFuncion_Id(Long idUsuario, Long idFuncion);
    Optional<Butaca> findByIdAndIdUsuarioNotNull(Long id);
    Optional<Butaca> findByIdAndIdUsuarioNull(Long id);
}
