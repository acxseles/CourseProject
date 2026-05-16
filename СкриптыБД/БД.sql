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
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `QuestionId` int NOT NULL,
  `Text` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IsCorrect` tinyint(1) DEFAULT '0',
  `OrderIndex` int DEFAULT '0',
  PRIMARY KEY (`Id`),
  KEY `QuestionId_idx` (`QuestionId`),
  CONSTRAINT `fk_answers_question` FOREIGN KEY (`QuestionId`) REFERENCES `questions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `LessonId` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `MaxScore` int DEFAULT '100',
  `Deadline` datetime DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `LessonId` (`LessonId`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`LessonId`) REFERENCES `lessons` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,1,'Тест: Основы шведского языка','Тест предназначен для проверки знаний по теме: алфавит, произношение и базовые фразы шведского языка.',5,NULL,'2025-12-04 17:08:36'),(2,2,'Тест: Повседневные диалоги и базовые фразы','Тест предназначен для проверки знаний по теме: приветствия, знакомства, вопросы и ответы, базовые фразы на шведском языке.',7,NULL,'2025-12-04 17:53:52');
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `Level` enum('Beginner','Intermediate','Advanced') NOT NULL,
  `Price` decimal(10,2) DEFAULT '0.00',
  `DurationHours` int NOT NULL,
  `MaxStudents` int DEFAULT '30',
  `IsActive` tinyint(1) DEFAULT '1',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `TeacherId` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `TeacherId` (`TeacherId`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`TeacherId`) REFERENCES `users` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (5,'Шведский для начинающих','Базовый курс шведского языка','Beginner',5000.00,40,30,1,'2025-11-09 19:09:06',16),(6,'Разговорный шведский','Развитие разговорных навыков','Intermediate',7000.00,30,30,1,'2025-11-09 19:09:06',16),(8,'Шведский язык: уровень Intermediate','Курс для изучающих шведский язык на среднем уровне: расширение словарного запаса, грамматика, разговорные навыки и чтение текстов.','Intermediate',80.00,30,30,1,'2025-12-04 17:48:11',15),(11,'тестовый курс','первый тестовый курс, все работает ','Beginner',500.00,20,30,1,'2025-12-09 12:13:05',23),(13,'Деловой шведский','Для бизнеса','Beginner',8000.00,80,10,1,'2025-12-09 12:40:44',16),(14,'тестовый шведский','описание нового курса','Intermediate',600.00,30,30,1,'2025-12-09 12:41:42',15);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `CourseId` int NOT NULL,
  `EnrolledAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Progress` decimal(5,2) DEFAULT '0.00',
  `Grade` decimal(5,2) DEFAULT NULL,
  `Status` enum('Active','Completed','Dropped') DEFAULT 'Active',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `unique_enrollment` (`StudentId`,`CourseId`),
  KEY `CourseId` (`CourseId`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `users` (`Id`),
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`CourseId`) REFERENCES `courses` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (9,17,5,'2025-11-09 19:09:06',47.00,NULL,'Active'),(10,17,6,'2025-11-09 19:09:06',63.00,NULL,'Active'),(11,18,5,'2025-11-09 19:09:06',61.00,NULL,'Active'),(12,18,6,'2025-11-09 19:09:06',61.00,NULL,'Active'),(13,18,8,'2025-12-04 18:24:56',0.00,NULL,'Active'),(14,18,11,'2025-12-09 12:13:28',0.00,NULL,'Active'),(15,18,14,'2025-12-09 12:43:17',0.00,NULL,'Active');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `CourseId` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text,
  `VideoUrl` varchar(500) DEFAULT NULL,
  `OrderIndex` int NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `CourseId` (`CourseId`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`CourseId`) REFERENCES `courses` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,5,'Основы шведского языка: произношение, алфавит и базовые фразы','В этой лекции рассматриваются базовые элементы шведского языка. Шведский алфавит состоит из 29 букв и включает три дополнительные буквы: Å, Ä и Ö, которые считаются отдельными символами и располагаются в конце алфавита. Особое внимание уделяется произношению звуков, которые могут быть непривычны русскоговорящим, например долгие и краткие гласные. Далее изучаются базовые приветственные фразы: \'Hej\' — привет, \'God morgon\' — доброе утро, \'God kväll\' — добрый вечер, \'Hej då\' — пока. Также разбираются простые структуры предложений, типичные для начального уровня: \'Jag heter …\' — меня зовут…, \'Jag kommer från …\' — я из…, \'Jag talar lite svenska\' — я немного говорю по-шведски. В конце лекции рассматриваются основы типичного шведского ударения и мелодики речи, которые играют важную роль в понимании и правильном произношении.',NULL,1,'2025-12-04 17:07:25'),(2,8,'Урок 1: Повседневные диалоги и базовые фразы','В этом уроке мы разберём ключевые повседневные диалоги на шведском языке. \n\n1. **Приветствия и прощания:**\n   - Hej! – Привет!\n   - God morgon! – Доброе утро!\n   - God kväll! – Добрый вечер!\n   - Hejdå! – До свидания!\n\n2. **Знакомство:**\n   - Vad heter du? – Как тебя зовут?\n   - Jag heter Anna. – Меня зовут Анна.\n   - Trevligt att träffas! – Приятно познакомиться!\n\n3. **Основные вопросы:**\n   - Hur mår du? – Как дела?\n   - Jag mår bra, tack. – У меня всё хорошо, спасибо.\n   - Var kommer du ifrån? – Откуда ты?\n   - Jag kommer från Sverige. – Я из Швеции.\n\n4. **В кафе и ресторане:**\n   - Jag skulle vilja ha en kaffe, tack. – Я бы хотел кофе, пожалуйста.\n   - Kan jag få notan, tack? – Можно счёт, пожалуйста.\n\n5. **В магазине:**\n   - Hur mycket kostar det? – Сколько это стоит?\n   - Jag vill köpa det här. – Я хочу это купить.\n\n6. **Полезные фразы:**\n   - Jag förstår inte. – Я не понимаю.\n   - Kan du upprepa, tack? – Можете повторить, пожалуйста?\n   - Ursäkta, var är toaletten? – Извините, где туалет?\n\n7. **Советы по изучению:**\n   - Повторяйте фразы вслух.\n   - Слушайте аудиозаписи носителей языка.\n   - Пробуйте использовать слова в простых диалогах каждый день.\n\nЭта лекция рассчитана на студентов со средним уровнем знаний, чтобы закрепить базовые повседневные ситуации и подготовиться к более сложным диалогам в следующих уроках.',NULL,1,'2025-12-04 17:52:52'),(3,11,'урок по теме тест','тест успешен',NULL,1,'2025-12-09 12:13:05'),(4,14,'лекция по курсу','сдержанеи лекции',NULL,1,'2025-12-09 12:41:42');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AssignmentId` int NOT NULL,
  `Text` varchar(1000) NOT NULL,
  `QuestionType` varchar(255) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  KEY `AssignmentId` (`AssignmentId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`AssignmentId`) REFERENCES `assignments` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,2,'Как по-шведски будет \'Привет\'?','single','2025-12-04 17:53:52');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `TeacherId` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `ReportType` enum('Progress','Grades','Attendance') NOT NULL,
  `GeneratedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `Data` json DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `TeacherId` (`TeacherId`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`TeacherId`) REFERENCES `users` (`Id`)
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
-- Table structure for table `studentassignments`
--

DROP TABLE IF EXISTS `studentassignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentassignments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `AssignmentId` int NOT NULL,
  `Score` decimal(5,2) DEFAULT NULL,
  `SubmittedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `FileUrl` varchar(500) DEFAULT NULL,
  `Feedback` text,
  PRIMARY KEY (`Id`),
  KEY `StudentId` (`StudentId`),
  KEY `AssignmentId` (`AssignmentId`),
  CONSTRAINT `studentassignments_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `users` (`Id`),
  CONSTRAINT `studentassignments_ibfk_2` FOREIGN KEY (`AssignmentId`) REFERENCES `assignments` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentassignments`
--

LOCK TABLES `studentassignments` WRITE;
/*!40000 ALTER TABLE `studentassignments` DISABLE KEYS */;
INSERT INTO `studentassignments` VALUES (1,18,1,0.00,'2025-12-24 14:19:07',NULL,NULL);
/*!40000 ALTER TABLE `studentassignments` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2025-12-24 17:25:53
