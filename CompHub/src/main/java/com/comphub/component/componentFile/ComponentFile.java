package com.comphub.component.componentFile;


import com.comphub.component.Component;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ComponentFile {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    private String filename;

    @Column(nullable = false)
    private Long size;

    @Lob
    private byte[] fileContent;

}
