package com.comphub.component.userComponentVote;

import com.comphub.component.Component;
import com.comphub.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserComponentVoteRepository extends JpaRepository<UserComponentVote, Long> {
    Optional<UserComponentVote> findByUserAndComponent(User user, Component component);


    @Transactional
    @Modifying
    @Query("DELETE FROM UserComponentVote u WHERE u.voteType = :voteType")
    int deleteByVoteType(@Param("voteType") VoteType voteType);
}