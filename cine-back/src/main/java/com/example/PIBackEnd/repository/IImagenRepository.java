package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Imagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IImagenRepository extends JpaRepository<Imagen,Long> {
    Optional<Imagen> findByImagen(String imagen);
}
