package com.example.PIBackEnd.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
                .cors(Customizer.withDefaults())
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests()
                .requestMatchers("/ciudades/**").permitAll()
                .requestMatchers("/favoritos/**").permitAll()
                .requestMatchers("/funciones/**").permitAll()
                .requestMatchers("/cines/**").permitAll()
                .requestMatchers("/salas/**").permitAll()
                .requestMatchers("/reservas/**").permitAll()
                .requestMatchers("/politicas/**").permitAll()
                .requestMatchers("/butacas/**").permitAll()
                .requestMatchers("/api/mercado-pago/**").permitAll()
                .requestMatchers("/categorias/**").permitAll()
                .requestMatchers("/usuarios/**").permitAll()
                .requestMatchers("/roles/**").permitAll()
                .requestMatchers("/peliculas/**").permitAll()
                //.requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/puntajes/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/usuarios/{email}/roles").permitAll()
                //.requestMatchers(HttpMethod.PUT, "/usuarios/{email}/roles").hasAuthority("ADMIN")
                .anyRequest().authenticated()
                .and()
                .httpBasic();
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
