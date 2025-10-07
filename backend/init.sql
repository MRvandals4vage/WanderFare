-- Initial data for WanderFare database

-- Create admin user
INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_active, created_at, updated_at) 
VALUES ('admin@wanderfare.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Admin', 'User', '+1234567890', 'ADMIN', true, NOW(), NOW());

-- Sample cuisine types and cities for reference
-- These would typically be managed through the admin panel

-- Sample vendor (will need admin approval)
INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_active, created_at, updated_at) 
VALUES ('vendor@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'John', 'Doe', '+1234567891', 'VENDOR', true, NOW(), NOW());

INSERT INTO vendors (user_id, business_name, business_address, city, postal_code, cuisine_type, description, opening_time, closing_time, minimum_order, delivery_fee, rating, total_reviews, is_approved)
VALUES (LAST_INSERT_ID(), 'Johns Italian Kitchen', '123 Restaurant St', 'New York', '10001', 'Italian', 'Authentic Italian cuisine with fresh ingredients', '10:00:00', '22:00:00', 15.00, 3.99, 4.5, 25, true);

-- Sample customer
INSERT INTO users (email, password, first_name, last_name, phone_number, role, is_active, created_at, updated_at) 
VALUES ('customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Jane', 'Smith', '+1234567892', 'CUSTOMER', true, NOW(), NOW());

INSERT INTO customers (user_id, delivery_address, city, postal_code, preferences)
VALUES (LAST_INSERT_ID(), '456 Main St', 'New York', '10002', 'Vegetarian options preferred');

-- Sample menu items for the vendor
INSERT INTO menu_items (name, description, price, category, is_available, is_vegetarian, is_vegan, is_spicy, preparation_time, vendor_id, created_at, updated_at)
VALUES 
('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomatoes, and basil', 18.99, 'Pizza', true, true, false, false, 15, 2, NOW(), NOW()),
('Pepperoni Pizza', 'Traditional pepperoni pizza with mozzarella cheese', 21.99, 'Pizza', true, false, false, false, 15, 2, NOW(), NOW()),
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing and croutons', 12.99, 'Salad', true, true, false, false, 10, 2, NOW(), NOW()),
('Spaghetti Carbonara', 'Classic Italian pasta with eggs, cheese, and pancetta', 16.99, 'Pasta', true, false, false, false, 20, 2, NOW(), NOW()),
('Tiramisu', 'Traditional Italian dessert with coffee and mascarpone', 8.99, 'Dessert', true, true, false, false, 5, 2, NOW(), NOW());
