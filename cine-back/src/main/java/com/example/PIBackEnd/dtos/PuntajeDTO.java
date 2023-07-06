package com.example.PIBackEnd.dtos;

public class PuntajeDTO {
    private Long id;

    private Long pelicula_id;

    private Long usuario_id;

    private Integer puntaje;

    private String valoracion;

    public Boolean chequearAtributosVacios(){
        return null == this.pelicula_id || null == this.usuario_id || null == this.puntaje || null == this.valoracion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPelicula_id() {
        return pelicula_id;
    }

    public void setPelicula_id(Long pelicula_id) {
        this.pelicula_id = pelicula_id;
    }

    public Long getUsuario_id() {
        return usuario_id;
    }

    public void setUsuario_id(Long usuario_id) {
        this.usuario_id = usuario_id;
    }

    public Integer getPuntaje() {
        return puntaje;
    }

    public void setPuntaje(Integer puntaje) {
        this.puntaje = puntaje;
    }

    public String getValoracion() {
        return valoracion;
    }

    public void setValoracion(String valoracion) {
        this.valoracion = valoracion;
    }
}
