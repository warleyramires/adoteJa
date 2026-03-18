package com.adotejabackend.AdoteJaBackend.repositories;

import com.adotejabackend.AdoteJaBackend.enums.Especie;
import com.adotejabackend.AdoteJaBackend.enums.Porte;
import com.adotejabackend.AdoteJaBackend.enums.Sexo;
import com.adotejabackend.AdoteJaBackend.models.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query("SELECT p FROM Pet p JOIN p.caracteristica c WHERE " +
           "(:especie IS NULL OR c.especie = :especie) AND " +
           "(:porte IS NULL OR c.porte = :porte) AND " +
           "(:sexo IS NULL OR c.sexo = :sexo) AND " +
           "(:disponivel IS NULL OR p.disponivel = :disponivel)")
    List<Pet> findWithFilters(
            @Param("especie") Especie especie,
            @Param("porte") Porte porte,
            @Param("sexo") Sexo sexo,
            @Param("disponivel") Boolean disponivel
    );
}
