package sn.unchk.bibliotheque.security;

import sn.unchk.bibliotheque.entity.Utilisateur;
import sn.unchk.bibliotheque.repository.UtilisateurRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UtilisateurRepository repo;

    public MyUserDetailsService(UtilisateurRepository repo) {
        this.repo = repo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur u = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        GrantedAuthority auth = new SimpleGrantedAuthority("ROLE_" + u.getRole().name());
        return new User(u.getEmail(), u.getPassword(), List.of(auth));
    }
}
