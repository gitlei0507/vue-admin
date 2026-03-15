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



DROP TABLE IF EXISTS `ipc_snmp_server`;
CREATE TABLE `ipc_snmp_server`  (
        `SERVERCODE` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '主键',
        `VER` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'SNMP版本',
        `SERVERNAME` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'SNMP服务器名称',
        `SERVERIP` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'SNMP服务器ip',
        `PORT` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '端口',
        `COMMUNITY` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'V2C版本团体名',
        `USERNAME` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'V3版本安全用户名',
        `CERTMETHOD` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'V3版本认证方式',
        `CERTPWD` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'V3版本认证密码',
        `ENCRYPTMETHOD` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'V3版本加密方式',
        `ENCRYPTPWD` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'V3版本加密密码',
        `TIMEOUT` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '超时时间',
        `MAXGETNUM` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '每次获取数据的最大个数',
        `SCANINTERVAL` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '探测间隔',
        `ENABLE` varchar(2) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '是否启用',
        `MEMO` varchar(300) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '备注',
        `CTUSER` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '创建人',
        `CTTIME` timestamp(6) NULL DEFAULT NULL COMMENT '创建时间',
        `UPUSER` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '更新人',
        `UPTIME` timestamp(6) NULL DEFAULT NULL COMMENT '更新时间',
        `PARAM1` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'PARAM1',
        `PARAM2` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'PARAM2',
        `PARAM3` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'PARAM3',
        PRIMARY KEY (`SERVERCODE`) USING BTREE,
        INDEX `IDX_IPCSNMP_IP`(`SERVERIP`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'SNMP服务器表' ROW_FORMAT = DYNAMIC;