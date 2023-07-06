package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Pelicula;
import com.example.PIBackEnd.domain.Puntaje;
import com.example.PIBackEnd.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IPuntajeRepository extends JpaRepository<Puntaje,Long> {
    boolean existsByUsuarioAndPelicula(Usuario usuario, Pelicula pelicula);
    List<Puntaje> findAllByPelicula(Pelicula pelicula);
}
