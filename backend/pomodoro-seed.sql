-- inserts test user with the password 'password'
INSERT INTO users (username, password, first_name, last_name, email, avatar, num_pomodoros, is_admin)
VALUES ('testuser', 
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'testuser@email.com',
        'assets/default_pfp.jpg',
        0,
        FALSE);

-- inserts test admin with the password 'password'
INSERT INTO users (username, password, first_name, last_name, email, avatar, num_pomodoros, is_admin)
VALUES ('testadmin', 
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin',
        'testadmin@email.com',
        'assets/default_pfp.jpg',
        0,
        TRUE);

-- inserts test friend request from testuser to testadmin
INSERT INTO friends (sender, receiver, request_status)
VALUES ('testuser', 'testadmin', FALSE);

-- inserts test list for testuser
INSERT INTO lists (username)
VALUES ('testuser');

-- inserts test list for testadmin
INSERT INTO lists (username)
VALUES ('testadmin');

-- inserts test task for testuser
INSERT INTO tasks (title, list_id)
VALUES ('Test Task', 1);