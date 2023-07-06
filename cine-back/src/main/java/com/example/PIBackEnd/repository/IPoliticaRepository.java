package com.example.PIBackEnd.repository;

import com.example.PIBackEnd.domain.Politica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPoliticaRepository extends JpaRepository<Politica, Long> {
}
