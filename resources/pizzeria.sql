-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.10-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for pizzeria
DROP DATABASE IF EXISTS `pizzeria`;
CREATE DATABASE IF NOT EXISTS `pizzeria` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `pizzeria`;

-- Dumping structure for table pizzeria.ingredient
DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE IF NOT EXISTS `ingredient` (
  `ingredient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` float unsigned NOT NULL,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pizzeria.ingredient: ~3 rows (approximately)
DELETE FROM `ingredient`;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` (`ingredient_id`, `name`, `price`) VALUES
	(1, 'Pecurke Edit', 155),
	(2, 'Kackavalj', 10),
	(3, 'Test', 20);
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;

-- Dumping structure for table pizzeria.order
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('delivered','cancelled','pending') NOT NULL DEFAULT 'pending',
  `user_id` int(10) unsigned NOT NULL DEFAULT 0,
  `comment` text DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_order_user_id` (`user_id`),
  CONSTRAINT `fk_order_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pizzeria.order: ~4 rows (approximately)
DELETE FROM `order`;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` (`order_id`, `status`, `user_id`, `comment`) VALUES
	(19, 'pending', 5, 'asdawe'),
	(20, 'pending', 5, ''),
	(21, 'pending', 5, ''),
	(22, 'pending', 5, 'Test comment');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

-- Dumping structure for table pizzeria.order_pizza
DROP TABLE IF EXISTS `order_pizza`;
CREATE TABLE IF NOT EXISTS `order_pizza` (
  `order_pizza_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned NOT NULL DEFAULT 0,
  `pizza_id` int(10) unsigned NOT NULL DEFAULT 0,
  `quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `size` enum('small','medium','large') NOT NULL DEFAULT 'small',
  PRIMARY KEY (`order_pizza_id`),
  KEY `fk_order_pizza_order_id` (`order_id`),
  KEY `fk_order_pizza_pizza_id` (`pizza_id`),
  CONSTRAINT `fk_order_pizza_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_order_pizza_pizza_id` FOREIGN KEY (`pizza_id`) REFERENCES `pizza` (`pizza_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pizzeria.order_pizza: ~9 rows (approximately)
DELETE FROM `order_pizza`;
/*!40000 ALTER TABLE `order_pizza` DISABLE KEYS */;
INSERT INTO `order_pizza` (`order_pizza_id`, `order_id`, `pizza_id`, `quantity`, `size`) VALUES
	(49, 19, 15, 1, 'medium'),
	(50, 19, 14, 1, 'medium'),
	(51, 20, 14, 1, 'medium'),
	(52, 20, 15, 1, 'medium'),
	(53, 20, 15, 2, 'large'),
	(54, 21, 15, 1, 'medium'),
	(55, 21, 14, 1, 'small'),
	(56, 22, 15, 3, 'medium'),
	(57, 22, 16, 2, 'medium');
/*!40000 ALTER TABLE `order_pizza` ENABLE KEYS */;

-- Dumping structure for table pizzeria.pizza
DROP TABLE IF EXISTS `pizza`;
CREATE TABLE IF NOT EXISTS `pizza` (
  `pizza_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` float unsigned NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pizza_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pizzeria.pizza: ~4 rows (approximately)
DELETE FROM `pizza`;
/*!40000 ALTER TABLE `pizza` DISABLE KEYS */;
INSERT INTO `pizza` (`pizza_id`, `name`, `price`, `is_active`, `image_path`) VALUES
	(14, 'Margarita', 15, 1, 'static/uploads/2021/09/9ec58291-58d6-422d-8c40-3425ab83b7b5-margarita.jpg'),
	(15, 'Mexicana', 19, 1, 'static/uploads/2021/09/d4268c71-7193-4b2b-baaf-d26e58db21d7-mexicana.jpg'),
	(16, 'Peperoni', 20, 1, 'static/uploads/2021/09/d86c213e-2465-4a0a-98bd-ae99542d113b-peperoni.jpg'),
	(17, 'Capricoza', 16, 1, 'static/uploads/2021/09/2aa8afac-e90f-4bd2-9e10-a912d3245675-capricoza.jpg');
/*!40000 ALTER TABLE `pizza` ENABLE KEYS */;

-- Dumping structure for table pizzeria.pizza_ingredient
DROP TABLE IF EXISTS `pizza_ingredient`;
CREATE TABLE IF NOT EXISTS `pizza_ingredient` (
  `pizza_ingredient_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pizza_id` int(10) unsigned NOT NULL DEFAULT 0,
  `ingredient_id` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`pizza_ingredient_id`),
  KEY `fk_pizza_ingredient_pizza_id` (`pizza_id`),
  KEY `fk_pizza_ingredient_ingredient_id` (`ingredient_id`),
  CONSTRAINT `fk_pizza_ingredient_ingredient_id` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`ingredient_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_pizza_ingredient_pizza_id` FOREIGN KEY (`pizza_id`) REFERENCES `pizza` (`pizza_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pizzeria.pizza_ingredient: ~12 rows (approximately)
DELETE FROM `pizza_ingredient`;
/*!40000 ALTER TABLE `pizza_ingredient` DISABLE KEYS */;
INSERT INTO `pizza_ingredient` (`pizza_ingredient_id`, `pizza_id`, `ingredient_id`) VALUES
	(16, 14, 1),
	(18, 14, 3),
	(20, 15, 1),
	(21, 15, 3),
	(22, 16, 1),
	(23, 16, 3),
	(24, 15, 2),
	(25, 14, 2),
	(26, 16, 2),
	(27, 17, 1),
	(28, 17, 2),
	(29, 17, 3);
/*!40000 ALTER TABLE `pizza_ingredient` ENABLE KEYS */;

-- Dumping structure for table pizzeria.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(64) NOT NULL DEFAULT '0',
  `password_hash` varchar(255) NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '0',
  `phone_number` varchar(24) NOT NULL DEFAULT '0',
  `address` text NOT NULL DEFAULT '0',
  `is_admin` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table pizzeria.user: ~6 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`user_id`, `email`, `password_hash`, `name`, `phone_number`, `address`, `is_admin`, `created_at`) VALUES
	(3, 'test@gmail.com', '$2b$11$Ng/0qB3lsKmYW5Uwzn2GXuIzTYst74pC//OBBiu7.F6JkY9gyMZtC', 'Marko Kasporski :)', '*381 0693098510', 'Brace Jerkovic 125', 0, '2021-09-10 11:58:10'),
	(5, 'test123@gmail.com', '$2b$11$LYIPiIcZPTwlM0XzQUzQQ.ODcUPB4Ix/Y59POgKNc38JCGrouThoS', 'Marko Kasporski Registrovan', '*381 0693098510', 'Brace Jerkovic 125', 1, '2021-09-10 12:44:52'),
	(7, 'test12@gmail.com', '$2b$11$l75ulTym1FxImLPCQeOOq.ZYJbCnHB/tsnWAAUICJL8o/Ys5FNYCS', 'Marko 3', '123123123', 'Brace Jerkovic', 0, '2021-09-13 19:28:06'),
	(8, 'test126@gmail.com', '$2b$11$OoDjrEAmrnT8d7FVzM7kb.bFNId1STkE9VVYfo7BMe62UMLzNnCiy', 'Test', 'who cares', 'zero', 0, '2021-09-13 19:28:30'),
	(9, 'maqi@gmail.com', '$2b$11$0ekFT9j7X4YodTGiVadUHeYLy2pFvVNBzMcxUHhJc9znya36Yp5PC', '123', '123', '123', 0, '2021-09-13 20:12:39'),
	(16, 'user@gmail.com', '$2b$11$qRt3A2UacJoooPk14UX00eR5xNsQ6NcAz1e9mTqRIorNgkcg97RLa', 'Marko', '123123123', 'Brace Jerkovic', 0, '2021-09-14 19:10:10');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
