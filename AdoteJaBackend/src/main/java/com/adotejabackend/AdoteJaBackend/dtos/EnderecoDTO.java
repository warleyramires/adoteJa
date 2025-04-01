package com.adotejabackend.AdoteJaBackend.dtos;

public record EnderecoDTO(

         String logadouro,
         String numero,
         String bairro,
         String cidade,
         String estado,
         String cep
) {
}
