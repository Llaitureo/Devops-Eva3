-- CONFIGURACIÓN PARA MÓDULO VENTAS
CREATE DATABASE IF NOT EXISTS innovatech_db;
CREATE USER IF NOT EXISTS 'innovatech_user'@'%' IDENTIFIED BY 'innovatech_pass';
GRANT ALL PRIVILEGES ON innovatech_db.* TO 'innovatech_user'@'%';


FLUSH PRIVILEGES;