CREATE TABLE IF NOT EXISTS users(
    user_id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs(
    blog_id SERIAL PRIMARY KEY,
    creator_name VARCHAR(255),
    creator_user_id VARCHAR(255),
    title VARCHAR(255),
    body TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_user_id)
        REFERENCES users(user_id)
);

INSERT INTO users(user_id, password, name)
VALUES
('john', '1234', 'John Smith'),
('alice', '1234', 'Alice Brown'),
('david', '1234', 'David Wilson')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO blogs
(creator_name, creator_user_id, title, body)
SELECT 'John Smith', 'john', 'Welcome', 'Welcome to my first blog.'
WHERE NOT EXISTS (
    SELECT 1 FROM blogs
    WHERE creator_user_id = 'john'
    AND title = 'Welcome'
);

INSERT INTO blogs
(creator_name, creator_user_id, title, body)
SELECT 'Alice Brown', 'alice', 'Learning Node', 'Node.js is easy to learn.'
WHERE NOT EXISTS (
    SELECT 1 FROM blogs
    WHERE creator_user_id = 'alice'
    AND title = 'Learning Node'
);

INSERT INTO blogs
(creator_name, creator_user_id, title, body)
SELECT 'David Wilson', 'david', 'Express', 'Express makes routing easy.'
WHERE NOT EXISTS (
    SELECT 1 FROM blogs
    WHERE creator_user_id = 'david'
    AND title = 'Express'
);

INSERT INTO blogs
(creator_name, creator_user_id, title, body)
SELECT 'John Smith', 'john', 'PostgreSQL', 'PostgreSQL stores data permanently.'
WHERE NOT EXISTS (
    SELECT 1 FROM blogs
    WHERE creator_user_id = 'john'
    AND title = 'PostgreSQL'
);

INSERT INTO blogs
(creator_name, creator_user_id, title, body)
SELECT 'Alice Brown', 'alice', 'EJS', 'EJS is useful for templates.'
WHERE NOT EXISTS (
    SELECT 1 FROM blogs
    WHERE creator_user_id = 'alice'
    AND title = 'EJS'
);

SELECT * FROM users;
SELECT * FROM blogs;
