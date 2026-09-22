-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: culturatechbg
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `agenda_personal`
--

DROP TABLE IF EXISTS `agenda_personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agenda_personal` (
  `id_agenda` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_evento` int NOT NULL,
  `fecha_programada` datetime NOT NULL,
  `notas` text,
  PRIMARY KEY (`id_agenda`),
  UNIQUE KEY `uq_usuario_evento_agenda` (`id_usuario`,`id_evento`),
  KEY `fk_agenda_evento` (`id_evento`),
  CONSTRAINT `fk_agenda_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`),
  CONSTRAINT `fk_agenda_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda_personal`
--

LOCK TABLES `agenda_personal` WRITE;
/*!40000 ALTER TABLE `agenda_personal` DISABLE KEYS */;
/*!40000 ALTER TABLE `agenda_personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (9,'Cultura','Eventos culturales de Bogotá'),(10,'Música','Eventos musicales de Bogotá'),(11,'Arte','Eventos y exposiciones de arte'),(12,'Teatro','Eventos de artes escénicas y teatro'),(13,'Cine','Eventos y proyecciones cinematográficas'),(14,'Danza','Eventos de danza y expresión corporal'),(16,'Ciencia','Espacio dedicado a divulgar el conocimiento científico y su relación con la cultura, la innovación y la vida cotidiana en Bogotá.');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evento`
--

DROP TABLE IF EXISTS `evento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento` (
  `id_evento` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text,
  `fecha_hora` datetime NOT NULL,
  `costo` decimal(10,2) DEFAULT '0.00',
  `imagen` text,
  `estado` varchar(255) DEFAULT NULL,
  `id_categoria` int NOT NULL,
  `id_lugar` int NOT NULL,
  PRIMARY KEY (`id_evento`),
  KEY `fk_evento_categoria` (`id_categoria`),
  KEY `fk_evento_lugar` (`id_lugar`),
  CONSTRAINT `fk_evento_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  CONSTRAINT `fk_evento_lugar` FOREIGN KEY (`id_lugar`) REFERENCES `lugar` (`id_lugar`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento`
--

LOCK TABLES `evento` WRITE;
/*!40000 ALTER TABLE `evento` DISABLE KEYS */;
INSERT INTO `evento` VALUES (5,'Gran Concierto de Jazz en el Parque','Festival de jazz más importante de la región con la participación de artistas internacionales y talento local.','2026-11-05 14:00:00',0.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuD5bqWtDYYRM7xn34piqP08SjnC-IEeI4dEXzgJatQe6LRuYg6f1BH-TYKfMX6O88u86UWJ8zpPI54BUAAX6xGuwwGwyD7a1RbzHXkd1J3F3NclTNh87sWCLNBqNn41hkPa55Hcc8n035fmgalE2IayTxmwO43QpPEdRBULtVzju9cEnM2FuvWKC7DsYJp3J5VmjXp18eG-fMMDv_6gP7y4Z0Le1K-SJVmPo7I_vo2QOpQ91lkNT93-Kcee0dYMB_WgWjWs9Kc_Qjk','ACTIVO',10,4),(6,'Exposición: Código y Lienzo','Muestra interactiva de arte digital y algoritmos creativos en el espacio expositivo del MAMBO.','2026-10-15 10:00:00',65000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuA7flXkvkHoVgCyHn6pJtlchbgCtlePI4jLMl2rCcIFuwZ_hbzWxkNue97p3O5UbGqS5JkqD-pkDdMs3TVE13wAE2xGUfh6SNBmQj-OFiKMv2gQgt3_0jVQwAW4iYAc9Dd7-W4pM5LAiA-LrElTw5wWjwxdmpGefXSw1fwJ8WfN7wxBiJkGo9-jIr3uDroBzH7qziXi992CJ4OrFF4ze6DUcEwfNcY2FrTsMxgSCsKTiKFHqgwkpC45','ACTIVO',11,8),(7,'Festival de Sintetizadores Andinos','Presentación musical en vivo combinando instrumentos autóctonos y sintetizadores analógicos.','2026-10-21 20:00:00',45000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuAI8joWh3leFWcvpaO8YBTdWEfMm-qAbLnuiSoMp3RmA9xfZgp4H1jW30WZISqsLeYP23KO1K_vBHhrt8YNjBcpG3up1OI_O_2Uag5geRncTN2bpDNA5hCEnYWalBSC6us1ntDJtDjQUfTkkE3dyXC0GblsiHuRztJujcDDLlx2Vi--tH4Q5TaQEkwIc_qZ6Zsnr50TQc-Nu2PH-c0GPQfPZ6CViDPa6Jlert-HCoT_yrQnQXCbnV6v','ACTIVO',10,6),(8,'Realidad Aumentada para Patrimonio','Taller interactivo de creación de experiencias AR para la conservación del centro histórico.','2026-11-02 14:00:00',35000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuB23Jg6xU_vaxqTCMgfyra5gh7wHQ0uS_KAjPo0J-xB0-48ulYD9zzF39iT-F0uNuqIWq6IJ2E7Ffpqx75LcuI3euZ2MVQHQnZ8Hh1o_waE6FXXgHjIYAF_Mk5eRQhtN-N-dyUtNWxl1xPaLc3BH0GBP8SIdGiUSAXrFWngYlKNOA8yrm2USBuDHg5CF7Orc4ATeXPX0eGtZFia23Uy_5mBmaxBJdVTuAP1KRvOFjXYYUlSUrRNfZLd','ACTIVO',11,7),(9,'Exposición Botero Moderno','Recorrido curatorial por esculturas monumentalistas y piezas representativas del maestro Fernando Botero.','2026-10-24 10:00:00',78000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuDx1U_3ggx6-RBigEMjBnrWXotbt3xHY2uU_NpyiSpjBmIlkzL16X4qrpK2XjRIAheGj27Uk-u_KQOdP8pqsWwyKvyo8_jVMwpztEILXj-25eJHJEgD21X3WVja9s42s7cLzneXomt4iUOnMelHYnj1QexrFzWWhSjugd952a2hFHnsGcjwZZ6wAKHFL-FGGs4HrW8XwFUtoF2-RgVWUtzbq1IyFMKEONvwkjUiuBbHmkWyjdibK0Nn','ACTIVO',11,8),(10,'Sinfónico: Cumbia & Tech','Concierto especial de la Orquesta Filarmónica interpretando arreglos sinfónicos electro-cumbia.','2026-10-26 19:00:00',35000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuAYvGMMbV6YtNFJtgPa9n8dzPZsIWWNHilbRPI9eeAWtf-zgwXnIXJrwYLDGe0JayVKwtGDtydMI0uDBJ2LZgujFMEha-ExgJUr-MIgEKOa26yjTTIUwPlzKBF9n-dYvAcPfkhbkg894sq2ABLxHbV2swEx5cqHsHU4uckjqf1eGVF0m9N5S3co_EmYewhnEaUSF_AbGZBh806EkGsrs3IqHVPSlmXAK04ftOL5Es1XNAmtjrjjtSAB','ACTIVO',10,9),(11,'Taller de Realidad Aumentada Histórica','Sesión educativa sobre astronomía, navegación prehispánica e interacción hologramática.','2026-11-02 14:00:00',0.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuDeJaxx3hxSBKJi1PxEfLejQcoF13LtfypbnIh1koveVXzruyYFEurJhb7v_hlTsWhS9stR-VtSFTe9m_TgloZUINGYwOK7ILbLKQyywFG71gO7U1oBlatEZIgqQ_EveLvYVzUfNCKW4vyJsRlnftZuwsWhX4HQb0tnFUW1T3coKKuFQzYW9_-hBp71srm7sn5KaAv26JLzDPe_txTNGKfhDvb4NaZ-rpzMOCDeUPEMCXbBA_p1HVl7','ACTIVO',11,10),(12,'Hamlet en el Jorge Eliécer','Adaptación contemporánea teatral de Shakespeare en el Teatro Gaitán.','2026-11-12 19:00:00',25000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuAJZzRNWO8TijslfVhrU6wn8FX81E9rg9YdpDhlAm4zusvmtB7cCLE50ko5SZrSo4GHtKpRDSeaws11PWM1Yd9auBIFTASqbHum-Ezn3ifEb2ESINoiIa2bycp4uJhizCP-0A8y3OTabyegYWdmSILRiw7-FG6HF6oTKLKcZSsCrhOZ-2w7QGzhCMKA5DIhv_bqqXlwj3NUVrBqatJnrkYH3HBUe4w2UIyfv4XwtNrNM98bThpqdXU2jaw9tCvv4gqkL_FeHVzwh0Q','ACTIVO',12,11),(13,'Exposición de Arte Joven','Muestra colectiva de nuevos talentos de las facultades de artes visuales de Bogotá.','2026-11-20 10:00:00',43000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuDN8WwtkDhDMTPf_cZ3k79dGowiOpGp5SJIFCgAsScqAyiWJVoUmA813DUH-llynXtxWbEhYxZ-emSQFSZyyWMgYFeZToEzoDgrReK1pM5DNMW5ab_Y52L0HgSCoRurYhNX8XCoyO4FWIsO8s6qoY56ww39180aHxzkMIWVT1KUsm4JOvhSlLlt_5_FVAD68MfZbLifu7nBzpJRHmi4TIHmfg1d3uYkDp2MGkpr9OtoG39HR0DvKTjPMl06132AFZoJ0c2HZTVCx9A','ACTIVO',11,12),(14,'Muestra Internacional de Cine Capital','Proyección de largometrajes documentales y ficción en pantalla gigante.','2026-11-18 16:00:00',8000.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuAMUJokjth6XPDP-qw7WKSyUh7pno2SfSi9Pt0ifGcV5VWqHq7WdCmhTb54JLrbtCz_wj-tGXR-Gp87MvRa-MyuPC7RI-GfBUm_SEcvZ5xnwNjElZy5JnK_mDMF3w2oAk3cEDJrCKegr2WHI-bEsKQjkZqKghnCBW1R1y7y5FsYP-NJSCtNHyzGEtLUa_ExjSbx-poYxv34ta_opBL3R5208M1J4nIX1JhFohcB6PYCT6AnrIjesSjeCzpV2YPeTPWeIYcWKdW70FU','ACTIVO',13,13),(15,'Encuentro Distrital de Danza Contemporánea','Competencia y exhibición de colectivos urbanos y danza contemporánea de Bogotá.','2026-11-20 15:00:00',0.00,'https://lh3.googleusercontent.com/aida-public/AB6AXuAU2hUQVr8I2zd5VFx_MAkwAlBbhcqojXUtj2OYn5202HxGEY2pspwnLOoFFeM4R2Vg_Y6y7tdrxW3MopSRr1-NgdTP_V0UGaAUk_wGgLRjw0QioG1rsSG2hJ9nrd6Z3UudA2B_ZYj2Dj0d8PC7sv_3cLLae3s1MKAd_F_Rbqrsj9N0Eky92abVHywez0kqfdRPOHZfEnXLLlkcfezycH9f6-V-rLpUS9orpmluajqUCOmfQnACbO4vASW2ZAPw8Jqm-qcokDjO4cU','ACTIVO',14,14),(16,'Festival Cordillera 2026','Los días 12 y 13 de septiembre, el Parque Metropolitano Simón Bolívar volverá a recibir el Festival Cordillera, uno de los encuentros musicales más importantes de América Latina. Bajo el lema \"El futuro es latino\", miles de asistentes disfrutarán de un cartel que reúne a grandes referentes de la música en español y a nuevas generaciones de artistas que representan la diversidad sonora del continente. Durante dos días, Bogotá será el punto de encuentro para celebrar la identidad latinoamericana a través del rock, el pop, la cumbia, el reggae, el folclor, el hip hop y otros géneros que hacen vibrar a la región. Más información: https://www.cordillerafestival.com/','2026-09-12 14:00:00',799.00,'https://visitbogota.co/sites/default/files/styles/wide/public/2026-06/FOTO%20PORTADA%20Y%20SEO_3.jpeg.webp?itok=Z568RqHR','ACTIVO',10,4),(17,'Jazz al Parque','El 12 y 13 de septiembre, Jazz al Parque vuelve a ponerle ritmo a la ciudad con sonidos de Latinoamérica, grandes invitados internacionales y el talento de la escena bogotana. Pero el plan no termina en el Parque El Country. Después del último acorde, Bogotá sigue sonando entre restaurantes, museos, galerías, cafés, compras, naturaleza y una vida nocturna que siempre invita a quedarse un poco más. Más información: https://jazzalparque.gov.co/.','2026-09-12 08:30:00',0.00,'https://jazzalparque.gov.co/sites/default/files/inline-images/Jazz_2026_Piano.png','ACTIVO',10,16),(20,'Ojos en el Universo - American Museum of Natural History de Nueva York','Eyes on the Universe es una exposición internacional organizada por el American Museum of Natural History de Nueva York que llega por primera vez a Colombia gracias al Planetario de Bogotá.\nLa muestra reúne impactantes imágenes del universo captadas por los telescopios espaciales Hubble y James Webb, así como por la misión Gaia, ofreciendo un recorrido por algunos de los descubrimientos más fascinantes de la astronomía contemporánea.\nDe entrada gratuita, la exposición reafirma el compromiso del Planetario de Bogotá con la divulgación científica y el acceso al conocimiento a través de una alianza internacional de gran relevancia. Lugar: Hall 2do piso.','2026-07-23 08:30:00',0.00,'https://planetariodebogota.gov.co/sites/default/files/styles/585px_x_731px/public/images-event/25.06%20Exposicio%CC%81n%20Ojos%20en%20el%20universo_Post.png?itok=z1Powtny','ACTIVO',16,10);
/*!40000 ALTER TABLE `evento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorito`
--

DROP TABLE IF EXISTS `favorito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorito` (
  `id_favorito` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_evento` int NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_favorito`),
  UNIQUE KEY `uq_usuario_evento_favorito` (`id_usuario`,`id_evento`),
  KEY `fk_favorito_evento` (`id_evento`),
  CONSTRAINT `fk_favorito_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`),
  CONSTRAINT `fk_favorito_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorito`
--

LOCK TABLES `favorito` WRITE;
/*!40000 ALTER TABLE `favorito` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lugar`
--

DROP TABLE IF EXISTS `lugar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lugar` (
  `id_lugar` int NOT NULL AUTO_INCREMENT,
  `nombre_lugar` varchar(150) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `localidad` varchar(100) NOT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `telefono` varchar(150) DEFAULT NULL,
  `pagina_web` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_lugar`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lugar`
--

LOCK TABLES `lugar` WRITE;
/*!40000 ALTER TABLE `lugar` DISABLE KEYS */;
INSERT INTO `lugar` VALUES (3,'Centro Cultural Bogotá','Carrera 7 # 11-20','La Candelaria',NULL,NULL,NULL,NULL),(4,'Parque Metropolitano Simón Bolívar','Calle 63 y 53 entre carreras 48 y 68','Teusaquillo',NULL,NULL,'(601) 660 5400','idrd.gov.co'),(6,'Centro Nacional de las Artes','Calle 11 # 5-51','La Candelaria',NULL,NULL,'(601) 381 6470','enartes.gov.co'),(7,'Cinemateca de Bogotá - Lab 2','Carrera 3 # 19-10','Santa Fe',NULL,NULL,'(601) 379 5750','cinematecadebogota.gov.co'),(8,'Museo de Arte Moderno','Calle 24 # 6-00','Santa Fe',NULL,NULL,'(601) 286 0466',NULL),(9,'Teatro Mayor JMSD','Av. Calle 170 # 67-51','Suba',NULL,NULL,'(601) 377 0600',NULL),(10,'Planetario de Bogotá','Calle 26 # 5-93','Santa Fe',4.61222200,-74.06888900,'(601) 379 5750 Ext. 9104 - 9105','informacion.planetariodebogota@idartes.gov.co'),(11,'Teatro Jorge Eliécer Gaitán','Carrera 7 # 22-47','Santa Fe',NULL,NULL,'(601) 379 5750',NULL),(12,'Galería Santa Fe','Carrera 1 # 12-15','La Candelaria',NULL,NULL,'(601) 379 5700',NULL),(13,'Cinemateca de Bogotá - Sala Capital','Carrera 3 # 19-10','Santa Fe',NULL,NULL,NULL,NULL),(14,'Teatro al Aire Libre La Media Torta','Calle 18 # 1-05 Este','La Candelaria',NULL,NULL,NULL,NULL),(16,'Parque Metropolitano El Country','Calle 127C con Carrera 11D','Usaquén',4.70627800,-74.03815300,'(601) 6605400 Ext.251 y 252. Línea gratuita: 01-8000-113199','https://www.idrd.gov.co/parques-y-escenarios/parque-el-country');
/*!40000 ALTER TABLE `lugar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id_notificacion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_evento` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_expiracion` datetime DEFAULT NULL,
  `estado` enum('VISIBLE','EXPIRADO') DEFAULT 'VISIBLE',
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notificacion_usuario` (`id_usuario`),
  KEY `fk_notificacion_evento` (`id_evento`),
  CONSTRAINT `fk_notificacion_evento` FOREIGN KEY (`id_evento`) REFERENCES `evento` (`id_evento`),
  CONSTRAINT `fk_notificacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento` (`documento`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Carlos Rodrigo','Ortegón Ladino','8018766294','1983-08-29','crortegon37@hotmail.com','120000:QpJSAQMM9j42sInLuNcKsA==:WVxqHQXV04AemBd3inl5QZWbGaTA0sLD7VZZ1wC/WNs=','ADMIN'),(2,'Pablo Francisco','Contreras','10874302341','1989-05-24','francis61cont@yahoo.com','120000:LcUkp9CoVYwSg7mMgsuKEA==:5ik4GEbxGNkY2wRKgicJM+vT0GO3ZlJO20zfFqS/blk=','USER');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-19 18:20:32
