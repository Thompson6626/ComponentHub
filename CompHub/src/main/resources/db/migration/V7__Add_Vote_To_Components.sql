-- Add votes for components
INSERT INTO user_component_vote (id, user_id, component_id, vote_type)
VALUES
    (nextval('user_component_vote_seq'), 2, 1, 'UPVOTE'),  -- frontend_dev2 likes Primary Button
    (nextval('user_component_vote_seq'), 3, 51, 'UPVOTE'),  -- frontend_manager likes Sidebar Menu
    (nextval('user_component_vote_seq'), 4, 101, 'DOWNVOTE'), -- guest_user dislikes Login Form
    (nextval('user_component_vote_seq'), 1, 151, 'UPVOTE'),  -- frontend_dev1 likes Heading Styles
    (nextval('user_component_vote_seq'), 1, 201, 'DOWNVOTE');     -- frontend_dev1 likes Icon Library