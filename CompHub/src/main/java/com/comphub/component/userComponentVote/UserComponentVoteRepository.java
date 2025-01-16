package com.comphub.component.userComponentVote;

import com.comphub.component.Component;
import com.comphub.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserComponentVoteRepository extends JpaRepository<UserComponentVote, Long> {
    Optional<UserComponentVote> findByUserAndComponent(User user, Component component);

}