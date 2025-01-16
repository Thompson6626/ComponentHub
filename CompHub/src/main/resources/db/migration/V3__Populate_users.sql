-- Insert an admin user
INSERT INTO users (username, email, password, role_id, account_locked, enabled)
VALUES
    ('admin', 'admin@example.com', 'p1', 1, false, true);

-- Insert a regular user
INSERT INTO users (username, email, password, role_id, account_locked, enabled)
VALUES
    ('user', 'user@example.com', 'p2', 2, false, true);