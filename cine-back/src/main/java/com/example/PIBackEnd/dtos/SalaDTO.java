package com.example.PIBackEnd.dtos;

public class SalaDTO {

    private Long id;

    private String nombre;

    private Long cine_id;

    public Boolean chequearAtributosVacios(){
        return null == this.nombre || null == this.cine_id;
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

    public Long getCine_id() {
        return cine_id;
    }

    public void setCine_id(Long cine_id) {
        this.cine_id = cine_id;
    }
}
