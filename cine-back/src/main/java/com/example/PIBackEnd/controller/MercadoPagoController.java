package com.example.PIBackEnd.controller;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.resources.preference.PreferenceBackUrls;
import org.springframework.web.bind.annotation.*;
import com.mercadopago.MercadoPagoConfig;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/mercado-pago")
@CrossOrigin
public class MercadoPagoController {
    @GetMapping("/crear-preferencia")
    public String crearPreferencia(@RequestParam(required = true)String imagen,
                                   @RequestParam(required = true)Integer asientos,
                                   @RequestParam(required = true)String idAsientos,
                                   @RequestParam(required = true)String precio,
                                   @RequestParam(required = true)String id,
                                   @RequestParam(required = true)String titulo,
                                   @RequestParam(required = true)String idFuncion,
                                   @RequestParam(required = true)String email,
                                   @RequestParam(required = true)String dni,
                                   @RequestParam(required = true)String nombre,
                                   @RequestParam(required = true)String apellido) throws MPException, MPApiException {
        MercadoPagoConfig.setAccessToken("APP_USR-3996168272835573-070201-e0494e2280ac73f82edeb0550c80fd8a-1412171127");
        PreferenceItemRequest preference =
                PreferenceItemRequest.builder()
                        .id(id)
                        .title(titulo)
                        .pictureUrl(imagen)
                        .categoryId("pelicula")
                        .quantity(asientos)
                        .categoryId("ARS")
                        .unitPrice(new BigDecimal(precio))
                        .build();
        List<PreferenceItemRequest> items = new ArrayList<>();
        items.add(preference);
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://localhost:5173/peliculas/reserva/"+id+"?mpSuccess=success&nombre="+nombre+"&apellido="+apellido+"&email="+email+"&dni="+dni+"&idFuncion="+idFuncion+"&idAsientos="+idAsientos+"&precio="+precio+"&asientos="+asientos)
                .pending("http://localhost:5173/peliculas/reserva/"+id+"?mpSuccess=pending")
                .failure("http://localhost:5173/peliculas/reserva/"+id+"?mpSuccess=failure")
                .build();
        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                .build();
        PreferenceClient client = new PreferenceClient();


        Preference preference1 = client.create(preferenceRequest);


        return preference1.getId();
    }

}
