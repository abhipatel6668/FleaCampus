
        DROP DATABASE IF EXISTS book_share_db;
        CREATE DATABASE book_share_db;
        USE book_share_db;
        CREATE TABLE IF NOT EXISTS books(
            book_id VARCHAR(30) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            authors VARCHAR(255),
            publisher VARCHAR(255),
            edition VARCHAR(50),
            available_from DATE
        );
    INSERT INTO books (book_id, title, category, authors, publisher, edition, available_from) VALUES
("OII945870", "Organic intangible initiative", "Database", "Carol Alvarez", "Packt Publishing", "3rd Edition", "2024-12-06"),
("AIH667471", "Advanced intangible hardware", "HPC", "Brianna Delacruz", "O'Reilly Media", "4th Edition", "2024-11-21");