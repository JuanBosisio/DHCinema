package com.example.PIBackEnd.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "politicas")
public class Politica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String normasDeLaSala;

    @Column(nullable = false, length = 1000)
    private String saludYSeguridad;

    @Column(nullable = false, length = 1000)
    private String politicaDeCancelacion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNormasDeLaSala() {
        return normasDeLaSala;
    }

    public void setNormasDeLaSala(String normasDeLaSala) {
        this.normasDeLaSala = normasDeLaSala;
    }

    public String getSaludYSeguridad() {
        return saludYSeguridad;
    }

    public void setSaludYSeguridad(String saludYSeguridad) {
        this.saludYSeguridad = saludYSeguridad;
    }

    public String getPoliticaDeCancelacion() {
        return politicaDeCancelacion;
    }

    public void setPoliticaDeCancelacion(String politicaDeCancelacion) {
        this.politicaDeCancelacion = politicaDeCancelacion;
    }
}
