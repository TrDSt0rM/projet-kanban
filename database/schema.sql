-- ==============================================================================
-- Script Complet Base de Données Kanban - Projet M1 Info (Obiwan)
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0; -- Désactive les contraintes pour le nettoyage
START TRANSACTION;

-- 1. Nettoyage des tables existantes
DROP TABLE IF EXISTS `ACTION_LOG`;
DROP TABLE IF EXISTS `TASK`;
DROP TABLE IF EXISTS `INVITATION`;
DROP TABLE IF EXISTS `BOARD_MEMBER`;
DROP TABLE IF EXISTS `BOARD_COLUMN`;
DROP TABLE IF EXISTS `BOARD`;
DROP TABLE IF EXISTS `APP_USER`;

-- 2. Création de la table APP_USER (Le pseudo est la clé primaire)
CREATE TABLE `APP_USER` (
                            `pseudo` varchar(50) NOT NULL,
                            `password` varchar(255) NOT NULL,
                            `role` varchar(20) NOT NULL DEFAULT 'USER',
                            `isActive` tinyint(1) NOT NULL DEFAULT 1,
                            PRIMARY KEY (`pseudo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 3. Création de la table BOARD (ID auto-généré)
CREATE TABLE `BOARD` (
                         `id_board` char(36) NOT NULL DEFAULT (UUID()),
                         `name` varchar(100) NOT NULL,
                         PRIMARY KEY (`id_board`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 4. Création de la table BOARD_COLUMN (ID auto-généré)
CREATE TABLE `BOARD_COLUMN` (
                                `id_column` char(36) NOT NULL DEFAULT (UUID()),
                                `name` varchar(100) NOT NULL,
                                `order` int(11) NOT NULL,
                                `id_board` char(36) NOT NULL,
                                PRIMARY KEY (`id_column`),
                                KEY `id_board` (`id_board`),
                                CONSTRAINT `FK_COLUMN_BOARD` FOREIGN KEY (`id_board`) REFERENCES `BOARD` (`id_board`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Création de la table TASK (ID auto-généré)
CREATE TABLE `TASK` (
                        `id_task` char(36) NOT NULL DEFAULT (UUID()),
                        `name` varchar(100) NOT NULL,
                        `description` text DEFAULT NULL,
                        `order` int(11) NOT NULL,
                        `priority` int(11) DEFAULT NULL,
                        `limit_date` date DEFAULT NULL,
                        `pseudo` varchar(50) DEFAULT NULL,
                        `id_column` char(36) NOT NULL,
                        PRIMARY KEY (`id_task`),
                        KEY `pseudo` (`pseudo`),
                        KEY `id_column` (`id_column`),
                        CONSTRAINT `FK_TASK_USER` FOREIGN KEY (`pseudo`) REFERENCES `APP_USER` (`pseudo`) ON DELETE SET NULL,
                        CONSTRAINT `FK_TASK_COLUMN` FOREIGN KEY (`id_column`) REFERENCES `BOARD_COLUMN` (`id_column`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 6. Création de la table BOARD_MEMBER
CREATE TABLE `BOARD_MEMBER` (
                                `id_board` char(36) NOT NULL,
                                `pseudo` varchar(50) NOT NULL,
                                `role` varchar(20) NOT NULL,
                                PRIMARY KEY (`id_board`,`pseudo`),
                                KEY `pseudo` (`pseudo`),
                                CONSTRAINT `FK_MEMBER_BOARD` FOREIGN KEY (`id_board`) REFERENCES `BOARD` (`id_board`) ON DELETE CASCADE,
                                CONSTRAINT `FK_MEMBER_USER` FOREIGN KEY (`pseudo`) REFERENCES `APP_USER` (`pseudo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 7. Création de la table INVITATION
CREATE TABLE `INVITATION` (
                              `id_board` char(36) NOT NULL,
                              `pseudo` varchar(50) NOT NULL,
                              `status` varchar(20) NOT NULL DEFAULT 'PENDING',
                              `token` varchar(255) NOT NULL,
                              PRIMARY KEY (`id_board`,`pseudo`),
                              UNIQUE KEY `token` (`token`),
                              KEY `pseudo` (`pseudo`),
                              CONSTRAINT `FK_INVIT_BOARD` FOREIGN KEY (`id_board`) REFERENCES `BOARD` (`id_board`) ON DELETE CASCADE,
                              CONSTRAINT `FK_INVIT_USER` FOREIGN KEY (`pseudo`) REFERENCES `APP_USER` (`pseudo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 8. Création de la table ACTION_LOG
CREATE TABLE `ACTION_LOG` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `action_type` varchar(50) NOT NULL,
                              `datetime` timestamp NULL DEFAULT current_timestamp(),
                              `target_id` varchar(36) DEFAULT NULL,
                              `pseudo` varchar(50) NOT NULL,
                              PRIMARY KEY (`id`),
                              KEY `pseudo` (`pseudo`),
                              CONSTRAINT `FK_LOG_USER` FOREIGN KEY (`pseudo`) REFERENCES `APP_USER` (`pseudo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1; -- Réactive les contraintes
COMMIT;