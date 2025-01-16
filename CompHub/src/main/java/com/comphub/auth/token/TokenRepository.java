package com.comphub.auth.token;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findAllByExpiredIsFalseOrRevokedIsFalseAndUserId(Long id);
    Optional<Token> findByToken(String token);
}
