-- Your SQL goes here
CREATE TABLE posts
(
    id VARCHAR NOT NULL PRIMARY KEY,
    school_id TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    timestamp INTEGER NOT NULL
)
