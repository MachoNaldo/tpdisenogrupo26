package grupo26diseno.tpdisenogrupo26.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Persona;

@Repository
public interface PersonaRepository  extends JpaRepository<Persona, Long> {

}