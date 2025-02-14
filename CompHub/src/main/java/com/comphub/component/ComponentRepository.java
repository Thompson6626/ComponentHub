package com.comphub.component;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface ComponentRepository extends JpaRepository<Component, Long> , JpaSpecificationExecutor<Component> {

        @Query("""
                SELECT component
                FROM Component component
                WHERE component.user.username = :username
        """)
        Page<Component> findAllByUserUsername(@Param("username") String username, Pageable pageable);
        
        @Query("""
                SELECT c.name
                FROM Component c
                WHERE c.user.id = :userId
        """)
        Set<String> findComponentNamesByUserId(@Param("userId") Long userId);

        @Query("""
                SELECT c FROM
                Component c
                WHERE c.user.username = :username
                AND c.name = :name
                """)
        Optional<Component> findByUserUsernameAndName(@Param("username") String username, @Param("name") String name);

}