CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id int
    unsigned not null auto_increment primary key,
    product_name varchar
    (255) not null,
    department_name varchar
    (55) not null,
    price decimal
    (10,2) unsigned not null,
    stock_quantity int unsigned default 5,
    product_sales decimal
    (13,2) unsigned  

);

    CREATE TABLE departments
    (
        department_id int
        unsigned not null auto_increment primary key,
        department_name varchar
        (55) not null,
        over_head_costs decimal
        (13,2) unsigned not null    
);
