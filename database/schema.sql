-- ==============================================================================
-- Script de création de la base de données SQL - Projet Kanban (MariaDB/MySQL)
-- ==============================================================================

-- 1. Table USER (Parent)
CREATE TABLE USER (
    pseudo VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    isActive TINYINT(1) NOT NULL DEFAULT 1
);

-- 2. Table BOARD (Parent)
CREATE TABLE BOARD (
    id_board CHAR(36) PRIMARY KEY, -- UUID
    name VARCHAR(100) NOT NULL
);

-- 3. Table BOARD_MEMBER (Enfant de BOARD et USER)
CREATE TABLE BOARD_MEMBER (
    id_board CHAR(36) NOT NULL,
    pseudo VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL, -- Ex: 'CREATOR', 'PARTICIPANT'
    PRIMARY KEY (id_board, pseudo),
    FOREIGN KEY (id_board) REFERENCES BOARD(id_board) ON DELETE CASCADE,
    FOREIGN KEY (pseudo) REFERENCES USER(pseudo) ON DELETE CASCADE
);

-- 4. Table INVITATION (Enfant de BOARD et USER)
CREATE TABLE INVITATION (
    id_board CHAR(36) NOT NULL,
    pseudo VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    token VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id_board, pseudo),
    FOREIGN KEY (id_board) REFERENCES BOARD(id_board) ON DELETE CASCADE,
    FOREIGN KEY (pseudo) REFERENCES USER(pseudo) ON DELETE CASCADE
);

-- 5. Table BOARD_COLUMN (Enfant de BOARD)
CREATE TABLE BOARD_COLUMN (
    id_column CHAR(36) PRIMARY KEY, -- UUID
    name VARCHAR(100) NOT NULL,
    `order` INT NOT NULL, -- 'order' est un mot-clé SQL, souvent protégé par des backticks
    id_board CHAR(36) NOT NULL,
    FOREIGN KEY (id_board) REFERENCES BOARD(id_board) ON DELETE CASCADE
);

-- 6. Table TASK (Enfant de BOARD_COLUMN et USER)
CREATE TABLE TASK (
    id_task CHAR(36) PRIMARY KEY, -- UUID
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    `order` INT NOT NULL,
    priority INT,
    limit_date DATE,
    pseudo VARCHAR(50), -- Peut être NULL si la tâche n'est assignée à personne
    id_column CHAR(36) NOT NULL,
    FOREIGN KEY (pseudo) REFERENCES USER(pseudo) ON DELETE SET NULL,
    FOREIGN KEY (id_column) REFERENCES BOARD_COLUMN(id_column) ON DELETE CASCADE
);

-- 7. Table ACTION_LOG (Enfant de USER)
CREATE TABLE ACTION_LOG (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_id VARCHAR(36), -- Référence textuelle (UUID) vers une tâche, colonne, etc.
    pseudo VARCHAR(50) NOT NULL,
    FOREIGN KEY (pseudo) REFERENCES USER(pseudo) ON DELETE CASCADE
);
