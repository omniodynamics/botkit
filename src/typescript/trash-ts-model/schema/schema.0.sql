-- Create the Users table without the address column
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL
);

-- Insert 10 sample records. Note: SQLite doesn't have a built-in way to generate random data,
-- so we'll use predefined realistic data here.
INSERT INTO Users (name, age) VALUES
    ('Alice Johnson', 28),
    ('Bob Smith', 35),
    ('Charlie Brown', 42),
    ('Diana Lee', 22),
    ('Ethan Williams', 50),
    ('Fiona Davis', 31),
    ('George Chen', 47),
    ('Hannah Patel', 29),
    ('Isaac Rodriguez', 33),
    ('Julia Martin', 55);