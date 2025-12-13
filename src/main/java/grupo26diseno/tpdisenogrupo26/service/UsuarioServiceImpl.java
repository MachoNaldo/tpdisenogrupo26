package grupo26diseno.tpdisenogrupo26.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.model.Usuario;
import grupo26diseno.tpdisenogrupo26.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public boolean autenticarUsuario(String unNombre, String unaContra) {
        Optional<Usuario> usuario = usuarioRepository.findByNombreAndContra(unNombre, unaContra);
        return usuario.isPresent();
    }
}
