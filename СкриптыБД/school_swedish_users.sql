-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: school_swedish
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Role` enum('Student','Teacher','Admin') NOT NULL DEFAULT 'Student',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `IsActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'admin@school.com','$2a$11$ohoKJ0BdtZCOsrWoyvqOYuTu6NU3DkBYC.DJwBpnv4tcouaLl6.1i','Админ','Системный','Admin','2025-11-09 19:09:06',1),(16,'teacher@school.com','$2a$11$9QzqI1dDdv8/x.aedVJSy.MRNtL.idXHA12J91mbN1YNWG.PR0v0i','Анна','Преподаватель','Teacher','2025-11-09 19:09:06',1),(17,'student1@school.com','$2a$11$Ug4DLZENnUyk34Ttf7TH8eLMGzRBeFCm3uTQN0Nme67cPQbHBi9v.','Иван','Студентов','Student','2025-11-09 19:09:06',1),(18,'student2@school.com','$2a$11$UhgWO5Rac6fEktABNHb6AOLWA8pGeaujROzSgFb1s5DR6zYkAzD22','Мария','Ученикова','Student','2025-11-09 19:09:06',1),(20,'bog@gmail.com','$2a$11$mrErswKk3Ow4klkCtRvR2ej9kGBASKP0g073q7lhc6Km2B37DVHZu','Sasha','Bog','Student','2025-11-10 12:55:56',1),(23,'teacherksenia@school.com','$2a$11$p9.dDhpA0n0GaWWBMq3nl.ULAbVMgfHyiILmQQ4QW5pmQUmYQPSgO','Ксения','Богачева','Teacher','2025-12-09 12:12:31',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 17:56:12
