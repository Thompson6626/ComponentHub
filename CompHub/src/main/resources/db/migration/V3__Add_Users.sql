INSERT INTO users (username, email, password, role_id, account_locked, enabled, account_expired, credentials_expired, join_date)
VALUES
    ('admin', 'admin@example.com', '$2a$10$GNDSRBivvOTzmzXCbO9GY.WnqOuFW/zLzJOaLcU4GoXSzi2OqPRXu', 2, false, true, false, false, now()),
    ('user1', 'user1@example.com', '$2a$10$d3bShr7fO63EZbGD0cCkG.b1vj2lIdq6ouHbEamWELhiL4zkU4dZ2', 3, false, true, false, false, now()),
    ('user2', 'user2@example.com', '$2a$10$NFnhqomxtG30smFJKdPD7OSiae0uxQdVkatnfj1O56DD1HaWtSxzq', 3, false, true, false, false, now()),
    ('user3', 'user3@example.com', '$2a$10$py.6wLMG6g/cuhRFSQM5dey.Ar0GX5IFpVCKihlo7FSn7W0IlMcv6', 3, false, true, false, false, now()),
    ('user4', 'user4@example.com', '$2a$10$Fm4Lk.jcPV4DG2G.1mQGv.4l2Y8kSNVG14w9g4PGQYsXobdbRc0OO', 3, false, true, false, false, now()),
    ('user5', 'user5@example.com', '$2a$10$CrCTJzeb5U0DiD43zcvLTuIKAsg1WRrxIZ9oR4whSCEgnAOdmYRJ2', 3, false, true, false, false, now());