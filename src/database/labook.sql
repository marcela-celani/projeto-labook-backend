-- Active: 1701135183107@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, email, password, role) VALUES
('u001', 'Fulano', 'fulano@email.com', '$2a$12$qPQj5Lm1dQK2auALLTC0dOWedtr/Th.aSFf3.pdK5jCmYelFrYadC', 'NORMAL'),
('u002', 'Beltrana', 'beltrana@email.com', '$2a$12$403HVkfVSUbDioyciv9IC.oBlgMqudbnQL8ubebJIXScNs8E3jYe2', 'NORMAL'),
('u003', 'Astrodev', 'astrodev@email.com', '$2a$12$lHyD.hKs3JDGu2nIbBrxYujrnfIX5RW5oq/B41HCKf7TSaq9RgqJ.', 'ADMIN');

-- tipo NORMAL e senha = fulano123
-- tipo NORMAL e senha = beltrana00
-- tipo ADMIN e senha = astrodev99

SELECT * FROM users;
DROP TABLE users;

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL, 
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

INSERT INTO posts (id, creator_id, content) VALUES
('p001', 'u001', 'Partiu happy hour!'),
('p002', 'u002', 'Hoje vou estudar POO!'),
('p003', 'u003', 'kkkkkkkkkrying');

SELECT * FROM posts;
DROP TABLE posts;

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

INSERT INTO likes_dislikes (user_id, post_id, like) VALUES('u001', 'p002', 1),
('u002', 'p001', 1),
('u003', 'p002', 1),
('u003', 'p002', 0);

UPDATE posts SET likes = 2 WHERE id='p002';
UPDATE posts SET dislikes = 2 - 1 WHERE id='p002';
UPDATE posts SET likes = 1 WHERE id='p001';

SELECT * FROM likes_dislikes;
DROP TABLE likes_dislikes;