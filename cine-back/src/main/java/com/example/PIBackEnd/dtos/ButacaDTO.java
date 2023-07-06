package com.example.PIBackEnd.dtos;

public class ButacaDTO {

    private Long id;

    private Boolean ocupado;

    private Boolean pago;

    private Long usuario_id;

    private Long funcion_id;

    public Boolean chequearAtributosVacios(){
        return null == this.ocupado || null == this.pago || null == this.usuario_id || null == this.funcion_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getOcupado() {
        return ocupado;
    }

    public void setOcupado(Boolean ocupado) {
        this.ocupado = ocupado;
    }

    public Boolean getPago() {
        return pago;
    }

    public void setPago(Boolean pago) {
        this.pago = pago;
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
}
