package com.comphub.auth.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findAllByExpiredIsFalseOrRevokedIsFalseAndUserId(Long id);
    Optional<Token> findByToken(String token);

    @Transactional
    @Modifying
    @Query("""
        DELETE FROM tokens t
        WHERE t.revoked = true
        OR t.expired = true
""")
    int deleteAllByExpiredIsTrueOrRevokedIsTrue();
}
