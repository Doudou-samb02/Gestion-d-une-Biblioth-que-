package sn.unchk.bibliotheque.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Entity @Table(name="categories")
public class Categorie {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
  @Column(unique=true) private String nom;
  @OneToMany(mappedBy="categorie") private List<Livre> livres;
}
