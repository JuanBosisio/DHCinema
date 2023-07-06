package com.example.PIBackEnd.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "funciones")
public class Funcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 40)
    private String opcionesIdioma;

    @Column(nullable = false, length = 5)
    private String modalidad;

    @Column(nullable = false)
    private LocalDate fechaProyeccion;

    @Column(nullable = false)
    private LocalTime horaProyeccion;

    @Column
    private Boolean vigente;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "pelicula_id", referencedColumnName = "id")
    private Pelicula pelicula;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "sala_id", referencedColumnName = "id")
    private Sala sala;

    @OneToMany(mappedBy = "funcion")
    private Set<Reserva> reservas = new HashSet<>();

    @OneToMany(mappedBy = "funcion", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Butaca> butacas = new HashSet<>();

    public Funcion(){
        for (int i = 1; i <= 66; i++) {
            Butaca butaca = new Butaca();
            butaca.setIdUsuario(null);
            butaca.setFuncion(this);
            butaca.setOcupado(false);
            butaca.setPago(false);
            butacas.add(butaca);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOpcionesIdioma() {
        return opcionesIdioma;
    }

    public void setOpcionesIdioma(String opcionesIdioma) {
        this.opcionesIdioma = opcionesIdioma;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public LocalDate getFechaProyeccion() {
        return fechaProyeccion;
    }

    public void setFechaProyeccion(LocalDate fechaProyeccion) {
        this.fechaProyeccion = fechaProyeccion;
    }

    public LocalTime getHoraProyeccion() {
        return horaProyeccion;
    }

    public void setHoraProyeccion(LocalTime horaProyeccion) {
        this.horaProyeccion = horaProyeccion;
    }

    public Pelicula getPelicula() {
        return pelicula;
    }

    public void setPelicula(Pelicula pelicula) {
        this.pelicula = pelicula;
    }

    public Sala getSala() {
        return sala;
    }

    public void setSala(Sala sala) {
        this.sala = sala;
    }

    public Set<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(Set<Reserva> reservas) {
        this.reservas = reservas;
    }

    public Boolean getVigente() {
        return vigente;
    }

    public void setVigente(Boolean vigente) {
        this.vigente = vigente;
    }

    public Set<Butaca> getButacas() {
        return butacas;
    }

    public void setButacas(Set<Butaca> butacas) {
        this.butacas = butacas;
    }
}
