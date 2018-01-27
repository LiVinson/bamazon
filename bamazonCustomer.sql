DROP DATABASE bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id int unsigned not null auto_increment primary key,
    product_name varchar(255) not null,
    department_name varchar(55) not null,
    price decimal(10,2) unsigned not null,
    stock_quantity int unsigned default 5,
    product_sales decimal(10,2) unsigned
    

);

INSERT INTO products
	(product_name, department_name, price, stock_quantity)
    VALUES
    ('ASUS ZenBook 13.3-Inch Touchscreen Laptop', 'Electronics', 1089.00, 12),
    ('Samsung Electronics 40-Inch HD Smart LED TV', 'Electronics', 359.99, 5),
    ('Sony Noise Cancelling Headphone', 'Electronics', 348.00, 15),
    ('Canon Powershot SX530 HS Camera', 'Electronics', 300.00, 8),
    ('Toshiba Stainless Steel Compact Microwave', 'Appliances', 200.00, 3),
    ('Crock-Pot 6-Quart Slow Cooker', 'Appliances', 39.99, 7),
    ('Hamilton Beach Stainless Steel 2-Slice Toaster', 'Appliances', 30.00, 20),
    ('Troy-Bilt 7-Speed Riding Lawn Mower', 'Tools', 5499.00, 0),
    ('Dewalt 20V  Premium 5-Tool Toolset', 'Tools', 289.00, 5),
    ('Meditool 20-Inch Gas Powered Chain Saw', 'Tools', 149.00, 10),
    ('Sun Dolphin Aruba 10-Foot Kayak', 'Outdoors', 389.00, 3),
    ('GMC Denali Road Bike', 'Outdoors', 199.00, 5),
    ('Goalrilla In Ground Basketball Hoop', 'Outdoors', 1299.99, 4);


-- Department Table

CREATE TABLE departments(
    department_id int unsigned not null auto_increment primary key,
    department_name varchar(55) not null,
    over_head_costs int unsigned not null    
);

INSERT INTO departments
(department_name,  over_head_costs)
VALUES
(Electronics, 16000),
(Appliances, 5000),
(Tools, 12000),
(Outdoors, 8000);