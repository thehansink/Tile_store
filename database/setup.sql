CREATE DATABASE IF NOT EXISTS tile_store DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tile_store;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit VARCHAR(10),
  specification VARCHAR(120),
  image_url VARCHAR(500),
  active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  cart_key VARCHAR(100) NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT uk_cart_product UNIQUE (cart_key, product_id),
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS store_orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  cart_key VARCHAR(100) NOT NULL,
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  shipping_address VARCHAR(300) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  unit VARCHAR(10),
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES store_orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO products (name, category, price, unit, specification, image_url, active)
VALUES
('雾灰石纹', 'floor', 128.00, '㎡', 'MAT-042 · 600×1200mm', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Cream_speckled_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg/1280px-Cream_speckled_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg', 1),
('奶油白微水泥', 'wall', 156.00, '㎡', 'WAL-018 · 750×1500mm', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Ceramic_tile_rectangle_white_fabric_pattern.jpg/1280px-Ceramic_tile_rectangle_white_fabric_pattern.jpg', 1),
('墨岩黑大板', 'slab', 298.00, '㎡', 'SLB-007 · 900×1800mm', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Clay_-_Preview_-_Marble_Tiles_%28Charlotte_Baglioni_via_Poly_Haven%29.webp/1280px-Clay_-_Preview_-_Marble_Tiles_%28Charlotte_Baglioni_via_Poly_Haven%29.webp', 1),
('原木浅棕', 'floor', 96.00, '㎡', 'WD-031 · 200×1200mm', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Garnet_red_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg/1280px-Garnet_red_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg', 1);

UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Cream_speckled_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg/1280px-Cream_speckled_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg' WHERE name = '雾灰石纹';
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Ceramic_tile_rectangle_white_fabric_pattern.jpg/1280px-Ceramic_tile_rectangle_white_fabric_pattern.jpg' WHERE name = '奶油白微水泥';
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Clay_-_Preview_-_Marble_Tiles_%28Charlotte_Baglioni_via_Poly_Haven%29.webp/1280px-Clay_-_Preview_-_Marble_Tiles_%28Charlotte_Baglioni_via_Poly_Haven%29.webp' WHERE name = '墨岩黑大板';
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Garnet_red_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg/1280px-Garnet_red_ceramic_cemented_clean_tile_pattern_floor_ground_texture.jpg' WHERE name = '原木浅棕';

-- 正式后端不应使用 root 管理员账号。请把下面的 CHANGE_THIS_PASSWORD
-- 改成你自己设置的强密码后，再执行这三行。
-- CREATE USER IF NOT EXISTS 'tile_store_app'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON tile_store.* TO 'tile_store_app'@'localhost';
-- FLUSH PRIVILEGES;
