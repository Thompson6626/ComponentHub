package com.comphub.component.userComponentVote;

import com.comphub.component.Component;
import com.comphub.user.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_component_vote", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "component_id"})
}) // Prevent duplicate votes for the same component by the same user
public class UserComponentVote {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VoteType voteType; // UPVOTE or DOWNVOTE

}

