package com.comphub.component;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface ComponentRepository extends JpaRepository<Component, Long> , JpaSpecificationExecutor<Component> {

    @Query("""
            SELECT component
            FROM Component component
            WHERE component.user.username = :username
""")
    Page<Component> findAllByUserUsername(@Param("username") String username, Pageable pageable);

    @Query("""
            SELECT c FROM Component c
            JOIN c.categories cat
            WHERE cat.id IN :categoryIds
            GROUP BY c.id
            HAVING COUNT(DISTINCT cat.id) = :categoryCount
            """)
    Page<Component> findByCategoryIds(Set<Long> categoryIds,long categoryCount, Pageable pageable);

    @Query("""
            SELECT c.name
            FROM Component c
            WHERE c.user.username = :username
    """)
    Set<String> findComponentNamesByUsername(@Param("username") String username);



}