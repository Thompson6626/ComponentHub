-- Components
INSERT INTO component (id, user_id, name, description, created_at, updated_at)
VALUES
    (nextval('component_seq'), 1, 'Primary Button', 'A standard primary button for forms', now(), now()),
    (nextval('component_seq'), 2, 'Sidebar Menu', 'A responsive sidebar navigation menu', now(), now()),
    (nextval('component_seq'), 3, 'Login Form', 'A reusable login form with validation', now(), now()),
    (nextval('component_seq'), 4, 'Heading Styles', 'Typography styles for headers', now(), now()),
    (nextval('component_seq'), 4, 'Icon Library', 'A collection of SVG icons', now(), now()),
    (nextval('component_seq'), 1, 'Checkbox', 'A simple checkbox for forms', now(), now()),
    (nextval('component_seq'), 2, 'Radio Button Group', 'A group of radio buttons for selection', now(), now()),
    (nextval('component_seq'), 3, 'Toggle Switch', 'A switch component for enabling/disabling options', now(), now()),
    (nextval('component_seq'), 4, 'Text Input', 'A standard text input field', now(), now()),
    (nextval('component_seq'), 5, 'Textarea', 'A multiline text input field', now(), now()),
    (nextval('component_seq'), 1, 'Dropdown Menu', 'A select dropdown for choosing options', now(), now()),
    (nextval('component_seq'), 2, 'Badge', 'A small status indicator for notifications', now(), now()),
    (nextval('component_seq'), 3, 'Avatar', 'A circular profile picture display', now(), now()),
    (nextval('component_seq'), 4, 'Progress Bar', 'A bar indicating progress towards a goal', now(), now()),
    (nextval('component_seq'), 5, 'Skeleton Loader', 'A placeholder loading animation', now(), now()),
    (nextval('component_seq'), 1, 'Tab Navigation', 'A tabbed interface for switching content', now(), now()),
    (nextval('component_seq'), 2, 'Stepper', 'A multi-step process indicator', now(), now()),
    (nextval('component_seq'), 3, 'Breadcrumbs', 'A navigation aid showing the user’s location', now(), now()),
    (nextval('component_seq'), 4, 'Snackbar', 'A temporary notification appearing at the bottom', now(), now()),
    (nextval('component_seq'), 5, 'Chip', 'A small, removable UI element for tagging', now(), now());