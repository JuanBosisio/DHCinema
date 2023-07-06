package com.example.PIBackEnd.dtos;

public class CineDTO {

    private Long id;

    private String nombre;

    private String direccion;

    private Double latitud;

    private Double longitud;

    private Long ciudad_id;

    public Boolean chequearAtributosVacios(){
        return null == this.nombre || null == this.direccion || null == this.latitud || null == this.longitud || null == this.ciudad_id;
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

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

    public Long getCiudad_id() {
        return ciudad_id;
    }

    public void setCiudad_id(Long ciudad_id) {
        this.ciudad_id = ciudad_id;
    }
}
