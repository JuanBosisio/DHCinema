package com.example.PIBackEnd.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "peliculas")
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 500)
    private String trailer;

    @Column(nullable = false, length = 500)
    private String portada;

    @Column(nullable = false, length = 500)
    private String banner;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private Boolean vigente;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "caracteristica_id",referencedColumnName = "id", nullable = false)
    private Caracteristica caracteristicas;

    @OneToMany(mappedBy = "pelicula", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Imagen> imagenes = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "pelicula_categoria",
            joinColumns = { @JoinColumn(name = "pelicula_id") },
            inverseJoinColumns = { @JoinColumn(name = "categoria_id") }
    )
    private Set<Categoria> categorias = new HashSet<>();

    @OneToMany(mappedBy = "pelicula", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Funcion> funciones = new HashSet<>();

    @OneToMany(mappedBy = "pelicula")
    @JsonIgnore
    private Set<Puntaje> puntajes = new HashSet<>();

    @OneToMany(mappedBy = "pelicula")
    @JsonIgnore
    private Set<Favorito> favoritos = new HashSet<>();

    public Boolean chequearAtributosVacios(){
        return null == this.titulo || null == this.descripcion || this.imagenes.isEmpty() || this.categorias.isEmpty() || null == this.portada || null == this.trailer || null == this.banner || null == this.caracteristicas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    public String getPortada() {
        return portada;
    }

    public void setPortada(String portada) {
        this.portada = portada;
    }

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getVigente() {
        return vigente;
    }

    public void setVigente(Boolean vigente) {
        this.vigente = vigente;
    }

    public Caracteristica getCaracteristicas() {
        return caracteristicas;
    }

    public void setCaracteristicas(Caracteristica caracteristicas) {
        this.caracteristicas = caracteristicas;
    }

    public Set<Imagen> getImagenes() {
        return imagenes;
    }

    public void setImagenes(Set<Imagen> imagenes) {
        this.imagenes = imagenes;
    }

    public Set<Categoria> getCategorias() {
        return categorias;
    }

    public void setCategorias(Set<Categoria> categorias) {
        this.categorias = categorias;
    }

    public Set<Funcion> getFunciones() {
        return funciones;
    }

    public void setFunciones(Set<Funcion> funciones) {
        this.funciones = funciones;
    }

    public Set<Puntaje> getPuntajes() {
        return puntajes;
    }

    public void setPuntajes(Set<Puntaje> puntajes) {
        this.puntajes = puntajes;
    }

    public Set<Favorito> getFavoritos() {
        return favoritos;
    }

    public void setFavoritos(Set<Favorito> favoritos) {
        this.favoritos = favoritos;
    }
}
