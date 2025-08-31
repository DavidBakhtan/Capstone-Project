-- noknuk_dump.sql
-- إنشاء قاعدة البيانات والجداول + تحميل البيانات
-- محارف و إعدادات عامة
SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS `noknuk`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `noknuk`;

-- =========================
-- جدول المستخدمين
-- =========================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name`     VARCHAR(191) NULL,
  `email`         VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          ENUM('guest','tech','admin','root') NOT NULL DEFAULT 'guest',
  `status`        ENUM('pending','active','disabled') NOT NULL DEFAULT 'pending',
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- (اختياري) إضافة مستخدم root:
-- 1) استبدل {{BCRYPT_OF_admin123}} بهاش مولّد بالأمر:
--    php -r "echo password_hash('admin123', PASSWORD_BCRYPT), PHP_EOL;"
-- 2) ثم فكّ التعليق عن السطر التالي:
-- INSERT INTO `users` (`full_name`,`email`,`password_hash`,`role`,`status`,`is_active`)
-- VALUES ('Root Admin','root@site.com','{{BCRYPT_OF_admin123}}','root','active',1);

-- =========================
-- جدول التصنيفات
-- =========================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_categories_name` (`name`),
  UNIQUE KEY `ux_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`name`,`slug`) VALUES
('Accessories','accessories'),
('Clothing','clothing'),
('Electronics','electronics'),
('Groceries','groceries'),
('Health','health'),
('Home & Kitchen','home-kitchen'),
('Home & Office','home-office'),
('Office Supplies','office-supplies'),
('Pet Supplies','pet-supplies'),
('Sports','sports'),
('Tools','tools')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `slug`=VALUES(`slug`);

-- =========================
-- جدول المنتجات
-- =========================
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`            VARCHAR(255) NOT NULL,
  `description`     TEXT NULL,
  `price`           DECIMAL(10,2) NOT NULL,
  `original_price`  DECIMAL(10,2) NULL,
  `sale_percentage` INT NOT NULL DEFAULT 0,
  `image_url`       VARCHAR(512) NULL,
  `store`           VARCHAR(191) NULL,
  `category_name`   VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_products_category_name` (`category_name`),
  KEY `ix_products_store` (`store`),
  CONSTRAINT `fk_products_category_name`
    FOREIGN KEY (`category_name`) REFERENCES `categories`(`name`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- تحميل بيانات المنتجات
INSERT INTO `products`
(`id`,`name`,`description`,`price`,`original_price`,`sale_percentage`,`image_url`,`store`,`category_name`) VALUES
(4,'Dog Food Premium','Premium dry dog food for adult dogs, 15kg bag.',54.99,NULL,0,'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop','PetSmart','Pet Supplies'),
(5,'Cat Litter','Clumping cat litter with odor control.',19.99,NULL,0,'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop','PetSmart','Pet Supplies'),
(6,'Dog Leash','Retractable dog leash for medium to large dogs.',24.99,NULL,0,'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop','PetSmart','Pet Supplies'),
(7,'Cat Toys Set','Interactive toy set for indoor cats.',14.99,NULL,0,'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop','PetSmart','Pet Supplies'),
(8,'Pet Bed','Comfortable pet bed for dogs and cats.',39.99,NULL,0,'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop','PetSmart','Pet Supplies'),

(9,'MARKUS Office Chair','Ergonomic office chair with adjustable height and built-in lumbar support.',229.99,NULL,0,'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop','IKEA','Home & Office'),
(10,'HEMNES Desk','Solid wood desk with 2 drawers. Perfect for home office or study.',179.99,NULL,0,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop','IKEA','Home & Office'),
(11,'BILLY Bookcase','Classic bookcase with adjustable shelves.',89.99,NULL,0,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop','IKEA','Home & Office'),
(12,'POÄNG Armchair','Comfortable armchair with bent wood frame.',149.99,NULL,0,'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop','IKEA','Home & Office'),
(13,'LACK Coffee Table','Simple and modern coffee table for living room.',49.99,NULL,0,'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=500&fit=crop','IKEA','Home & Office'),

(14,'Paper Towels 12-Pack','Bulk pack of paper towels for household use.',24.99,NULL,0,'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop','Costco Wholesale','Home & Kitchen'),
(15,'Kitchen Utensil Set','Basic kitchen utensil set including spatula and spoons.',4.00,NULL,0,'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop','Dollarama','Home & Kitchen'),
(16,'Storage Containers','Set of plastic storage containers with lids.',3.00,NULL,0,'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop','Dollarama','Home & Kitchen'),
(17,'Cleaning Supplies','Basic cleaning supplies for household use.',2.50,NULL,0,'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=500&h=500&fit=crop','Dollarama','Home & Kitchen'),

(18,'Notebook Set','Set of 3 lined notebooks for office use.',12.99,NULL,0,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop','Staples','Office Supplies'),
(19,'Desk Organizer','Multi-compartment desk organizer for office supplies.',19.99,NULL,0,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop','Staples','Office Supplies'),
(20,'Printer Paper','High-quality printer paper, 500 sheets.',24.99,NULL,0,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop','Staples','Office Supplies'),
(21,'Notebooks Pack','Pack of 3 notebooks for school or office.',3.50,NULL,0,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop','Dollarama','Office Supplies'),

(22,'Vitamin D3 Supplements','High-potency Vitamin D3 supplements for bone health.',12.99,NULL,0,'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop','Shoppers Drug Mart','Health'),
(23,'Moisturizing Face Cream','Daily moisturizing cream for all skin types.',18.99,NULL,0,'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop','Shoppers Drug Mart','Health'),
(24,'Pain Relief Tablets','Fast-acting pain relief tablets.',8.99,NULL,0,'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop','Shoppers Drug Mart','Health'),
(25,'Multivitamins','Complete daily multivitamin supplement.',24.99,NULL,0,'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop','Shoppers Drug Mart','Health'),
(26,'Sunscreen SPF 50','Broad spectrum sunscreen protection.',15.99,NULL,0,'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop','Shoppers Drug Mart','Health'),

(27,'Screwdriver Set','12-piece precision screwdriver set for home repairs.',24.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Canadian Tire','Tools'),
(28,'LED Work Light','Portable LED work light with adjustable brightness.',39.99,NULL,0,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop','Canadian Tire','Tools'),
(29,'Socket Wrench Set','Complete socket wrench set with carrying case.',49.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Canadian Tire','Tools'),
(30,'Drill Bits Set','Multi-purpose drill bits for various materials.',19.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Canadian Tire','Tools'),
(31,'Measuring Tape','25-foot measuring tape with magnetic tip.',12.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Canadian Tire','Tools'),

(32,'Paint Roller Set','Complete paint roller set with brushes and tray.',15.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Home Depot','Tools'),
(33,'Garden Gloves','Durable gardening gloves with grip coating.',8.99,NULL,0,'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop','Home Depot','Tools'),
(34,'Cordless Drill','Cordless drill with battery and charger.',89.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Home Depot','Tools'),
(35,'Level Tool','24-inch level tool for construction projects.',19.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Home Depot','Tools'),
(36,'Safety Goggles','Protective safety goggles for workshop use.',12.99,NULL,0,'https://images.unsplash.com/photo-1609789682476-8a1ac0b5ac11?w=500&h=500&fit=crop','Home Depot','Tools'),

(37,'Great Value Whole Wheat Bread','Fresh whole wheat bread loaf, perfect for sandwiches and toast.',2.99,NULL,0,'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop','Walmart','Groceries'),
(38,'Organic Free-Range Eggs','Dozen organic free-range eggs from local farms.',5.49,NULL,0,'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=500&h=500&fit=crop','Walmart','Groceries'),
(39,'Bananas','Fresh yellow bananas, perfect for snacks and smoothies.',1.99,NULL,0,'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop','Walmart','Groceries'),
(40,'Milk 2% 4L','4 liter jug of fresh 2% milk.',4.99,NULL,0,'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop','Walmart','Groceries'),
(41,'Ground Beef 1lb','Fresh lean ground beef, perfect for burgers and pasta.',6.99,NULL,0,'https://images.unsplash.com/photo-1588347818158-091002988c1f?w=500&h=500&fit=crop','Walmart','Groceries'),

(42,'Japanese Sushi Rice','Premium short-grain Japanese rice, perfect for sushi and rice bowls.',8.99,NULL,0,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop','T&T Supermarket','Groceries'),
(43,'Miso Paste','Traditional Japanese miso paste for soups and marinades.',6.49,NULL,0,'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop','T&T Supermarket','Groceries'),
(44,'Ramen Noodles','Fresh ramen noodles for authentic Japanese dishes.',3.99,NULL,0,'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop','T&T Supermarket','Groceries'),
(45,'Soy Sauce','Premium soy sauce for cooking and seasoning.',4.99,NULL,0,'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop','T&T Supermarket','Groceries'),
(46,'Green Tea','Premium Japanese green tea leaves.',12.99,NULL,0,'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop','T&T Supermarket','Groceries'),

(47,'Korean Kimchi','Authentic Korean fermented cabbage kimchi.',4.99,NULL,0,'https://images.unsplash.com/photo-1605349482818-c17085de4024?w=500&h=500&fit=crop','H Mart','Groceries'),
(48,'Gochujang Sauce','Korean chili paste for cooking and seasoning.',5.99,NULL,0,'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop','H Mart','Groceries'),
(49,'Korean Rice Cakes','Traditional Korean rice cakes for tteokbokki.',6.99,NULL,0,'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop','H Mart','Groceries'),
(50,'Sesame Oil','Pure sesame oil for Korean cooking.',7.99,NULL,0,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop','H Mart','Groceries'),
(51,'Korean Seaweed','Premium dried seaweed sheets.',8.99,NULL,0,'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop','H Mart','Groceries'),

(52,'Lebanese Pita Bread','Fresh Lebanese pita bread, perfect for wraps and dips.',3.49,NULL,0,'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop','Arz Fine Foods','Groceries'),
(53,'Tahini Paste','Pure sesame seed tahini paste for hummus and cooking.',7.99,NULL,0,'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop','Arz Fine Foods','Groceries'),
(54,'Olive Oil Extra Virgin','Premium extra virgin olive oil from Lebanon.',12.99,NULL,0,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop','Arz Fine Foods','Groceries'),
(55,'Za''atar Spice Mix','Traditional Middle Eastern spice blend.',5.99,NULL,0,'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop','Arz Fine Foods','Groceries'),
(56,'Baklava Pastries','Traditional Middle Eastern honey pastries.',14.99,NULL,0,'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=500&fit=crop','Arz Fine Foods','Groceries'),

(57,'Mixed Nuts','Premium mixed nuts blend, sold by weight.',12.99,NULL,0,'https://images.unsplash.com/photo-1559690035-c4832bf9d3eb?w=500&h=500&fit=crop','Bulk Barn','Groceries'),
(58,'Dried Cranberries','Sweet dried cranberries, perfect for baking.',8.49,NULL,0,'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop','Bulk Barn','Groceries'),
(59,'Quinoa','Organic quinoa grain sold by weight.',9.99,NULL,0,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop','Bulk Barn','Groceries'),
(60,'Dark Chocolate Chips','Premium dark chocolate chips for baking.',7.99,NULL,0,'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=500&fit=crop','Bulk Barn','Groceries'),
(61,'Almonds Raw','Raw almonds sold by weight.',11.99,NULL,0,'https://images.unsplash.com/photo-1559690035-c4832bf9d3eb?w=500&h=500&fit=crop','Bulk Barn','Groceries'),

(62,'Organic Strawberries','Fresh organic strawberries from local farms.',6.99,NULL,0,'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop','Farm Boy','Groceries'),
(63,'Artisan Sourdough Bread','Handcrafted sourdough bread baked fresh daily.',5.99,NULL,0,'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop','Farm Boy','Groceries'),
(64,'Local Honey','Pure local honey from Ontario beekeepers.',12.99,NULL,0,'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=500&fit=crop','Farm Boy','Groceries'),
(65,'Organic Blueberries','Fresh organic blueberries, perfect for breakfast.',7.99,NULL,0,'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop','Farm Boy','Groceries'),
(66,'Farm Fresh Cheese','Artisan cheese made from local dairy farms.',8.99,NULL,0,'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=500&fit=crop','Farm Boy','Groceries'),

(67,'Kirkland Olive Oil','Extra virgin olive oil, 1L bottle.',19.99,NULL,0,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop','Costco Wholesale','Groceries'),
(68,'Organic Quinoa','Organic quinoa grain, 2kg bag.',14.99,NULL,0,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop','Costco Wholesale','Groceries'),
(69,'Rotisserie Chicken','Ready-to-eat rotisserie chicken.',7.99,NULL,0,'https://images.unsplash.com/photo-1588347818158-091002988c1f?w=500&h=500&fit=crop','Costco Wholesale','Groceries'),
(70,'Frozen Berries Mix','Frozen mixed berries, 2kg bag.',12.99,NULL,0,'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop','Costco Wholesale','Groceries'),

(71,'President''s Choice Salmon','Fresh Atlantic salmon fillet, premium quality.',16.99,NULL,0,'https://images.unsplash.com/photo-1544943515-6eb32bf6ba85?w=500&h=500&fit=crop','Loblaws','Groceries'),
(72,'Organic Baby Spinach','Fresh organic baby spinach leaves.',4.49,NULL,0,'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop','Loblaws','Groceries'),
(73,'Avocados','Fresh avocados, perfect for toast and salads.',2.99,NULL,0,'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop','Loblaws','Groceries'),
(74,'Greek Yogurt','Thick and creamy Greek yogurt, high in protein.',5.99,NULL,0,'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop','Loblaws','Groceries'),
(75,'Organic Chicken Breast','Organic free-range chicken breast.',12.99,NULL,0,'https://images.unsplash.com/photo-1588347818158-091002988c1f?w=500&h=500&fit=crop','Loblaws','Groceries'),

(76,'Pasta','Basic pasta for everyday meals.',1.99,NULL,0,'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop','No Frills','Groceries'),
(77,'Canned Tomatoes','Canned crushed tomatoes for cooking.',1.49,NULL,0,'https://images.unsplash.com/photo-1592741554933-1273d4df5d8e?w=500&h=500&fit=crop','No Frills','Groceries'),
(78,'Frozen Pizza','Frozen pepperoni pizza for quick meals.',3.99,NULL,0,'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop','No Frills','Groceries'),
(79,'Cereal','Breakfast cereal with whole grains.',4.99,NULL,0,'https://images.unsplash.com/photo-1518810765707-f154cf8b463c?w=500&h=500&fit=crop','No Frills','Groceries'),
(80,'Orange Juice','Fresh orange juice, 1L carton.',3.49,NULL,0,'https://images.unsplash.com/photo-1587393855524-087f83d48547?w=500&h=500&fit=crop','No Frills','Groceries'),

(81,'iPhone 15 Pro','Latest iPhone with advanced camera system and A17 Pro chip.',999.99,NULL,0,'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop','Best Buy','Electronics'),
(82,'Samsung 4K Smart TV','55-inch 4K UHD Smart TV with HDR and streaming apps.',599.99,799.99,25,'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop','Best Buy','Electronics'),
(83,'MacBook Air M2','13-inch MacBook Air with M2 chip, 8GB RAM, 256GB SSD.',1199.99,NULL,0,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop','Best Buy','Electronics'),
(84,'Sony WH-1000XM4','Wireless noise-canceling headphones with 30-hour battery life.',279.99,349.99,20,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop','Best Buy','Electronics'),
(85,'Nintendo Switch OLED','Gaming console with vibrant OLED screen and enhanced audio.',349.99,NULL,0,'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop','Best Buy','Electronics'),

(86,'HP Laptop','15.6-inch laptop with Intel Core i5 processor.',449.99,599.99,25,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop','Walmart','Electronics'),
(87,'Bluetooth Speaker','Portable wireless speaker with deep bass.',39.99,NULL,0,'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop','Walmart','Electronics'),
(88,'Tablet 10-inch','Android tablet with HD display and long battery life.',199.99,NULL,0,'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop','Walmart','Electronics'),
(89,'Wireless Earbuds','True wireless earbuds with charging case.',79.99,99.99,20,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop','Walmart','Electronics'),
(90,'Smart Watch','Fitness tracker with heart rate monitor and GPS.',149.99,NULL,0,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop','Walmart','Electronics'),

(91,'Winter Wool Coat','Premium wool winter coat with insulated lining.',199.99,NULL,0,'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop','Hudson''s Bay','Clothing'),
(92,'Cashmere Scarf','Luxurious cashmere scarf in multiple colors.',89.99,NULL,0,'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop','Hudson''s Bay','Clothing'),
(93,'Leather Boots','Premium leather boots for winter weather.',159.99,NULL,0,'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop','Hudson''s Bay','Clothing'),
(94,'Merino Wool Sweater','Soft merino wool sweater for cold weather.',129.99,NULL,0,'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop','Hudson''s Bay','Clothing'),
(95,'Designer Handbag','Elegant designer handbag for special occasions.',299.99,NULL,0,'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop','Hudson''s Bay','Clothing'),

(96,'Running Shoes','Lightweight running shoes with cushioned sole.',129.99,NULL,0,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop','Sport Chek','Sports'),
(97,'Yoga Mat','Non-slip yoga mat with carrying strap.',49.99,NULL,0,'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop','Sport Chek','Sports'),
(98,'Basketball','Official size basketball for indoor and outdoor play.',39.99,NULL,0,'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop','Sport Chek','Sports'),
(99,'Workout Gloves','Padded workout gloves for weightlifting.',24.99,NULL,0,'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop','Sport Chek','Sports'),
(100,'Water Bottle','Insulated stainless steel water bottle.',19.99,NULL,0,'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&h=500&fit=crop','Sport Chek','Sports');

-- اضبط AUTO_INCREMENT لو حابب يبدأ من بعد آخر ID
ALTER TABLE `products` AUTO_INCREMENT = 101;

COMMIT;
