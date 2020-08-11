create database employees_db;

use employees_db;

CREATE table departments(
-- INT Primary Key --
id INTEGER NOT NULL AUTO_INCREMENT,
-- Department Name--
name VARCHAR(30) NOT NULL,
-- Set Primary Key --
primary key (id)
);

CREATE table employee_role (
-- INT Primary Key --
id INTEGER NOT NULL AUTO_INCREMENT,
-- Role title--
title VARCHAR(30) NOT NULL,
-- Role Salary--
salary INTEGER(10),
-- Department ID --
department_id INTEGER(10),
-- Set Primary Key --
primary key (id)
);

CREATE table employee (
-- INT Primary Key --
id INTEGER NOT NULL AUTO_INCREMENT,
-- First Name--
first_name VARCHAR(30) NOT NULL,
-- Last Name --
last_name VARCHAR(30) NOT NULL,
-- Role ID --
role_id INTEGER(10),
-- Manager ID --
manager_id INTEGER(10),
-- Set Primary Key --
primary key (id)
);

