package com.example.PIBackEnd.dtos;

import lombok.Data;

@Data
public class DtoRegistro {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
}
