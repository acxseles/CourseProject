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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-15 17:56:13
