package com.comphub.auth.token;

import com.comphub.user.User;
import jakarta.persistence.*;
import lombok.*;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "tokens")
@Getter
@Setter
public class Token {

    public enum TokenType {
        BEARER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true,length = 500)
    public String token;

    @Enumerated(EnumType.STRING)
    public TokenType type = TokenType.BEARER;

    public boolean revoked;
    public boolean expired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    public User user;



}
