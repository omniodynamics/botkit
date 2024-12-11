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

-- Create the Address table
CREATE TABLE IF NOT EXISTS Address (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    street TEXT,
    city TEXT,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Insert sample addresses for each user
INSERT INTO Address (street, city, userId) VALUES
    ('123 Maple Street', 'Springfield', 1),
    ('456 Oak Avenue', 'Smithville', 2),
    ('789 Pine Road', 'Greenfield', 3),
    ('101 Elm Lane', 'Blueberry', 4),
    ('202 Cedar Blvd', 'Riverton', 5),
    ('303 Birch Drive', 'Lakeview', 6),
    ('404 Willow Court', 'Pineville', 7),
    ('505 Spruce Terrace', 'Oakwood', 8),
    ('606 Sycamore Path', 'Millfield', 9),
    ('707 Ash Way', 'Newtown', 10),
    -- Adding additional addresses for some users to simulate multiple addresses
    ('456 Birch Lane', 'Springfield', 1),
    ('789 Cedar Avenue', 'Smithville', 2),
    ('101 Pine Street', 'Greenfield', 3),
    ('202 Maple Drive', 'Blueberry', 4);

-- Query to check if the data was inserted correctly for both Users and Addresses
SELECT u.name, u.age, a.street, a.city 
FROM Users u 
LEFT JOIN Address a ON u.id = a.userId;