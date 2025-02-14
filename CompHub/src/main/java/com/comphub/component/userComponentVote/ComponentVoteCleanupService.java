package com.comphub.component.userComponentVote;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ComponentVoteCleanupService {

    private final UserComponentVoteRepository componentVoteRepository;

    public ComponentVoteCleanupService(UserComponentVoteRepository componentVoteRepository) {
        this.componentVoteRepository = componentVoteRepository;
    }

    @Scheduled(cron = "0 0 2 * * ?")
    public void deleteNoneVotes() {
        int deletedCount = componentVoteRepository.deleteByVoteType(VoteType.NONE);
        System.out.println(deletedCount + " votes with type NONE deleted.");
    }
}

