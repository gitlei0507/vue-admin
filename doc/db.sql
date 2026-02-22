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


CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint NOT NULL DEFAULT '0',
  `menu_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `path` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  `component` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sort_no` int NOT NULL DEFAULT '0',
  `visible` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_code` varchar(32) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sys_role_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` bigint NOT NULL,
  `menu_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_menu` (`role_id`,`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;