CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'user',
  `password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '123',
  `uid` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;