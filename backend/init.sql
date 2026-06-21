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

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (66,31,'26',0,1),(67,31,'27',0,2),(68,31,'28',0,3),(69,31,'29',1,4),(70,32,'Æ, Ø, Å',0,1),(71,32,'Å, Ä, Ö',1,2),(72,32,'Ü, Ö, Ä',0,3),(73,32,'Å, Æ, Ö',0,4),(74,33,'Как русское \"О\"',0,1),(75,33,'Как русское \"А\"',0,2),(76,33,'Как \"О\" с более долгим звуком',1,3),(77,33,'Как \"У\"',0,4),(78,34,'God morgon',0,1),(79,34,'Hej',1,2),(80,34,'Hejdå',0,3),(81,34,'Tack',0,4),(82,35,'God kväll',0,1),(83,35,'Hej',0,2),(84,35,'Hejdå',1,3),(85,35,'Välkommen',0,4),(86,36,'Доброе утро',0,1),(87,36,'Приятно познакомиться',1,2),(88,36,' Как дела?',0,3),(89,36,'Спасибо',0,4),(90,37,'Hur mår du?',1,1),(91,37,'Vad heter du?',0,2),(92,37,'Var bor du?',0,3),(93,37,'Hur gammal är du?',0,4),(94,38,'Мне плохо, спасибо',0,1),(95,38,'У меня всё хорошо, спасибо',1,2),(96,38,'Я устал',0,3),(97,38,'Я занят',0,4),(98,39,'Jag är glad',0,1),(99,39,'Jag är trött',1,2),(100,39,'Jag är ledsen',0,3),(101,39,'Jag är hungrig',0,4),(102,40,'tio',1,1),(103,40,'tjugo',0,2),(104,40,'hundra',0,3),(105,40,'fem',0,4),(106,41,'tio',0,1),(107,41,'tjugo',0,2),(108,41,'hundra',1,3),(109,41,'tusen',0,4),(110,42,'tjugo två',1,1),(111,42,'tjugoett',0,2),(112,42,'tvåtjugo',0,3),(113,42,'tjugotre',0,4),(114,43,'pappa',0,1),(115,43,'mamma',1,2),(116,43,'bror',0,3),(117,43,'syster',0,4),(118,44,'syster',0,1),(119,44,'far',0,2),(120,44,'bror',1,3),(121,44,'mor',0,4),(122,45,'farmor',0,1),(123,45,'mormor',1,2),(124,45,'farfar',0,3),(125,45,' morfar',0,4),(126,46,'stol',0,1),(127,46,'bord',1,2),(128,46,'säng',0,3),(129,46,'fönster',0,4),(130,47,'penna',0,1),(131,47,'papper',0,2),(132,47,'bok',1,3),(133,47,'tidning',0,4),(134,48,'dörr',0,1),(135,48,'vägg',0,2),(136,48,'tak',0,3),(137,48,'fönster',1,4),(138,49,'te',0,1),(139,49,'mjölk',0,2),(140,49,'kaffe',1,3),(141,49,'vatten',0,4),(142,50,'Завтрак',0,1),(143,50,'Кофе-брейк с угощениями',1,2),(144,50,'Ужин',0,3),(145,50,'Обед',0,4),(146,51,'vatten',0,1),(147,51,'juice',0,2),(148,51,'mjölk',1,3),(149,51,'öl',0,4),(150,52,'höger',0,1),(151,52,'rakt fram',0,2),(152,52,'vänster',1,3),(153,52,'bakåt',0,4),(154,53,'Магазин',0,1),(155,53,'Аптека',1,2),(156,53,'Больница',0,3),(157,53,'Школа',0,4),(158,54,'vänster',0,1),(159,54,'höger',0,2),(160,54,'rakt fram',1,3),(161,54,'stopp',0,4),(162,55,'Varmt',0,1),(163,55,'Kallt',1,2),(164,55,'Soligt',0,3),(165,55,'Regnigt',0,4),(166,56,'Идёт дождь',0,1),(167,56,'Идёт снег',1,2),(168,56,'Солнечно',0,3),(169,56,'Ветрено',0,4),(170,57,'vinter',0,1),(171,57,'vår',0,2),(172,57,'sommar',1,3),(173,57,'höst',0,4),(174,58,'Jag älskar',0,1),(175,58,'Jag gillar',1,2),(176,58,'Jag tycker',0,3),(177,58,'Jag hatar',0,4),(178,59,'Мне нравится',0,1),(179,59,' Я ненавижу',0,2),(180,59,'Я люблю / обожаю',1,3),(181,59,'Я хочу',0,4),(182,60,'Vad gillar du att göra?',1,1),(183,60,'Var bor du?',0,2),(184,60,'Hur mår du?',0,3),(185,60,'Vad heter du?',0,4),(186,61,'Ingen fara',0,1),(187,61,'Det var så lite',1,2),(188,61,'Okej',0,3),(189,61,'Varsågod',0,4),(190,62,'Nej, jag vill inte',0,1),(191,62,'Tyvärr, jag kan inte den här gången. Kanske nästa gång',1,2),(192,62,'Jag orkar inte',0,3),(193,62,'Det är tråkigt',0,4),(194,63,'Извините, где находится туалет?',1,1),(195,63,'Извините, сколько стоит?',0,2),(196,63,'Извините, который час?',0,3),(197,63,'Извините, как пройти?',0,4),(198,64,'Где находится автобусная остановка?',1,1),(199,64,'Где находится вокзал?',0,2),(200,64,'Где находится аэропорт?',0,3),(201,64,'Где находится метро?',0,4),(202,65,'Jag behöver en tur och retur-biljett till Göteborg',1,1),(203,65,'Jag behöver en enkelbiljett till Göteborg',0,2),(204,65,'Jag vill ha en biljett till Stockholm',0,3),(205,65,'Kan jag köpa en biljett här?',0,4),(206,66,'Gå hem och vänta (Идти домой и ждать)',0,1),(207,66,'Kontakta personalen och säga: \"Mitt bagage är borta\" (Обратиться к персоналу и сказать: \"Мой багаж пропал\")',1,2),(208,66,'Köpa nya saker (Купить новые вещи)',0,3),(209,66,'Ringa polisen (Позвонить в полицию)',0,4),(210,67,'У меня временная работа',0,1),(211,67,'У меня постоянная работа',1,2),(212,67,' У меня работа на испытательном сроке',0,3),(213,67,'У меня подработка',0,4),(214,68,' Hej!',0,1),(215,68,'Tjena!',0,2),(216,68,'Till berörda parter',1,3),(217,68,' God dag',0,4),(218,69,'Обеденный перерыв',0,1),(219,69,'Короткий перерыв на кофе/чай с коллегами',1,2),(220,69,'Совещание',0,3),(221,69,'Опоздание на работу',0,4);
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (12,16,' Шведский алфавит и произношение','',100,NULL,'2026-05-17 13:59:08'),(13,17,'Приветствия и знакомство','',100,NULL,'2026-05-17 14:02:19'),(14,18,'Как дела? Эмоции и состояние','',100,NULL,'2026-05-17 14:04:53'),(15,19,'Числа и счёт','',100,NULL,'2026-05-17 14:06:55'),(16,20,'Моя семья','',100,NULL,'2026-05-17 14:09:21'),(17,21,'Повседневные предметы','',100,NULL,'2026-05-17 14:11:20'),(18,22,'Еда и напитки','',100,NULL,'2026-05-17 14:13:22'),(19,23,'Ориентация в городе','',100,NULL,'2026-05-17 14:15:36'),(20,24,'Погода и времена года','',100,NULL,'2026-05-17 14:17:45'),(21,25,'Мои увлечения','',100,NULL,'2026-05-17 14:20:11'),(22,26,'Тест к уроку 1','',100,NULL,'2026-05-17 14:36:36'),(23,27,'Тест к уроку 2 ','',100,NULL,'2026-05-17 14:43:34'),(24,28,'Тест к уроку 3','',100,NULL,'2026-05-17 14:48:21'),(25,29,'аааааааааа','ааааааааааааааа',100,NULL,'2026-05-20 11:24:20');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (28,'Вводный курс шведского языка','Бесплатный вводный курс для начинающих. Изучите основы шведского языка: алфавит, базовые фразы, приветствия. Идеальный старт перед покупкой полного курса!','Beginner',0.00,10,30,1,'2026-05-17 11:20:17',15),(29,'Разговорный шведский','Курс для тех, кто уже знает основы и хочет свободно общаться на шведском. Развитие разговорных навыков, расширение словарного запаса, практика в реальных ситуациях. Идеально для переезда, работы и путешествий.','Intermediate',12900.00,40,30,1,'2026-05-17 14:30:15',16),(32,'Тест','Тестирую оплату','Beginner',100.00,1,30,1,'2026-05-20 07:37:30',15),(33,'тестирую тесты','Ответы на тест пробую','Beginner',100.00,1,30,1,'2026-05-20 10:54:21',16);
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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES (45,15,28,'2026-05-17 11:30:36',0.00,NULL,'Active'),(47,17,28,'2026-05-17 11:59:17',0.00,NULL,'Active'),(48,29,28,'2026-05-17 13:59:35',10.00,NULL,'Dropped'),(49,27,28,'2026-05-17 14:48:44',0.00,NULL,'Dropped'),(50,27,29,'2026-05-17 14:55:02',66.00,NULL,'Dropped'),(53,28,29,'2026-05-18 14:02:34',0.00,NULL,'Dropped'),(55,28,28,'2026-05-18 14:02:39',0.00,NULL,'Dropped'),(59,16,28,'2026-05-18 14:08:54',0.00,NULL,'Active'),(60,26,29,'2026-05-18 14:09:11',0.00,NULL,'Dropped'),(61,29,29,'2026-05-20 07:43:14',0.00,NULL,'Dropped'),(63,28,33,'2026-05-20 11:24:55',100.00,NULL,'Dropped');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessonprogress`
--

DROP TABLE IF EXISTS `lessonprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessonprogress` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `StudentId` int NOT NULL,
  `LessonId` int NOT NULL,
  `IsCompleted` tinyint(1) NOT NULL DEFAULT '0',
  `CompletedAt` datetime DEFAULT NULL,
  `TestScore` int DEFAULT NULL,
  `TestAttempts` int DEFAULT '0',
  `TestCompletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `StudentId` (`StudentId`),
  KEY `LessonId` (`LessonId`),
  CONSTRAINT `lessonprogress_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `users` (`Id`),
  CONSTRAINT `lessonprogress_ibfk_2` FOREIGN KEY (`LessonId`) REFERENCES `lessons` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessonprogress`
--

LOCK TABLES `lessonprogress` WRITE;
/*!40000 ALTER TABLE `lessonprogress` DISABLE KEYS */;
INSERT INTO `lessonprogress` VALUES (3,27,16,1,'2026-05-17 14:49:14',100,1,'2026-05-17 14:49:14'),(4,27,17,1,'2026-05-17 14:50:00',100,1,'2026-05-17 14:50:00'),(5,27,18,1,'2026-05-17 14:50:28',100,1,'2026-05-17 14:50:28'),(6,27,19,1,'2026-05-17 14:51:01',100,1,'2026-05-17 14:51:01'),(7,27,20,1,'2026-05-17 14:51:30',67,1,'2026-05-17 14:51:30'),(8,27,21,1,'2026-05-17 14:52:07',67,1,'2026-05-17 14:52:07'),(9,27,22,1,'2026-05-17 14:52:27',100,1,'2026-05-17 14:52:27'),(10,27,23,1,'2026-05-17 14:53:35',67,3,'2026-05-17 14:53:35'),(11,27,24,1,'2026-05-17 14:53:56',100,1,'2026-05-17 14:53:56'),(12,27,25,1,'2026-05-17 14:54:35',100,2,'2026-05-17 14:54:35'),(14,27,26,1,'2026-05-18 14:05:55',100,1,'2026-05-18 14:05:55'),(15,27,27,0,NULL,0,2,'2026-05-18 14:06:54'),(16,27,28,1,'2026-05-20 10:29:22',100,1,'2026-05-20 10:29:22'),(17,29,16,1,'2026-05-20 10:30:03',67,1,'2026-05-20 10:30:03'),(18,29,17,0,NULL,0,1,'2026-05-20 10:30:14'),(19,28,29,1,'2026-05-20 11:25:29',100,2,'2026-05-20 11:25:29');
/*!40000 ALTER TABLE `lessonprogress` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (16,28,'Шведский алфавит и произношение','Шведский алфавит состоит из 29 букв. Три особенные буквы: Å, Ä, Ö. Изучим произношение каждой буквы, особенности долгих и кратких гласных, а также базовые правила ударения в шведских словах.',NULL,1,'2026-05-17 13:48:40'),(17,28,'Приветствия и знакомство','Как поздороваться, представиться и вежливо попрощаться. Основные фразы: Hej! (Привет), God morgon! (Доброе утро), God kväll! (Добрый вечер), Hej då! (Пока), Trevligt att träffas! (Приятно познакомиться).',NULL,2,'2026-05-17 13:49:02'),(18,28,'Как дела? Эмоции и состояние','Научитесь спрашивать \"Как дела?\" и отвечать на этот вопрос. Фразы: Hur mår du? (Как дела?), Jag mår bra, tack (Хорошо, спасибо), Jag är trött (Я устал), Jag är glad (Я рад).',NULL,3,'2026-05-17 13:51:46'),(19,28,'Числа и счёт','Числа от 0 до 100, как считать деньги, говорить о времени и возрасте. Особенности произношения сложных числительных и порядковых чисел.',NULL,4,'2026-05-17 13:52:16'),(20,28,'Моя семья','Слова для описания семьи: mamma (мама), pappa (папа), bror (брат), syster (сестра), mormor (бабушка по маме), farfar (дедушка по папе). Составление простых предложений о семье.',NULL,5,'2026-05-17 13:52:32'),(21,28,'Повседневные предметы','Названия предметов дома: bord (стол), stol (стул), fönster (окно), dörr (дверь), bok (книга), penna (ручка). Фразы для описания комнаты и предметов.',NULL,6,'2026-05-17 13:52:53'),(22,28,'Еда и напитки','Популярные шведские продукты: köttbullar (тефтельки), fika (кофе-брейк), smörgås (бутерброд), mjölk (молоко), kaffe (кофе). Как заказать еду в кафе и ресторане.',NULL,7,'2026-05-17 13:53:16'),(23,28,'Ориентация в городе','Как спросить дорогу и понять ответ. Слова: vänster (налево), höger (направо), rakt fram (прямо), station (станция), mataffär (продуктовый магазин), apotek (аптека).',NULL,8,'2026-05-17 13:53:38'),(24,28,'Погода и времена года','Как говорить о погоде: Det är kallt (Холодно), Det är varmt (Тепло), Det snöar (Идёт снег), Det regnar (Идёт дождь). Названия времён года и месяцев.',NULL,9,'2026-05-17 13:53:57'),(25,28,'Мои увлечения','Рассказ о хобби и интересах. Глаголы: gillar (нравится), älskar (обожаю), tycker om (люблю). Фразы для обсуждения свободного времени и планов на выходные.',NULL,10,'2026-05-17 13:54:14'),(26,29,'Повседневное общение и этикет','В этом уроке вы изучите ключевые фразы и выражения для повседневного общения в Швеции. Разберём особенности шведского этикета, правила вежливости и non-verbal communication.\n\nТемы урока:\n\n1) Приветствия и прощания в разных ситуациях\n\n- Формальные и неформальные приветствия\n\n- Приветствия по телефону и в письмах\n\n- Прощания в зависимости от времени суток\n\n2) Как начать и поддержать разговор\n\n- Small talk: погода, планы на выходные, хобби\n\n- Вопросы для знакомства\n\n- Как вежливо прервать разговор\n\n3) Выражение благодарности и извинения\n\n- Разные способы сказать \"спасибо\"\n\n- Как извиниться в формальной и неформальной обстановке\n\n- Ответы на извинения и благодарности\n\n4) Приглашения и отказы\n\n- Как пригласить друга/коллегу\n\n- Как вежливо отказаться\n\n- Как предложить альтернативу\n\n5) Телефонные разговоры\n\n- Стандартные фразы для звонка\n\n- Как оставить голосовое сообщение\n\n- Как попросить перезвонить\n\n6) Этикет в общественных местах\n\n- Очерёдность в магазинах и аптеках\n\n- Поведение в общественном транспорте\n\n- Как обратиться к незнакомцу\n\nКлючевая лексика урока:\n\nUrsäkta mig (Извините меня)\n\nFörlåt (Простите)\n\nTack så mycket (Большое спасибо)\n\nVarsågod (Пожалуйста / Вот возьмите)\n\nDet var så lite (Не за что)\n\nGärna (С удовольствием)\n\nTyvärr (К сожалению)\n\nKanske nästa gång (Может быть, в следующий раз)',NULL,1,'2026-05-17 14:34:11'),(27,29,'Путешествия, транспорт и навигация','Урок посвящён лексике и фразам для самостоятельных путешествий по Швеции и другим скандинавским странам.\n\nТемы урока:\n\n1) В аэропорту\n\n- Регистрация на рейс\n\n- Прохождение паспортного контроля\n\n- Обращение к сотрудникам аэропорта\n\n- Потеря багажа: что делать и как говорить\n\n2) На железнодорожном вокзале\n\n- Покупка билетов в кассе и автомате\n\n- Типы билетов: enkelbiljett (в один конец), tur och retur (туда-обратно)\n\n- Чтение расписания (tidtabell)\n\n- Объявления на вокзале\n\n3) Общественный транспорт\n\n- Как пользоваться SL (Stockholm), Västtrafik (Göteborg)\n\n- Покупка и активация билетов\n\n- Как спросить у водителя/пассажиров\n\n- Пересадки и зоны\n\n4) Аренда автомобиля\n\n- Необходимые документы\n\n- Как арендовать машину\n\n- Страховка и правила дорожного движения\n\n- Заправка автомобиля\n\n5) Ориентация в городе\n\n- Как спросить дорогу\n\n- Понимание указателей: Skylt\n\n- Использование карт и навигаторов\n\n- Ориентиры и достопримечательности\n\n6) Чрезвычайные ситуации\n\n- Как вызвать помощь: 112\n\n- Как объяснить проблему\n\n- Что говорить в полиции, скорой, пожарной службе\n\nКлючевая лексика урока:\n\nFlygplats (аэропорт)\n\nTågstation (железнодорожный вокзал)\n\nBusshållplats (автобусная остановка)\n\nBiljettautomat (билетный автомат)\n\nAvgång (отправление)\n\nAnkomst (прибытие)\n\nSpår (путь/платформа)\n\nHöger (направо)\n\nVänster (налево)\n\nRakt fram (прямо)',NULL,2,'2026-05-17 14:39:45'),(28,29,'Работа, карьера и деловая переписка','Урок для тех, кто планирует работать в Швеции или общаться со шведскими коллегами и партнёрами.\n\nТемы урока:\n\n1) Поиск работы\n\n- Где искать вакансии: Arbetsförmedlingen, LinkedIn, Indeed\n\n- Как читать объявления о вакансиях\n\n- Ключевые слова и сокращения\n\n- Что такое \"personligt brev\" и \"CV/meritförteckning\"\n\n2) Составление резюме и сопроводительного письма\n\n- Структура шведского CV\n\n- Что писать в personligt brev\n\n- Типичные ошибки\n\n- Примеры фраз для CV\n\n3) Собеседование\n\n- Как готовиться к интервью\n\n- Типичные вопросы работодателя\n\n- Как говорить о своих сильных сторонах\n\n- Вопросы, которые можно задать работодателю\n\n4) Первый день на работе\n\n- Знакомство с коллегами\n\n- Как представиться и рассказать о себе\n\n- Корпоративная культура в Швеции\n\n- Fika — важная часть рабочего дня\n\n5) Деловая переписка\n\n- Структура делового письма\n\n- Приветствия и прощания в письмах\n\n- Как запросить информацию\n\n- Как ответить на запрос\n\n6) Встречи и переговоры\n\n- Как назначить встречу\n\n- Фразы для начала презентации\n\n- Как выразить согласие/несогласие\n\n- Как подвести итоги встречи\n\nКлючевая лексика урока:\n\nAnställning (трудоустройство)\n\nTillsvidareanställning (постоянная должность)\n\nVisstidsanställning (срочный договор)\n\nProvanställning (испытательный срок)\n\nLöneanspråk (ожидаемая зарплата)\n\nRekrytering (набор персонала)\n\nUppsägningstid (срок уведомления об увольнении)\n\nPersonligt brev (сопроводительное письмо)\n\nReferenser (рекомендации)',NULL,3,'2026-05-17 14:45:41'),(29,33,'ппппппппппп','пппппппппппппппппппп',NULL,1,'2026-05-20 10:54:35');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `EnrollmentId` int NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `YooKassaPaymentId` varchar(255) NOT NULL,
  `Status` varchar(50) NOT NULL,
  `CreatedAt` datetime NOT NULL,
  `PaidAt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `EnrollmentId` (`EnrollmentId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`EnrollmentId`) REFERENCES `enrollments` (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (9,50,12900.00,'319bea86-000f-5000-b000-14aa58e7960f','pending','2026-05-17 14:55:03',NULL),(11,61,12900.00,'319f79d1-000f-5001-8000-18ef6ce450b6','pending','2026-05-20 07:43:15',NULL),(13,63,100.00,'319fadc6-000f-5001-9000-18b581f85f77','pending','2026-05-20 11:24:55',NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
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
  `QuestionType` enum('MultipleChoice','Written') NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `ExpectedAnswer` text,
  PRIMARY KEY (`Id`),
  KEY `AssignmentId` (`AssignmentId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`AssignmentId`) REFERENCES `assignments` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (31,12,'Сколько букв в шведском алфавите?','MultipleChoice','2026-05-17 13:59:08',NULL),(32,12,'Какие три дополнительные буквы есть в шведском алфавите?','MultipleChoice','2026-05-17 13:59:08',NULL),(33,12,'Как читается буква \"Å\" в шведском языке?','MultipleChoice','2026-05-17 13:59:08',NULL),(34,13,'Как по-шведски будет \"Привет\"?','MultipleChoice','2026-05-17 14:02:19',NULL),(35,13,'Как по-шведски будет \"До свидания\"?','MultipleChoice','2026-05-17 14:02:19',NULL),(36,13,'Что означает фраза \"Trevligt att träffas\"?','MultipleChoice','2026-05-17 14:02:19',NULL),(37,14,'Как спросить \"Как дела?\" по-шведски?','MultipleChoice','2026-05-17 14:04:53',NULL),(38,14,'Что означает \"Jag mår bra, tack\"?','MultipleChoice','2026-05-17 14:04:53',NULL),(39,14,'Как сказать \"Я устал\" по-шведски?','MultipleChoice','2026-05-17 14:04:53',NULL),(40,15,'Как будет \"10\" по-шведски?','MultipleChoice','2026-05-17 14:06:55',NULL),(41,15,'Как будет \"100\" по-шведски?','MultipleChoice','2026-05-17 14:06:55',NULL),(42,15,'Как будет \"22\" по-шведски?','MultipleChoice','2026-05-17 14:06:55',NULL),(43,16,'Как будет \"мама\" по-шведски?','MultipleChoice','2026-05-17 14:09:21',NULL),(44,16,'Как будет \"брат\" по-шведски?','MultipleChoice','2026-05-17 14:09:21',NULL),(45,16,'Как будет \"бабушка по маме\" по-шведски?','MultipleChoice','2026-05-17 14:09:21',NULL),(46,17,'Как будет \"стол\" по-шведски?','MultipleChoice','2026-05-17 14:11:20',NULL),(47,17,'Как будет \"книга\" по-шведски?','MultipleChoice','2026-05-17 14:11:20',NULL),(48,17,'Как будет \"окно\" по-шведски?','MultipleChoice','2026-05-17 14:11:20',NULL),(49,18,'Как будет \"кофе\" по-шведски?','MultipleChoice','2026-05-17 14:13:22',NULL),(50,18,'Что такое \"fika\" в шведской культуре?','MultipleChoice','2026-05-17 14:13:22',NULL),(51,18,'Как будет \"молоко\" по-шведски?','MultipleChoice','2026-05-17 14:13:22',NULL),(52,19,'Как будет \"налево\" по-шведски?','MultipleChoice','2026-05-17 14:15:36',NULL),(53,19,'Что означает \"apotek\"?','MultipleChoice','2026-05-17 14:15:36',NULL),(54,19,'Как сказать \"Прямо\" по-шведски?','MultipleChoice','2026-05-17 14:15:36',NULL),(55,20,'Как сказать \"Холодно\" по-шведски?','MultipleChoice','2026-05-17 14:17:45',NULL),(56,20,'Что означает \"Det snöar\"?','MultipleChoice','2026-05-17 14:17:45',NULL),(57,20,'Как будет \"лето\" по-шведски?','MultipleChoice','2026-05-17 14:17:45',NULL),(58,21,'Как сказать \"Мне нравится\" по-шведски?','MultipleChoice','2026-05-17 14:20:11',NULL),(59,21,'Что означает \"Jag älskar\"?','MultipleChoice','2026-05-17 14:20:11',NULL),(60,21,'Как спросить \"Чем ты любишь заниматься?\" по-шведски?','MultipleChoice','2026-05-17 14:20:11',NULL),(61,22,'Как правильно ответить на \"Tack så mycket\" в формальной ситуации?','MultipleChoice','2026-05-17 14:36:36',NULL),(62,22,'Как вежливо отказаться от приглашения, не обидев собеседника?','MultipleChoice','2026-05-17 14:36:36',NULL),(63,22,'Что означает фраза \"Ursäkta mig, var ligger toaletten?\"?','MultipleChoice','2026-05-17 14:36:36',NULL),(64,23,'Что означает \"Var ligger busshållplatsen?\"?','MultipleChoice','2026-05-17 14:43:34',NULL),(65,23,'Как сказать \"Мне нужен билет в один конец до Гётеборга\"?','MultipleChoice','2026-05-17 14:43:34',NULL),(66,23,'Что делать и что сказать, если вы потеряли багаж в аэропорту?','MultipleChoice','2026-05-17 14:43:34',NULL),(67,24,'Что означает \"Jag har en tillsvidareanställning\"?','MultipleChoice','2026-05-17 14:48:21',NULL),(68,24,'Как правильно начать деловое письмо, если вы не знаете имя получателя?','MultipleChoice','2026-05-17 14:48:21',NULL),(69,24,'Что такое \"fika\" в шведской рабочей культуре?','MultipleChoice','2026-05-17 14:48:21',NULL),(70,25,'Сколько лет Саше','Written','2026-05-20 11:24:20',NULL);
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
-- Table structure for table `special_courses`
--

DROP TABLE IF EXISTS `special_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `special_courses` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `MaxParticipants` int NOT NULL DEFAULT '5',
  `DurationMinutes` int NOT NULL DEFAULT '60',
  `Price` decimal(10,2) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT '1',
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `special_courses`
--

LOCK TABLES `special_courses` WRITE;
/*!40000 ALTER TABLE `special_courses` DISABLE KEYS */;
/*!40000 ALTER TABLE `special_courses` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentassignments`
--

LOCK TABLES `studentassignments` WRITE;
/*!40000 ALTER TABLE `studentassignments` DISABLE KEYS */;
INSERT INTO `studentassignments` VALUES (13,27,12,100.00,'2026-05-17 14:49:14',NULL,NULL),(14,27,13,100.00,'2026-05-17 14:50:00',NULL,NULL),(15,27,14,100.00,'2026-05-17 14:50:28',NULL,NULL),(16,27,15,100.00,'2026-05-17 14:51:01',NULL,NULL),(17,27,16,67.00,'2026-05-17 14:51:30',NULL,NULL),(18,27,17,67.00,'2026-05-17 14:52:07',NULL,NULL),(19,27,18,100.00,'2026-05-17 14:52:26',NULL,NULL),(20,27,19,67.00,'2026-05-17 14:53:35',NULL,NULL),(21,27,20,100.00,'2026-05-17 14:53:56',NULL,NULL),(22,27,21,100.00,'2026-05-17 14:54:35',NULL,NULL),(24,27,22,100.00,'2026-05-18 14:05:55',NULL,NULL),(25,27,23,0.00,'2026-05-18 14:06:54',NULL,NULL),(26,27,24,100.00,'2026-05-20 10:29:22',NULL,NULL),(27,29,12,67.00,'2026-05-20 10:30:03',NULL,NULL),(28,29,13,0.00,'2026-05-20 10:30:14',NULL,NULL),(29,28,25,100.00,'2026-05-20 11:25:29',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'admin@school.com','$2a$11$ohoKJ0BdtZCOsrWoyvqOYuTu6NU3DkBYC.DJwBpnv4tcouaLl6.1i','Админ','Системный','Admin','2025-11-09 19:09:06',1),(16,'teacher@school.com','$2a$11$9QzqI1dDdv8/x.aedVJSy.MRNtL.idXHA12J91mbN1YNWG.PR0v0i','Анна','Черемшенко','Teacher','2025-11-09 19:09:06',0),(17,'student1@school.com','$2a$11$Ug4DLZENnUyk34Ttf7TH8eLMGzRBeFCm3uTQN0Nme67cPQbHBi9v.','Иван','Студентов','Student','2025-11-09 19:09:06',1),(23,'teacherksenia@school.com','$2a$11$p9.dDhpA0n0GaWWBMq3nl.ULAbVMgfHyiILmQQ4QW5pmQUmYQPSgO','Ксения','Богачева','Teacher','2025-12-09 12:12:31',1),(26,'roma@school.com','$2a$11$fg1shllxzznRMLLelHDPEu1GmLtdEuGHjsc2TBQPiI7S24du5eUr2','Роман','Луев','Student','2026-05-17 13:17:44',1),(27,'mia@school.com','$2a$11$tYuOZX7KSc9/IvdWBXP63OpjX6R4ugKLb6.PdQHUEsdCH3vxH6PIe','Мия','Фролова','Student','2026-05-17 13:18:15',1),(28,'anton@school.com','$2a$11$ggQXe7kfuj2cI15NcItxGu0XVG53c3pSdXyE.B4rw7iVunqgDDeXG','Антон','Цырульник','Student','2026-05-17 13:19:05',1),(29,'alina@school.com','$2a$11$adhAd5197OzBKCcmTXP8nu5cqJl5v73yeZZyMLKORUnJxgZIhRItW','Алина','Фадеева','Student','2026-05-17 13:19:36',1);
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

-- Dump completed on 2026-06-21 23:43:02