package com.example.PIBackEnd.dtos;

import jakarta.persistence.Column;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaDTO {

    private Long id;

    private String nombre;

    private String apellido;

    private String dni;

    private String email;

    private String peliculaNombre;

    private String usuarioEmail;

    private LocalDate fechaProyeccion;

    private LocalTime horaProyeccion;

    private String cine;

    private Integer butacas;

    private Double monto;

    private String banner;

    private String portadaPelicula;

    private String sala;

    private String modalidad;

    private String opcionesIdioma;

    private Boolean vigente;

    private Long usuario_id;

    private Long funcion_id;

    public Boolean chequearAtributosVacios(){
        return null == this.nombre || null == this.apellido || null == this.dni || null == this.email || null == this.butacas || null == this.monto || null == this.usuario_id || null == this.funcion_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getUsuario_id() {
        return usuario_id;
    }

    public void setUsuario_id(Long usuario_id) {
        this.usuario_id = usuario_id;
    }

    public Long getFuncion_id() {
        return funcion_id;
    }

    public void setFuncion_id(Long funcion_id) {
        this.funcion_id = funcion_id;
    }

    public String getPeliculaNombre() {
        return peliculaNombre;
    }

    public void setPeliculaNombre(String peliculaNombre) {
        this.peliculaNombre = peliculaNombre;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
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

    public String getCine() {
        return cine;
    }

    public void setCine(String cine) {
        this.cine = cine;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public String getPortadaPelicula() {
        return portadaPelicula;
    }

    public void setPortadaPelicula(String portadaPelicula) {
        this.portadaPelicula = portadaPelicula;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public String getOpcionesIdioma() {
        return opcionesIdioma;
    }

    public void setOpcionesIdioma(String opcionesIdioma) {
        this.opcionesIdioma = opcionesIdioma;
    }

    public Boolean getVigente() {
        return vigente;
    }

    public void setVigente(Boolean vigente) {
        this.vigente = vigente;
    }

    public Integer getButacas() {
        return butacas;
    }

    public void setButacas(Integer butacas) {
        this.butacas = butacas;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }
}
