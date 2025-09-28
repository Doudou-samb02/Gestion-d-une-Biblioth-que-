package sn.unchk.bibliotheque.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import sn.unchk.bibliotheque.dto.AvisDTO;
import sn.unchk.bibliotheque.entity.Avis;
import sn.unchk.bibliotheque.mapper.AvisMapper;
import sn.unchk.bibliotheque.repository.AvisRepository;

import java.util.List;

@Service
public class AvisService {

    private final AvisRepository repository;

    public AvisService(AvisRepository repository) {
        this.repository = repository;
    }

    /**
     * Récupère les derniers avis triés par date décroissante.
     * @param limit le nombre maximum d'avis à récupérer
     * @return liste d'AvisDTO
     */
    public List<AvisDTO> findRecentReviews(int limit) {
        // Pageable pour limiter le nombre de résultats
        PageRequest pageRequest = PageRequest.of(0, limit);
        List<Avis> avisList = repository.findRecentReviews(pageRequest);

        // Conversion vers DTO
        return avisList.stream()
                .map(AvisMapper::toDTO)
                .toList();
    }

    public List<AvisDTO> getAvisByLivre(Long livreId) {
        List<Avis> avisList = repository.findByLivreIdOrderByIdDesc(livreId);
        return avisList.stream()
                .map(AvisMapper::toDTO)
                .toList();
    }
}
