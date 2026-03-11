-- 1. Les Utilisateurs
INSERT INTO APP_USER (pseudo, password, role, isActive) VALUES
                                                            ('neil_admin', 'admin123', 'ADMIN', 1),
                                                            ('user_test', 'pass123', 'USER', 1),
                                                            ('user_bloque', 'pass123', 'USER', 0);

-- 2. Le Board
INSERT INTO BOARD (name) VALUES ('Mon Premier Kanban');

-- 3. On récupère l'ID généré pour créer les colonnes
SET @my_board_id = (SELECT id_board FROM BOARD WHERE name = 'Mon Premier Kanban' LIMIT 1);

-- 4. Les Colonnes
INSERT INTO BOARD_COLUMN (name, `order`, id_board) VALUES
                                                       ('Backlog', 1, @my_board_id),
                                                       ('In Progress', 2, @my_board_id),
                                                       ('Done', 3, @my_board_id);

-- 5. Une tâche
SET @col_id = (SELECT id_column FROM BOARD_COLUMN WHERE name = 'Backlog' LIMIT 1);
INSERT INTO TASK (name, description, `order`, id_column, pseudo) VALUES
    ('Test Login', 'Vérifier que l admin peut se connecter', 1, @col_id, 'neil_admin');