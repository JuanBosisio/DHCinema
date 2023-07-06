package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Pelicula;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IPeliculaRepository extends JpaRepository<Pelicula,Long> {
    Optional<Pelicula> findByTitulo(String titulo);
    List<Pelicula> findByCategoriasId(Long id);
    Page<Pelicula> findByCategoriasTitulo(String titulo, Pageable pageable);
    Page<Pelicula> findAll(Pageable pageable);
    List<Pelicula> findAllByVigenteTrue();
    Page<Pelicula> findAllByVigenteTrue(Pageable pageable);
    Optional<Pelicula> findByIdAndVigente(Long id, Boolean vigente);
    List<Pelicula> findByTituloContainingIgnoreCaseAndVigente(String fragmentoTitulo, Boolean vigente);
}
