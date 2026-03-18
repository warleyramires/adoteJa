package com.adotejabackend.AdoteJaBackend.config;

import com.adotejabackend.AdoteJaBackend.components.UserAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private UserAuthenticationFilter userAuthenticationFilter;

    @Value("${spring.web.cors.allowed-origins}")
    private String allowedOrigins;

    public static final String[] ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED = {
            "/users/login",
            "/users",
            "/adotantes",
            "/error",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Rotas públicas
                        .requestMatchers(ENDPOINTS_WITH_AUTHENTICATION_NOT_REQUIRED).permitAll()
                        // Adotantes: POST é público (cadastro)
                        .requestMatchers(HttpMethod.POST, "/adotantes").permitAll()
                        // Pets: GET é público
                        .requestMatchers(HttpMethod.GET, "/pets", "/pets/**").permitAll()
                        // Pets: POST e PUT exigem MEMBER ou ADMINISTRATOR
                        .requestMatchers(HttpMethod.POST, "/pets").hasAnyRole("MEMBER", "ADMINISTRATOR")
                        .requestMatchers(HttpMethod.PUT, "/pets/**").hasAnyRole("MEMBER", "ADMINISTRATOR")
                        // Pets: DELETE exige ADMINISTRATOR
                        .requestMatchers(HttpMethod.DELETE, "/pets/**").hasRole("ADMINISTRATOR")
                        // Funcionários: apenas ADMINISTRATOR
                        .requestMatchers(HttpMethod.POST, "/funcionarios").hasRole("ADMINISTRATOR")
                        .requestMatchers(HttpMethod.GET, "/funcionarios", "/funcionarios/**").hasRole("ADMINISTRATOR")
                        .requestMatchers(HttpMethod.PUT, "/funcionarios/**").hasRole("ADMINISTRATOR")
                        .requestMatchers(HttpMethod.DELETE, "/funcionarios/**").hasRole("ADMINISTRATOR")
                        // Adotantes: GET e PUT exigem autenticação
                        .requestMatchers(HttpMethod.GET, "/adotantes/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/adotantes/**").authenticated()
                        // Solicitações
                        .requestMatchers(HttpMethod.POST, "/solicitacoes").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/solicitacoes/minhas").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/solicitacoes").hasAnyRole("MEMBER", "ADMINISTRATOR")
                        .requestMatchers(HttpMethod.PUT, "/solicitacoes/**").hasAnyRole("MEMBER", "ADMINISTRATOR")
                        // Testes
                        .requestMatchers("/users/test").authenticated()
                        .requestMatchers("/users/test/customer").hasRole("CUSTOMER")
                        .requestMatchers("/users/test/administrator").hasRole("ADMINISTRATOR")
                        .anyRequest().denyAll()
                )
                .addFilterBefore(userAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
