-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: dev_simbiotime
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*Creation of the user used by the application to connect to the database*/

CREATE USER IF NOT EXISTS 'app_simbiotime'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON simbiotime.* TO 'app_simbiotime'@'localhost';
FLUSH PRIVILEGES;

--
-- Table structure for table `groups`
--


DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'Gamers',2);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `accumulated_time` int DEFAULT '0',
  `status` enum('Solicitud','Miembro') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Solicitud',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `members_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (2,2,1,-4,'Miembro'),(5,1,1,6,'Miembro');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `negotiations`
--

DROP TABLE IF EXISTS `negotiations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `negotiations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `offer_id` int DEFAULT NULL,
  `request_id` int DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `negotiated_time` int DEFAULT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  KEY `offer_id` (`offer_id`),
  KEY `request_id` (`request_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `negotiations_ibfk_1` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`),
  CONSTRAINT `negotiations_ibfk_2` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`),
  CONSTRAINT `negotiations_ibfk_3` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `negotiations_ibfk_4` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `negotiations`
--

LOCK TABLES `negotiations` WRITE;
/*!40000 ALTER TABLE `negotiations` DISABLE KEYS */;
/*!40000 ALTER TABLE `negotiations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `offered_time` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `status` enum('Abierta','Aceptada','Confirmada','Cancelada','Cerrada') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Abierta',
  `requester_id` int DEFAULT NULL,
  `publication_date` datetime NOT NULL,
  `accepted_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`creator_id`),
  KEY `group_id` (`group_id`),
  KEY `requester_id` (`requester_id`),
  CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `offers_ibfk_3` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,2,'Oferta 1','\na',5,NULL,'Confirmada',NULL,'2025-05-07 10:18:34',1),(2,2,'Oferta 1','Oferzco clases de matemáticas',1,NULL,'Confirmada',NULL,'2025-05-18 11:53:35',1),(3,2,'Arreglo de grifos','Si te gotea o el grifo suelta agua, puedo ayudarte. Normalmente entre llegar, comprobar y arreglar son 2 horas',2,1,'Abierta',NULL,'2025-05-20 11:22:20',NULL);
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int DEFAULT NULL,
  `reason` enum('INAPPROPRIATE_USER','INAPPROPRIATE_REQUEST_OR_OFFER','INAPPROPRIATE_MESSAGE','OFFER_OR_REQUEST_RESOLUTION_ISSUE','INAPPROPRIATE_GROUP') DEFAULT NULL,
  `message` text,
  `sent_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `resolution_date` datetime DEFAULT NULL,
  `status` enum('UNREAD','PENDING_RESOLUTION','IN_PROCESS','RESOLVED') DEFAULT 'UNREAD',
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creator_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `requested_time` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  `status` enum('Abierta','Aceptada','Confirmada','Cancelada','Cerrada') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'Abierta',
  `accepted_by` int DEFAULT NULL,
  `publication_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`),
  KEY `group_id` (`group_id`),
  KEY `accepted_by` (`accepted_by`),
  CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `requests_ibfk_3` FOREIGN KEY (`accepted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES (1,1,'Clases de Ciberseguridad','Necesito alguien que me explique las nociones básicas de ciberseguridad ofensiva para tener cierto conocimiento dobre como se defienden las diferentes infraestrucutras. Gracias',3,NULL,'Abierta',NULL,'2025-04-30 15:32:23'),(2,1,'Ayuda con el grifo','El grifo de mi baño está goteando y me gustaría que alguien le echase un vistazo, solo para saber si debería llamar a un fontanero. Gracias',1,NULL,'Abierta',NULL,'2025-05-01 11:49:06'),(3,2,'Solicitud 1','Solicitud 1',2,1,'Cerrada',NULL,'2025-05-13 12:06:18'),(4,2,'Ayuda','El grifo no se cierra',2,1,'Abierta',NULL,'2025-05-13 12:08:16');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `accumulated_time` int DEFAULT '0',
  `is_admin` tinyint(1) DEFAULT '0',
  `profile_picture` varchar(255) DEFAULT NULL,
  `skills` text,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Carlos Zarzuela','minizarzu@gmail.com','$2a$10$QHOW/6hSdXv5bjcqmfULOOZ.pVTi8y0RTrbFxIm9mTbXlRVQtPjMG','Nueva Ubicación','1990-01-01',-2,0,'profilePicture_8006bb302c955eb776d8db55ea9fd025.png','JavaScript, Node.js','b3350a67371ec8056acf1761eabdf4a1155fe3d0527042f9cb6d2010932dbf97','2025-06-13 10:44:42'),(2,'Zarzu2','zarzu@gmail.com','$2a$10$U79gUrfP4uE6fJFvmz92quF4oGNy9u6iMPW0pDSl3epUceLGas1WG','A','2025-04-30',4,0,NULL,'','597df43469d5efd628fee0536ee9b5cfc5a77534cee2d413a71e619bad1e1d6a','2025-05-29 08:45:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'dev_simbiotime'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-18 14:47:42
