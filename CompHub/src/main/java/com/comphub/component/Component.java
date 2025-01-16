package com.comphub.component;


import com.comphub.component.category.Category;
import com.comphub.component.componentFile.ComponentFile;
import com.comphub.user.User;
import com.comphub.component.userComponentVote.UserComponentVote;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "component",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {
                        "user_id",
                        "name"
                }
        ) // Ensure unique name for each user
)
public class Component {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false) // the user's foreign key
    private User user;

    private String name;

    private String description;

    @ManyToMany
    @JoinTable(
            name = "component_category", // join table name
            joinColumns = @JoinColumn(name = "component_id"), // foreign key to the Component table
            inverseJoinColumns = @JoinColumn(name = "category_id") // foreign key to the Category table
    )
    private Set<Category> categories;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(
            mappedBy = "component",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    List<ComponentFile> files;

    @OneToMany(
            mappedBy = "component",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<UserComponentVote> votes;

    public enum SortableField {
        NAME("name"),
        CREATED_AT("createdAt"),
        UPDATED_AT("updatedAt"),;

        private final String field;

        SortableField(String field) {
            this.field = field;
        }

        public static boolean isValid(String field) {
            for (SortableField sortableField : values()) {
                if (sortableField.field.equalsIgnoreCase(field)) {
                    return true;
                }
            }
            return false;
        }
    }

}
