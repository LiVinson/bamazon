DROP DATABASE bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id int unsigned not null auto_increment primary key,
    product_name varchar(255) not null,
    department_name varchar(55) not null,
    price decimal(10,2) unsigned not null,
    stock_quantity int unsigned default 5
);

INSERT INTO products
	(product_name, department_name, price, stock_quantity)
    VALUES
    ('laptop', 'electronics', 750.00, 10),
    ('television', 'electronics', 499.99, 5),
    ('headphones', 'electronics', 89.99, 15),
    ('camera', 'electronics', 300.00, 8),
    ('microwave', 'appliances', 200.00, 3),
    ('crockpot', 'appliances', 49.99, 7),
    ('toaster', 'appliances', 30.00, 20),
    ('lawn mower', 'tools', 499.00, 0),
    ('power tool set', 'tools', 129.00, 5),
    ('chain saw', 'tools', 200.00, 10),
    ('kayak', 'outdoors', 400.00, 3),
    ('bicycle', 'outdoors', 250.00, 5),
    ('basketball hoop', 'outdoors', 99.99, 4);


