-- WanderFare Sample Data Script
-- Run this after the application has created tables

USE wanderfare;

-- Insert sample admin user (password: admin123)
INSERT INTO users (id, email, password, first_name, last_name, phone_number, role, is_active, created_at, updated_at) 
VALUES (1, 'admin@wanderfare.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Admin', 'User', '+1234567890', 'ADMIN', true, NOW(), NOW());

-- Insert sample customers
INSERT INTO users (id, email, password, first_name, last_name, phone_number, role, is_active, created_at, updated_at) 
VALUES 
(2, 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'John', 'Doe', '+1234567891', 'CUSTOMER', true, NOW(), NOW()),
(3, 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jane', 'Smith', '+1234567892', 'CUSTOMER', true, NOW(), NOW());

-- Insert customer details
INSERT INTO customers (id, delivery_address, city, postal_code, preferences) 
VALUES 
(2, '123 Main Street, Apt 4B', 'New York', '10001', 'Vegetarian options preferred'),
(3, '456 Oak Avenue', 'Los Angeles', '90210', 'No spicy food');

-- Insert sample vendors
INSERT INTO users (id, email, password, first_name, last_name, phone_number, role, is_active, created_at, updated_at) 
VALUES 
(4, 'mario@pizzapalace.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mario', 'Rossi', '+1234567893', 'VENDOR', true, NOW(), NOW()),
(5, 'raj@spicecurry.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Raj', 'Patel', '+1234567894', 'VENDOR', true, NOW(), NOW()),
(6, 'chen@dragonwok.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Chen', 'Li', '+1234567895', 'VENDOR', true, NOW(), NOW());

-- Insert vendor details
INSERT INTO vendors (id, business_name, business_address, city, postal_code, cuisine_type, description, is_approved, rating, delivery_fee, opening_time, closing_time) 
VALUES 
(4, 'Pizza Palace', '789 Pizza Street', 'New York', '10002', 'Italian', 'Authentic wood-fired pizzas and Italian classics', true, 4.5, 2.99, '11:00:00', '23:00:00'),
(5, 'Spice & Curry House', '321 Spice Lane', 'New York', '10003', 'Indian', 'Traditional Indian cuisine with modern twists', true, 4.7, 3.49, '12:00:00', '22:30:00'),
(6, 'Dragon Wok', '654 Dragon Way', 'New York', '10004', 'Chinese', 'Fresh Chinese dishes and dim sum', true, 4.3, 2.49, '11:30:00', '22:00:00');

-- Insert sample menu items for Pizza Palace
INSERT INTO menu_items (id, vendor_id, name, description, price, category, is_available, is_vegetarian, is_vegan, is_gluten_free, image_url, created_at, updated_at) 
VALUES 
(1, 4, 'Margherita Pizza', 'Classic pizza with fresh mozzarella, tomato sauce, and basil', 12.99, 'Pizza', true, true, false, false, 'https://example.com/margherita.jpg', NOW(), NOW()),
(2, 4, 'Pepperoni Pizza', 'Traditional pepperoni pizza with mozzarella cheese', 14.99, 'Pizza', true, false, false, false, 'https://example.com/pepperoni.jpg', NOW(), NOW()),
(3, 4, 'Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 8.99, 'Salad', true, true, false, false, 'https://example.com/caesar.jpg', NOW(), NOW());

-- Insert sample menu items for Spice & Curry House
INSERT INTO menu_items (id, vendor_id, name, description, price, category, is_available, is_vegetarian, is_vegan, is_gluten_free, image_url, created_at, updated_at) 
VALUES 
(4, 5, 'Chicken Tikka Masala', 'Tender chicken in creamy tomato-based curry', 16.99, 'Main Course', true, false, false, true, 'https://example.com/tikka.jpg', NOW(), NOW()),
(5, 5, 'Vegetable Biryani', 'Fragrant basmati rice with mixed vegetables and spices', 13.99, 'Rice', true, true, true, true, 'https://example.com/biryani.jpg', NOW(), NOW()),
(6, 5, 'Naan Bread', 'Fresh baked Indian flatbread', 3.99, 'Bread', true, true, false, false, 'https://example.com/naan.jpg', NOW(), NOW());

-- Insert sample menu items for Dragon Wok
INSERT INTO menu_items (id, vendor_id, name, description, price, category, is_available, is_vegetarian, is_vegan, is_gluten_free, image_url, created_at, updated_at) 
VALUES 
(7, 6, 'Sweet and Sour Pork', 'Crispy pork with bell peppers in sweet and sour sauce', 15.99, 'Main Course', true, false, false, false, 'https://example.com/sweetsour.jpg', NOW(), NOW()),
(8, 6, 'Vegetable Fried Rice', 'Wok-fried rice with mixed vegetables and soy sauce', 11.99, 'Rice', true, true, true, true, 'https://example.com/friedrice.jpg', NOW(), NOW()),
(9, 6, 'Spring Rolls (4 pieces)', 'Crispy vegetable spring rolls with sweet chili sauce', 6.99, 'Appetizer', true, true, true, false, 'https://example.com/springrolls.jpg', NOW(), NOW());

-- Insert sample orders
INSERT INTO orders (id, customer_id, vendor_id, total_amount, delivery_fee, order_status, payment_status, delivery_address, special_instructions, created_at, updated_at) 
VALUES 
(1, 2, 4, 27.97, 2.99, 'DELIVERED', 'PAID', '123 Main Street, Apt 4B, New York, NY 10001', 'Ring doorbell twice', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(2, 3, 5, 20.98, 3.49, 'PREPARING', 'PAID', '456 Oak Avenue, Los Angeles, CA 90210', 'Leave at door', NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR);

-- Insert order items
INSERT INTO order_items (id, order_id, menu_item_id, quantity, price) 
VALUES 
(1, 1, 1, 1, 12.99),  -- Margherita Pizza
(2, 1, 2, 1, 14.99),  -- Pepperoni Pizza
(3, 2, 4, 1, 16.99),  -- Chicken Tikka Masala
(4, 2, 6, 1, 3.99);   -- Naan Bread

SELECT 'Sample data inserted successfully!' as status;
