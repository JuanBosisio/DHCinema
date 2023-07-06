package com.example.PIBackEnd.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

public class FuncionDTO {

    private Long id;

    private String opcionesIdioma;

    private String modalidad;

    private LocalDate fechaProyeccion;

    private LocalTime horaProyeccion;

    private Long sala_id;

    private Long pelicula_id;

    public Boolean chequearAtributosVacios(){
        return null == this.opcionesIdioma || null == this.modalidad || null == this.fechaProyeccion || null == this.horaProyeccion || null == this.sala_id || null == this.pelicula_id;
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

    public Long getSala_id() {
        return sala_id;
    }

    public void setSala_id(Long sala_id) {
        this.sala_id = sala_id;
    }

    public Long getPelicula_id() {
        return pelicula_id;
    }

    public void setPelicula_id(Long pelicula_id) {
        this.pelicula_id = pelicula_id;
    }
}
