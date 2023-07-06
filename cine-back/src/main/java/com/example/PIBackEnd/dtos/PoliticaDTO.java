package com.example.PIBackEnd.dtos;

public class PoliticaDTO {

    private Long id;

    private String normasDeLaSala;

    private String saludYSeguridad;

    private String politicaDeCancelacion;

    public Boolean chequearAtributosVacios(){
        return null == this.normasDeLaSala || null == this.saludYSeguridad || null == this.politicaDeCancelacion;
    }

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
