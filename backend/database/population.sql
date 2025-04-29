-- Crear la base de datos
DROP DATABASE IF EXISTS `DEV_SIMBIOTIME`;
CREATE DATABASE IF NOT EXISTS `DEV_SIMBIOTIME`;
USE `DEV_SIMBIOTIME`;

-- Crear tablas
CREATE TABLE USERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    location VARCHAR(100),
    birth_date DATE,
    accumulated_time INT DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    profile_picture VARCHAR(255),
    skills TEXT
    reset_token VARCHAR(255),
    reset_token_expiry DATE
);

CREATE TABLE `GROUPS` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES USERS(id)
);

CREATE TABLE MEMBERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    group_id INT,
    accumulated_time INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(id)
);

CREATE TABLE REQUESTS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_creator_id INT,
    creator_id INT,
    title VARCHAR(255),
    description TEXT,
    requested_time INT,
    group_id INT,
    status ENUM('OPEN', 'ACCEPTED', 'CLOSED') DEFAULT 'OPEN',
    manager_id INT,
    FOREIGN KEY (group_creator_id) REFERENCES `GROUPS`(id),
    FOREIGN KEY (creator_id) REFERENCES USERS(id),
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(id),
    FOREIGN KEY (manager_id) REFERENCES USERS(id)
);

CREATE TABLE OFFERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    group_creator_id INT,
    title VARCHAR(255),
    description TEXT,
    offered_time INT,
    group_id INT,
    status ENUM('OPEN', 'ACCEPTED', 'CLOSED') DEFAULT 'OPEN',
    requester_id INT,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (group_creator_id) REFERENCES `GROUPS`(id),
    FOREIGN KEY (group_id) REFERENCES `GROUPS`(id),
    FOREIGN KEY (requester_id) REFERENCES USERS(id)
);

CREATE TABLE NEGOTIATIONS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    offer_id INT,
    request_id INT,
    sender_id INT,
    receiver_id INT,
    negotiated_time INT,
    message TEXT,
    FOREIGN KEY (offer_id) REFERENCES OFFERS(id),
    FOREIGN KEY (request_id) REFERENCES REQUESTS(id),
    FOREIGN KEY (sender_id) REFERENCES USERS(id),
    FOREIGN KEY (receiver_id) REFERENCES USERS(id)
);

CREATE TABLE MESSAGES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT,
    receiver_id INT,
    subject VARCHAR(255),
    body TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES USERS(id),
    FOREIGN KEY (receiver_id) REFERENCES USERS(id)
);

CREATE TABLE REPORTS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT,
    reason ENUM('INAPPROPRIATE_USER', 'INAPPROPRIATE_REQUEST_OR_OFFER', 'INAPPROPRIATE_MESSAGE', 'OFFER_OR_REQUEST_RESOLUTION_ISSUE', 'INAPPROPRIATE_GROUP'),
    message TEXT,
    sent_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolution_date DATETIME,
    status ENUM('UNREAD', 'PENDING_RESOLUTION', 'IN_PROCESS', 'RESOLVED') DEFAULT 'UNREAD',
    FOREIGN KEY (creator_id) REFERENCES USERS(id)
);

-- Insertar datos de prueba
INSERT INTO USERS (name, email, password, location, birth_date, is_admin, skills)
VALUES ('Juan Perez', 'juan@example.com', '1234', 'Madrid', '1990-05-15', TRUE, 'Programming, Design'),
       ('Maria Lopez', 'maria@example.com', 'abcd', 'Barcelona', '1985-08-20', FALSE, 'Marketing, Social Media');

INSERT INTO `GROUPS` (name, admin_id)
VALUES ('Development Group', 1);

INSERT INTO MEMBERS (user_id, group_id)
VALUES (1, 1), (2, 1);

INSERT INTO REQUESTS (group_creator_id, creator_id, title, description, requested_time, group_id, status)
VALUES (1, 2, 'Need help with a logo', 'Looking for a designer for a logo', 5, 1, 'OPEN');

INSERT INTO OFFERS (user_id, group_creator_id, title, description, offered_time, group_id, status)
VALUES (1, 1, 'Offering coding help', 'I can help with Python and JavaScript', 10, 1, 'OPEN');

INSERT INTO NEGOTIATIONS (offer_id, request_id, sender_id, receiver_id, negotiated_time, message)
VALUES (1, 1, 1, 2, 5, 'I help you with the logo, and you give me 5 hours of social media support.');

INSERT INTO MESSAGES (sender_id, receiver_id, subject, body)
VALUES (1, 2, 'Interested in the request', 'Hello, I can help you with the logo.');

INSERT INTO REPORTS (creator_id, reason, message)
VALUES (2, 'INAPPROPRIATE_USER', 'This user is sending offensive messages.');