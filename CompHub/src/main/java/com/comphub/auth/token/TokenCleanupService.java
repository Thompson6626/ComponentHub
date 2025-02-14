package com.comphub.auth.token;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TokenCleanupService {

    private final TokenRepository tokenRepository;


    public TokenCleanupService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }


    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupExpiredTokens() {
        int deletedCount = tokenRepository.deleteAllByExpiredIsTrueOrRevokedIsTrue();
        System.out.println("Cleaned up " + deletedCount + " expired tokens");
    }

}
