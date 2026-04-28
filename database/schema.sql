-- ============================================================
-- FSAD-PS22: Indian Middle-Class Property Value Enhancement
-- MySQL Schema + Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS property_enhance;
USE property_enhance;

-- -----------------------------------------------
-- USERS (homeowners + admins)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    phone VARCHAR(20),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- CATEGORIES (improvement areas)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- RECOMMENDATIONS (admin-curated ideas)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    estimated_cost_min INT DEFAULT 0,
    estimated_cost_max INT DEFAULT 0,
    roi_percentage DECIMAL(5,2) DEFAULT 0,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    time_required VARCHAR(100),
    tags VARCHAR(500),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- -----------------------------------------------
-- PROPERTIES (user-submitted homes)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    property_type ENUM('Apartment', 'Independent House', 'Villa', 'Row House', 'Flat') NOT NULL,
    bhk VARCHAR(20),
    area_sqft INT,
    city VARCHAR(100),
    locality VARCHAR(200),
    age_years INT DEFAULT 0,
    current_condition ENUM('Poor', 'Average', 'Good', 'Excellent') DEFAULT 'Average',
    budget_for_improvement INT DEFAULT 0,
    goals TEXT,
    status ENUM('pending', 'reviewed', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------
-- PROPERTY RECOMMENDATIONS (personalized matches)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS property_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    recommendation_id INT NOT NULL,
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE
);

-- -----------------------------------------------
-- LISTINGS (admin-managed showcase listings)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    property_type ENUM('Apartment', 'Independent House', 'Villa', 'Row House', 'Flat') NOT NULL,
    bhk VARCHAR(20),
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(200),
    area_sqft INT,
    price_lakh DECIMAL(10,2),
    description TEXT,
    image_url VARCHAR(500),
    features TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- -----------------------------------------------
-- SEED DATA: Admin User
-- Password: Admin@123 (bcrypt hash)
-- -----------------------------------------------
INSERT INTO users (name, email, password_hash, role, phone, city) VALUES
('Admin User', 'admin@propertyenhance.in', '$2b$10$7QzV6F3rU2O1K9mN4pL8hOQvT5dX8wY2A6gC1bM3nP0eR7sJ9tI6K', 'admin', '9000000001', 'Mumbai'),
('Rahul Sharma', 'rahul@example.com', '$2b$10$7QzV6F3rU2O1K9mN4pL8hOQvT5dX8wY2A6gC1bM3nP0eR7sJ9tI6K', 'user', '9876543210', 'Pune'),
('Priya Patel', 'priya@example.com', '$2b$10$7QzV6F3rU2O1K9mN4pL8hOQvT5dX8wY2A6gC1bM3nP0eR7sJ9tI6K', 'user', '9123456780', 'Ahmedabad');

-- -----------------------------------------------
-- SEED DATA: Categories
-- -----------------------------------------------
INSERT INTO categories (name, icon, description) VALUES
('Kitchen Renovation', 'kitchen', 'Upgrade your kitchen for modern functionality and aesthetics'),
('Bathroom Upgrade', 'bathroom', 'Modernize bathrooms to increase appeal and hygiene'),
('Exterior & Facade', 'home', 'Improve curb appeal with exterior enhancements'),
('Interior Design', 'design', 'Transform interiors with contemporary design elements'),
('Smart Home Tech', 'smart', 'Add smart devices to boost convenience and value'),
('Vastu & Space Optimization', 'vastu', 'Optimize space allocation per Vastu Shastra principles'),
('Energy Efficiency', 'energy', 'Reduce bills and increase value with green upgrades'),
('Security Upgrades', 'security', 'Enhance safety with modern security systems'),
('Garden & Landscaping', 'garden', 'Create beautiful outdoor spaces'),
('Painting & Finishing', 'paint', 'Fresh coats and quality finishes for instant refresh');

-- -----------------------------------------------
-- SEED DATA: Recommendations
-- -----------------------------------------------
INSERT INTO recommendations (category_id, title, description, estimated_cost_min, estimated_cost_max, roi_percentage, difficulty, time_required, tags, created_by) VALUES
-- Kitchen Renovation
(1, 'Modular Kitchen Installation', 'Replace traditional kitchen with a modular setup featuring pull-out drawers, overhead cabinets, and a chimney. Dramatically improves functionality and visual appeal.', 80000, 250000, 35.00, 'Medium', '7-15 days', 'modular,kitchen,cabinets,chimney', 1),
(1, 'Granite/Quartz Countertop Upgrade', 'Replace old slab countertops with polished granite or quartz. Highly durable, hygienic, and adds luxury feel without breaking the bank.', 20000, 60000, 25.00, 'Easy', '3-5 days', 'countertop,granite,quartz,kitchen', 1),
(1, 'Kitchen Backsplash Tiles', 'Install decorative subway or mosaic tiles behind the cooking range. Quick visual upgrade with excellent ROI.', 5000, 20000, 20.00, 'Easy', '1-2 days', 'tiles,backsplash,kitchen,decor', 1),

-- Bathroom Upgrade
(2, 'Concealed Plumbing & Modern Fixtures', 'Replace exposed pipes with concealed plumbing and install EWC (Western Closet), sensor faucets, and a rain shower. Significantly boosts buyer appeal.', 50000, 150000, 40.00, 'Hard', '10-20 days', 'plumbing,shower,bathroom,fixtures', 1),
(2, 'Anti-Skid Floor Tiles & Wall Tiles', 'Replace old flooring with anti-skid vitrified tiles and install full-height wall tiles. Improves hygiene, aesthetics, and safety.', 15000, 45000, 22.00, 'Medium', '5-7 days', 'tiles,bathroom,flooring,safety', 1),
(2, 'Vanity Unit & Mirror Cabinet', 'Install a modern vanity unit with built-in storage and an LED mirror cabinet. Maximizes utility in small bathrooms.', 12000, 35000, 18.00, 'Easy', '2-3 days', 'vanity,mirror,bathroom,storage', 1),

-- Exterior & Facade
(3, 'Exterior Texture Paint & Cladding', 'Apply weather-proof texture paint or stone cladding to the exterior. First impressions matter — this dramatically improves curb appeal.', 30000, 120000, 30.00, 'Medium', '5-10 days', 'exterior,paint,cladding,curb appeal', 1),
(3, 'Main Gate & Compound Wall Upgrade', 'Replace old iron gates with powder-coated or stainless steel gates. Repaint or tile the compound wall.', 15000, 80000, 20.00, 'Easy', '3-7 days', 'gate,compound,exterior,security', 1),
(3, 'Entrance Lobby Makeover', 'Redesign the entrance area with feature walls, good lighting, and flooring. Sets the tone for the entire home.', 20000, 70000, 28.00, 'Medium', '4-8 days', 'entrance,lobby,first impression,exterior', 1),

-- Interior Design
(4, 'False Ceiling with LED Lighting', 'Install gypsum or POP false ceiling with concealed LED strip lighting. Transforms the ambiance of living and bedroom areas.', 25000, 90000, 30.00, 'Medium', '3-7 days', 'false ceiling,LED,interior,lighting', 1),
(4, 'Wardrobes with Sliding Doors', 'Replace open almirahs with built-in sliding door wardrobes. Maximizes space and gives a premium hotel-like feel.', 30000, 100000, 25.00, 'Medium', '5-10 days', 'wardrobe,sliding,bedroom,storage', 1),
(4, 'Accent/Feature Wall Design', 'Create a focal point with wallpaper, textured paint, or stone cladding on one wall per room. Low cost, high visual impact.', 5000, 25000, 18.00, 'Easy', '1-3 days', 'accent wall,wallpaper,interior,decor', 1),

-- Smart Home Tech
(5, 'Smart Lighting & Automation', 'Install smart switches, voice-controlled bulbs (Alexa/Google compatible), and automated curtains. Growing demand among young buyers.', 20000, 80000, 22.00, 'Medium', '2-5 days', 'smart home,automation,lighting,IoT', 1),
(5, 'Video Door Phone & Intercom', 'Install a color video door phone system with intercom connectivity. Improves security and buyer confidence.', 8000, 25000, 20.00, 'Easy', '1-2 days', 'security,intercom,video door phone,smart', 1),
(5, 'Solar Water Heater', 'Replace electric geysers with a solar water heater. Reduces electricity bills by 25-30% and qualifies for government subsidies.', 18000, 40000, 35.00, 'Medium', '2-4 days', 'solar,energy,water heater,green', 1),

-- Vastu
(6, 'Vastu-Compliant Room Redesign', 'Rearrange furniture, shift the main door alignment, or add copper Vastu elements. Strong selling point for traditional buyers.', 5000, 30000, 15.00, 'Easy', '1-5 days', 'vastu,interior,tradition,feng shui', 1),
(6, 'Space Optimization with Multifunctional Furniture', 'Use Murphy beds, sofa-cum-beds, foldable dining tables to maximize space in compact apartments.', 15000, 60000, 20.00, 'Easy', '2-4 days', 'space,furniture,multifunctional,vastu', 1),

-- Energy Efficiency
(7, 'Double-Glazed Windows & Ventilation', 'Replace single-pane windows with UPVC double-glazed windows. Reduces heat gain by 40%, cuts AC costs significantly.', 40000, 150000, 30.00, 'Hard', '7-14 days', 'windows,energy,UPVC,ventilation', 1),
(7, 'Rooftop Solar Panels', 'Install 1-3 kW rooftop solar panels. Eligible for PM Surya Ghar Yojana subsidy. Reduces bills to near zero.', 80000, 200000, 45.00, 'Hard', '10-15 days', 'solar,renewable,energy,rooftop,subsidy', 1),

-- Security
(8, 'CCTV & Smart Lock System', 'Install a 4-8 camera CCTV system with DVR and smartphone monitoring plus a smart deadbolt lock.', 15000, 50000, 25.00, 'Medium', '2-4 days', 'CCTV,security,smart lock,safety', 1),
(8, 'Fire Safety Equipment', 'Install smoke detectors, fire extinguishers, and emergency lighting. Mandatory for many apartment complexes.', 5000, 20000, 15.00, 'Easy', '1-2 days', 'fire,safety,smoke detector,compliance', 1),

-- Garden
(9, 'Balcony/Terrace Garden', 'Create a green oasis with potted plants, vertical garden wall, drip irrigation, and ambient lighting. Very popular post-COVID.', 10000, 40000, 20.00, 'Easy', '3-7 days', 'garden,balcony,terrace,plants,green', 1),
(9, 'Lawn & Landscaping', 'For independent houses — lay artificial or natural lawn, add flowering plants and a small water feature for a premium feel.', 25000, 100000, 25.00, 'Medium', '7-15 days', 'lawn,landscape,garden,exterior', 1),

-- Painting
(10, 'Premium Interior Painting', 'Use branded washable paints (Asian Paints Royale, Berger Silk) with designer stencils or texture techniques.', 8000, 40000, 20.00, 'Easy', '3-7 days', 'paint,interior,washable,premium', 1),
(10, 'Waterproofing & Damp Treatment', 'Apply Dr. Fixit or STP waterproofing on terrace, bathrooms, and kitchen. Prevents structural damage and mold.', 15000, 60000, 30.00, 'Medium', '5-10 days', 'waterproofing,damp,maintenance,terrace', 1);

-- -----------------------------------------------
-- SEED DATA: Sample Listings
-- -----------------------------------------------
INSERT INTO listings (title, property_type, bhk, city, locality, area_sqft, price_lakh, description, features, is_featured, created_by) VALUES
('Pearl Heights - Move-in Ready 3BHK', 'Apartment', '3BHK', 'Pune', 'Hinjewadi Phase 2', 1200, 85.00, 'Fully modular kitchen, false ceiling throughout, smart switches, brand new bathroom fittings. Near IT hub.', 'Modular Kitchen,Solar Water Heater,CCTV,Smart Lighting,False Ceiling', TRUE, 1),
('Sunshine Villa - Post-Renovation', 'Villa', '4BHK', 'Ahmedabad', 'SG Highway', 2800, 180.00, 'Spacious villa with rooftop solar panels, landscaped garden, premium granite flooring & full home automation.', 'Rooftop Solar,Home Automation,Landscaped Garden,UPVC Windows,Video Door Phone', TRUE, 1),
('Cozy 2BHK Flat - Vastu Compliant', 'Flat', '2BHK', 'Mumbai', 'Thane West', 750, 65.00, 'Vastu-compliant layout, anti-skid bathroom tiles, accent wall designs, fresh premium paint throughout.', 'Vastu Compliant,Accent Walls,Fresh Paint,Anti-Skid Tiles', FALSE, 1),
('Green Nest - Energy Efficient Home', 'Independent House', '3BHK', 'Bengaluru', 'Whitefield', 1600, 1.20, 'Solar panels, green terrace garden, UPVC windows, LED automation. Monthly electricity bill < ₹200.', 'Solar Panels,Terrace Garden,UPVC Windows,LED Automation,Water Harvesting', TRUE, 1),
('Budget Upgrade Row House', 'Row House', '2BHK', 'Nagpur', 'Dharampeth', 900, 42.00, 'Freshly painted, new main gate, kitchen backsplash done. Great starter home ready for more upgrades.', 'Fresh Paint,New Gate,Kitchen Backsplash,Safe Locality', FALSE, 1);

-- -----------------------------------------------
-- SEED DATA: Sample Property Submissions
-- -----------------------------------------------
INSERT INTO properties (user_id, title, property_type, bhk, area_sqft, city, locality, age_years, current_condition, budget_for_improvement, goals, status) VALUES
(2, 'My Hinjewadi Apartment', 'Apartment', '2BHK', 900, 'Pune', 'Hinjewadi', 8, 'Average', 150000, 'Increase resale value, modernize kitchen and bathrooms', 'reviewed'),
(3, 'Family Home in Ahmedabad', 'Independent House', '3BHK', 1500, 'Ahmedabad', 'Bopal', 15, 'Poor', 300000, 'Full renovation for rental income improvement and resale', 'pending');

-- Personalized recommendations for property 1
INSERT INTO property_recommendations (property_id, recommendation_id, priority, notes) VALUES
(1, 1, 'High', 'Recommended given 8 year old kitchen and budget allows'), -- Modular Kitchen
(1, 4, 'High', 'Old bathroom plumbing detected, priority fix'),              -- Concealed Plumbing
(1, 10, 'Medium', 'Will complement budget modernization plan'),              -- False Ceiling
(1, 14, 'Medium', 'Smart lighting is popular in Hinjewadi IT corridor'),    -- Smart Lighting
(1, 21, 'Low', 'Balcony garden will boost appeal for young buyers');         -- Balcony Garden
