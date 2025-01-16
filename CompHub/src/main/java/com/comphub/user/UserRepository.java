package com.comphub.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);

    boolean existsByEmail(String email);
    boolean existsByUsername(String name);

    @Query("""
            SELECT u FROM User u
            LEFT JOIN FETCH u.components
            WHERE u.id = :userId
    """)
    Optional<User> findByUserIdWithComponents(@Param("userId") int id);

}
