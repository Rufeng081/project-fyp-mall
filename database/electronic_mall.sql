SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `link_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Contact name',
  `link_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Address',
  `link_phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Phone',
  `user_id` bigint(0) NULL DEFAULT NULL COMMENT 'Owner user',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_address_user` (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Address table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES (1, 'LI RUFENG', 'Kolej Keris Mas, Universiti Kebangsaan Malaysia, Bangi, Selangor 43600, Malaysia', '+60 12-345 6789', 1);
INSERT INTO `address` VALUES (2, 'Aisha Rahman', 'No. 12, Jalan Reko, Kajang, Selangor 43000, Malaysia', '+60 11-1234 5678', 2);
INSERT INTO `address` VALUES (3, 'Daniel Tan', 'Block B, Taman Universiti, Skudai, Johor 81300, Malaysia', '+60 16-234 5678', 2);
INSERT INTO `address` VALUES (4, 'Nur Iman', 'Jalan Tun Razak, Kuala Lumpur 50400, Malaysia', '+60 17-987 6543', 2);

-- ----------------------------
-- Table structure for avatar
-- ----------------------------
DROP TABLE IF EXISTS `avatar`;
CREATE TABLE `avatar`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `size` bigint(0) NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `md5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Avatar table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of avatar
-- ----------------------------
INSERT INTO `avatar` VALUES (2, 'jpg', 492, '/avatar/978418fbe75243b4ba38da389a468b78.jpg', '1e5802c8b96198fd524cc91ad3f9d476');
INSERT INTO `avatar` VALUES (3, 'jpg', 146, '/avatar/e8663626d17b41bd89707299fcd5ac81.jpg', '5c072037e4e9662831fe448e28795770');
INSERT INTO `avatar` VALUES (4, 'jpg', 175, '/avatar/09cd5add81ff4abfbd1ccf91b2e9c820.jpg', '507704f05fbca53793bce9970b40e6c8');

-- ----------------------------
-- Table structure for carousel
-- ----------------------------
DROP TABLE IF EXISTS `carousel`;
CREATE TABLE `carousel`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `good_id` bigint(0) NULL DEFAULT NULL COMMENT 'Related product ID',
  `show_order` int(0) NULL DEFAULT NULL COMMENT 'Display order',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_carousel_good` (`good_id`) USING BTREE,
  KEY `idx_carousel_show_order` (`show_order`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Carousel table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of carousel
-- ----------------------------
INSERT INTO `carousel` VALUES (4, 5, 2);
INSERT INTO `carousel` VALUES (5, 11, 3);
INSERT INTO `carousel` VALUES (6, 7, 4);

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `count` int(0) NULL DEFAULT NULL COMMENT 'Quantity',
  `create_time` datetime NULL DEFAULT NULL COMMENT 'Added time',
  `good_id` bigint(0) NULL DEFAULT NULL COMMENT 'Product ID',
  `standard` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
  `user_id` bigint(0) NULL DEFAULT NULL COMMENT 'User ID',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_cart_user_time` (`user_id`, `create_time`) USING BTREE,
  KEY `idx_cart_good_standard` (`good_id`, `standard`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Cart table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES (2, 1, '2026-07-15 13:48:00', 2, 'M', 2);
INSERT INTO `cart` VALUES (3, 1, '2026-07-15 13:48:04', 5, 'White', 2);
INSERT INTO `cart` VALUES (4, 1, '2026-07-15 13:48:08', 7, 'EU 43', 2);

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Category name',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Category table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, 'Clothing');
INSERT INTO `category` VALUES (2, 'Men Clothing');
INSERT INTO `category` VALUES (10, 'Sports Shoes');
INSERT INTO `category` VALUES (11, 'Casual Shoes');
INSERT INTO `category` VALUES (12, 'Boots');
INSERT INTO `category` VALUES (13, 'Stationery');
INSERT INTO `category` VALUES (14, 'Books');
INSERT INTO `category` VALUES (15, 'Laptops');
INSERT INTO `category` VALUES (16, 'Smartphones');
INSERT INTO `category` VALUES (17, 'Tablets');
INSERT INTO `category` VALUES (18, 'Food and Beverages');
INSERT INTO `category` VALUES (19, 'Beverages');
INSERT INTO `category` VALUES (20, 'Tea');
INSERT INTO `category` VALUES (21, 'Coffee');
INSERT INTO `category` VALUES (22, 'Daily Essentials');
INSERT INTO `category` VALUES (23, 'Household Supplies');

-- ----------------------------
-- Table structure for good
-- ----------------------------
DROP TABLE IF EXISTS `good`;
CREATE TABLE `good`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Product name',
  `description` varchar(1600) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Description',
  `discount` decimal(4, 2) NOT NULL DEFAULT 1.00 COMMENT 'Discount',
  `sales` bigint(0) NOT NULL DEFAULT 0 COMMENT 'Sales',
  `sale_money` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'Sales amount',
  `category_id` bigint(0) NULL DEFAULT NULL COMMENT 'Category ID',
  `imgs` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Product image',
  `create_time` datetime NULL DEFAULT NULL COMMENT 'Created time',
  `recommend` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Recommended flag. 0 no, 1 yes',
  `is_delete` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Deleted flag. 0 active, 1 deleted',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_good_category_status` (`category_id`, `is_delete`, `recommend`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Product table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of good
-- ----------------------------
INSERT INTO `good` VALUES (2, 'Men Casual Shirt', 'Lightweight casual shirt suitable for daily wear and campus activities.', 0.95, 35, 1370.50, 2, '/file/74488020672944968462e9e4a9c89096.png', '2026-03-27 13:32:44', 1, 0);
INSERT INTO `good` VALUES (3, 'Study Desk and Chair Set', 'Compact desk and chair set for dormitory study spaces and home offices.', 0.98, 0, 0.00, 13, '/file/b4ac53ed62c74c298366619399c39f99.jpg', '2026-03-31 20:44:00', 1, 0);
INSERT INTO `good` VALUES (5, 'Women Cotton T-Shirt', 'Comfortable cotton T-shirt with a clean white design for casual wear.', 0.80, 1, 116.00, 1, '/file/15cb9fc604984dfa97e0e968eb1d196d.jpg', '2026-03-31 20:47:59', 1, 0);
INSERT INTO `good` VALUES (6, 'English Psalms Book', 'A compact English reading book suitable for personal study and gifting.', 1.00, 0, 0.00, 14, '/file/8dc5354c7332454796c614bb4a0572fb.jpg', '2026-03-31 20:48:51', 1, 0);
INSERT INTO `good` VALUES (7, 'Men Casual Sneakers', 'Breathable black-grey casual sneakers with a comfortable walking sole.', 0.96, 1, 110.40, 11, '/file/0afa4eb1c51943808f6e83cd9ced25e8.jpg', '2026-03-31 20:49:36', 1, 0);
INSERT INTO `good` VALUES (8, 'Archived Demo Product', 'Archived product retained for delete-state testing.', 1.00, 43, 528.90, 1, '/file/09bb6edab07a4c68a44cce41a3300d97.jpg', '2026-06-12 00:55:57', 0, 1);
INSERT INTO `good` VALUES (9, 'Children Drawing Book', 'Simple line-art practice book for children to colour and draw.', 1.00, 0, 0.00, 13, '/file/2e2a1df657324a3293642344327310cb.png', '2026-08-10 20:28:58', 1, 0);
INSERT INTO `good` VALUES (10, 'UV Protection Sunglasses', 'Lightweight sunglasses with UV protection for outdoor activities.', 1.00, 0, 0.00, 22, '/file/449ab0163ba648c08cb4a76b40a9dcec.jpg', '2026-08-10 20:29:47', 1, 0);
INSERT INTO `good` VALUES (11, 'Women Long Sleeve Top', 'Soft long sleeve top with a modest relaxed cut for class, work, and casual outings.', 0.92, 0, 0.00, 1, '/file/seed_011_women_long_sleeve_top.jpg', '2026-06-27 10:01:00', 1, 0);
INSERT INTO `good` VALUES (12, 'Men Linen Blend Shirt', 'Breathable linen blend shirt designed for warm weather and smart casual use.', 0.94, 0, 0.00, 2, '/file/seed_012_men_linen_blend_shirt.jpg', '2026-06-27 10:02:00', 1, 0);
INSERT INTO `good` VALUES (13, 'Relaxed Fit T-Shirt', 'Everyday cotton T-shirt with a neat fit and comfortable fabric for campus wear.', 0.90, 0, 0.00, 1, '/file/seed_013_relaxed_fit_tshirt.jpg', '2026-06-27 10:03:00', 1, 0);
INSERT INTO `good` VALUES (14, 'Lightweight Hoodie', 'Soft hoodie with a clean design for study rooms, travel, and relaxed weekends.', 0.88, 0, 0.00, 1, '/file/seed_014_lightweight_hoodie.jpg', '2026-06-27 10:04:00', 1, 0);
INSERT INTO `good` VALUES (15, 'Sports Track Pants', 'Stretch track pants for walking, light exercise, and daily movement.', 0.93, 0, 0.00, 10, '/file/seed_015_sports_track_pants.jpg', '2026-06-27 10:05:00', 1, 0);
INSERT INTO `good` VALUES (16, 'Walking Comfort Sneakers', 'Cushioned sneakers with breathable lining for daily commuting and campus walks.', 0.91, 0, 0.00, 11, '/file/seed_016_walking_comfort_sneakers.jpg', '2026-06-27 10:06:00', 1, 0);
INSERT INTO `good` VALUES (17, 'Court Training Shoes', 'Supportive training shoes for indoor courts, gym sessions, and everyday sport use.', 0.89, 0, 0.00, 10, '/file/seed_017_court_training_shoes.jpg', '2026-06-27 10:07:00', 1, 0);
INSERT INTO `good` VALUES (18, 'Slip-On Canvas Shoes', 'Easy slip-on canvas shoes with a flexible sole for short trips and casual outfits.', 0.95, 0, 0.00, 11, '/file/seed_018_slip_on_canvas_shoes.jpg', '2026-06-27 10:08:00', 1, 0);
INSERT INTO `good` VALUES (19, 'Recycled Notebook Pack', 'Set of recycled paper notebooks for lecture notes, planning, and daily journaling.', 0.86, 0, 0.00, 13, '/file/seed_019_recycled_notebook_pack.jpg', '2026-06-27 10:09:00', 1, 0);
INSERT INTO `good` VALUES (20, 'Smooth Gel Pen Set', 'Low-smudge gel pens with clear ink flow for assignments and office notes.', 0.90, 0, 0.00, 13, '/file/seed_020_smooth_gel_pen_set.jpg', '2026-06-27 10:10:00', 1, 0);
INSERT INTO `good` VALUES (21, 'Desk Organizer Tray', 'Compact organizer tray for pens, sticky notes, cards, and small accessories.', 0.91, 0, 0.00, 13, '/file/seed_021_desk_organizer_tray.jpg', '2026-06-27 10:11:00', 1, 0);
INSERT INTO `good` VALUES (22, 'Pastel Sticky Notes', 'Pastel sticky notes for reminders, bookmarks, and revision highlights.', 0.88, 0, 0.00, 13, '/file/seed_022_pastel_sticky_notes.jpg', '2026-06-27 10:12:00', 1, 0);
INSERT INTO `good` VALUES (23, 'Academic Planner 2026', 'Weekly planner for classes, projects, deadlines, and personal routines.', 0.85, 0, 0.00, 13, '/file/seed_023_academic_planner_2026.jpg', '2026-06-27 10:13:00', 1, 0);
INSERT INTO `good` VALUES (24, 'Art Sketch Pad', 'Medium-weight sketch paper for pencil, marker drafts, and design practice.', 0.92, 0, 0.00, 13, '/file/seed_024_art_sketch_pad.jpg', '2026-06-27 10:14:00', 1, 0);
INSERT INTO `good` VALUES (25, 'Calligraphy Marker Set', 'Flexible tip markers for lettering, cards, and creative note headings.', 0.89, 0, 0.00, 13, '/file/seed_025_calligraphy_marker_set.jpg', '2026-06-27 10:15:00', 1, 0);
INSERT INTO `good` VALUES (26, 'Children Storybook Set', 'Inclusive illustrated storybooks with everyday friendship and family themes.', 0.87, 0, 0.00, 14, '/file/seed_026_children_storybook_set.jpg', '2026-06-27 10:16:00', 1, 0);
INSERT INTO `good` VALUES (27, 'Bahasa Malay Phrasebook', 'Practical phrasebook for daily Malaysian conversations and campus life.', 0.94, 0, 0.00, 14, '/file/seed_027_bahasa_malay_phrasebook.jpg', '2026-06-27 10:17:00', 1, 0);
INSERT INTO `good` VALUES (28, 'Math Practice Workbook', 'Step-by-step workbook for algebra, geometry, and exam practice.', 0.90, 0, 0.00, 14, '/file/seed_028_math_practice_workbook.jpg', '2026-06-27 10:18:00', 1, 0);
INSERT INTO `good` VALUES (29, 'English Reading Anthology', 'A selection of short stories and essays for reading practice and discussion.', 0.92, 0, 0.00, 14, '/file/seed_029_english_reading_anthology.jpg', '2026-06-27 10:19:00', 1, 0);
INSERT INTO `good` VALUES (30, 'Study Skills Guide', 'Concise guide covering time management, note taking, and presentation preparation.', 0.89, 0, 0.00, 14, '/file/seed_030_study_skills_guide.jpg', '2026-06-27 10:20:00', 1, 0);
INSERT INTO `good` VALUES (31, 'Ergonomic Laptop Stand', 'Foldable aluminium stand that improves laptop height and desk ventilation.', 0.88, 0, 0.00, 15, '/file/seed_031_ergonomic_laptop_stand.jpg', '2026-06-27 10:21:00', 1, 0);
INSERT INTO `good` VALUES (32, 'USB-C Multiport Hub', 'Compact hub with HDMI, USB-A, and card reader ports for study and office setups.', 0.90, 0, 0.00, 15, '/file/seed_032_usb_c_multiport_hub.jpg', '2026-06-27 10:22:00', 1, 0);
INSERT INTO `good` VALUES (33, 'Protective Laptop Sleeve', 'Padded sleeve with soft lining to protect laptops during commute and travel.', 0.93, 0, 0.00, 15, '/file/seed_033_protective_laptop_sleeve.jpg', '2026-06-27 10:23:00', 1, 0);
INSERT INTO `good` VALUES (34, 'Wireless Mouse', 'Quiet-click wireless mouse with comfortable shape and reliable tracking.', 0.91, 0, 0.00, 15, '/file/seed_034_wireless_mouse.jpg', '2026-06-27 10:24:00', 1, 0);
INSERT INTO `good` VALUES (35, 'Noise Reducing Headphones', 'Over-ear headphones for focused study, calls, and commuting.', 0.87, 0, 0.00, 15, '/file/seed_035_noise_reducing_headphones.jpg', '2026-06-27 10:25:00', 1, 0);
INSERT INTO `good` VALUES (36, 'Slim Power Bank 10000mAh', 'Portable power bank for phones, tablets, and daily travel backup.', 0.92, 0, 0.00, 16, '/file/seed_036_slim_power_bank.jpg', '2026-06-27 10:26:00', 1, 0);
INSERT INTO `good` VALUES (37, 'Phone Tripod Stand', 'Adjustable tripod for online classes, content creation, and video calls.', 0.90, 0, 0.00, 16, '/file/seed_037_phone_tripod_stand.jpg', '2026-06-27 10:27:00', 1, 0);
INSERT INTO `good` VALUES (38, 'Tempered Glass Screen Protector', 'Clear screen protector designed to resist scratches and daily fingerprints.', 0.84, 0, 0.00, 16, '/file/seed_038_screen_protector.jpg', '2026-06-27 10:28:00', 1, 0);
INSERT INTO `good` VALUES (39, 'Tablet Stylus Pen', 'Fine-tip stylus for note taking, drawing drafts, and document markup.', 0.89, 0, 0.00, 17, '/file/seed_039_tablet_stylus_pen.jpg', '2026-06-27 10:29:00', 1, 0);
INSERT INTO `good` VALUES (40, 'Bluetooth Keyboard', 'Slim Bluetooth keyboard for tablets, laptops, and compact desks.', 0.91, 0, 0.00, 17, '/file/seed_040_bluetooth_keyboard.jpg', '2026-06-27 10:30:00', 1, 0);
INSERT INTO `good` VALUES (41, 'Webcam Privacy Cover Set', 'Thin sliding webcam covers for laptops, tablets, and desktop monitors.', 0.82, 0, 0.00, 15, '/file/seed_041_webcam_privacy_cover.jpg', '2026-06-27 10:31:00', 1, 0);
INSERT INTO `good` VALUES (42, 'Sparkling Date Drink', 'Sparkling date drink with a gentle sweetness for family-friendly gatherings.', 0.88, 0, 0.00, 19, '/file/seed_042_sparkling_date_drink.jpg', '2026-06-27 10:32:00', 1, 0);
INSERT INTO `good` VALUES (43, 'Rose Lychee Drink', 'Refreshing rose and lychee beverage for picnics, study breaks, and shared meals.', 0.90, 0, 0.00, 19, '/file/seed_043_rose_lychee_drink.jpg', '2026-06-27 10:33:00', 1, 0);
INSERT INTO `good` VALUES (44, 'Lemongrass Ginger Tea', 'Caffeine-free herbal tea with lemongrass and ginger for a soothing evening cup.', 0.91, 0, 0.00, 20, '/file/seed_044_lemongrass_ginger_tea.jpg', '2026-06-27 10:34:00', 1, 0);
INSERT INTO `good` VALUES (45, 'Jasmine Green Tea', 'Fragrant green tea with jasmine notes for light refreshment through the day.', 0.93, 0, 0.00, 20, '/file/seed_045_jasmine_green_tea.jpg', '2026-06-27 10:35:00', 1, 0);
INSERT INTO `good` VALUES (46, 'Chamomile Tea', 'Gentle caffeine-free chamomile tea for calm routines and quiet evenings.', 0.92, 0, 0.00, 20, '/file/seed_046_chamomile_tea.jpg', '2026-06-27 10:36:00', 1, 0);
INSERT INTO `good` VALUES (47, 'Arabica Ground Coffee', 'Medium roast ground coffee with a balanced aroma for home brewing.', 0.89, 0, 0.00, 21, '/file/seed_047_arabica_ground_coffee.jpg', '2026-06-27 10:37:00', 1, 0);
INSERT INTO `good` VALUES (48, 'Kopi-O Blend', 'Classic local black coffee blend with a bold profile for daily breakfast.', 0.90, 0, 0.00, 21, '/file/seed_048_kopi_o_blend.jpg', '2026-06-27 10:38:00', 1, 0);
INSERT INTO `good` VALUES (49, 'Cocoa Breakfast Drink', 'Cocoa drink powder for breakfast, desserts, and warm family drinks.', 0.87, 0, 0.00, 19, '/file/seed_049_cocoa_breakfast_drink.jpg', '2026-06-27 10:39:00', 1, 0);
INSERT INTO `good` VALUES (50, 'Honey Oat Biscuits', 'Crunchy oat biscuits with honey notes for tea breaks and lunch boxes.', 0.91, 0, 0.00, 18, '/file/seed_050_honey_oat_biscuits.jpg', '2026-06-27 10:40:00', 1, 0);
INSERT INTO `good` VALUES (51, 'Dried Dates Gift Box', 'Naturally sweet dried dates in a neat box for sharing and gifting.', 0.86, 0, 0.00, 18, '/file/seed_051_dried_dates_gift_box.jpg', '2026-06-27 10:41:00', 1, 0);
INSERT INTO `good` VALUES (52, 'Mixed Nuts Trail Pack', 'Balanced trail mix with nuts and dried fruit for study breaks and travel.', 0.88, 0, 0.00, 18, '/file/seed_052_mixed_nuts_trail_pack.jpg', '2026-06-27 10:42:00', 1, 0);
INSERT INTO `good` VALUES (53, 'Instant Oatmeal Cups', 'Quick oatmeal cups for breakfast, dorm rooms, and office pantries.', 0.90, 0, 0.00, 18, '/file/seed_053_instant_oatmeal_cups.jpg', '2026-06-27 10:43:00', 1, 0);
INSERT INTO `good` VALUES (54, 'Bamboo Tissue Box', 'Reusable bamboo tissue box cover that keeps counters neat and warm.', 0.92, 0, 0.00, 23, '/file/seed_054_bamboo_tissue_box.jpg', '2026-06-27 10:44:00', 1, 0);
INSERT INTO `good` VALUES (55, 'Laundry Detergent Sheets', 'Lightweight detergent sheets for easy washing and compact storage.', 0.85, 0, 0.00, 23, '/file/seed_055_laundry_detergent_sheets.jpg', '2026-06-27 10:45:00', 0, 0);
INSERT INTO `good` VALUES (56, 'Eco Dish Soap', 'Gentle dish soap with a clean scent for shared kitchens and home use.', 0.90, 0, 0.00, 23, '/file/seed_056_eco_dish_soap.jpg', '2026-06-27 10:46:00', 0, 0);
INSERT INTO `good` VALUES (57, 'Microfiber Towel Set', 'Soft microfiber towels for home, gym, and travel routines.', 0.89, 0, 0.00, 22, '/file/seed_057_microfiber_towel_set.jpg', '2026-06-27 10:47:00', 0, 0);
INSERT INTO `good` VALUES (58, 'Reusable Shopping Bags', 'Foldable reusable bags for groceries, books, and everyday errands.', 0.83, 0, 0.00, 22, '/file/seed_058_reusable_shopping_bags.jpg', '2026-06-27 10:48:00', 0, 0);
INSERT INTO `good` VALUES (59, 'Stainless Food Container', 'Leak-resistant stainless food container for packed meals and snacks.', 0.88, 0, 0.00, 22, '/file/seed_059_stainless_food_container.jpg', '2026-06-27 10:49:00', 0, 0);
INSERT INTO `good` VALUES (60, 'Mild Hand Wash', 'Gentle hand wash suitable for shared bathrooms, kitchens, and office sinks.', 0.91, 0, 0.00, 22, '/file/seed_060_mild_hand_wash.jpg', '2026-06-27 10:50:00', 0, 0);

-- ----------------------------
-- Table structure for good_standard
-- ----------------------------
DROP TABLE IF EXISTS `good_standard`;
CREATE TABLE `good_standard`  (
  `good_id` bigint(0) NOT NULL COMMENT 'Product ID',
  `value` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Variant',
  `price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Price',
  `store` bigint(0) NOT NULL DEFAULT 0 COMMENT 'Stock',
  PRIMARY KEY (`good_id`, `value`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Product variant table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of good_standard
-- ----------------------------
INSERT INTO `good_standard` VALUES (8, '123', 123.00, 80);
INSERT INTO `good_standard` VALUES (5, 'White', 145.00, 299);
INSERT INTO `good_standard` VALUES (7, 'EU 43', 115.00, 149);
INSERT INTO `good_standard` VALUES (6, 'English Edition', 99.00, 500);
INSERT INTO `good_standard` VALUES (3, 'Desk', 90.00, 600);
INSERT INTO `good_standard` VALUES (3, 'Chair', 50.00, 500);
INSERT INTO `good_standard` VALUES (3, 'Desk + Chair', 150.00, 500);
INSERT INTO `good_standard` VALUES (2, 'S', 129.00, 498);
INSERT INTO `good_standard` VALUES (2, 'M', 129.00, 496);
INSERT INTO `good_standard` VALUES (2, 'L', 129.00, 496);
INSERT INTO `good_standard` VALUES (9, 'Standard Edition', 50.00, 600);
INSERT INTO `good_standard` VALUES (10, '30 cm', 60.00, 500);
INSERT INTO `good_standard` VALUES (11, 'S', 89.00, 180);
INSERT INTO `good_standard` VALUES (11, 'M', 89.00, 220);
INSERT INTO `good_standard` VALUES (11, 'L', 89.00, 180);
INSERT INTO `good_standard` VALUES (12, 'M', 109.00, 160);
INSERT INTO `good_standard` VALUES (12, 'L', 109.00, 170);
INSERT INTO `good_standard` VALUES (12, 'XL', 109.00, 140);
INSERT INTO `good_standard` VALUES (13, 'S', 49.00, 260);
INSERT INTO `good_standard` VALUES (13, 'M', 49.00, 320);
INSERT INTO `good_standard` VALUES (13, 'L', 49.00, 260);
INSERT INTO `good_standard` VALUES (14, 'M', 129.00, 150);
INSERT INTO `good_standard` VALUES (14, 'L', 129.00, 160);
INSERT INTO `good_standard` VALUES (14, 'XL', 129.00, 120);
INSERT INTO `good_standard` VALUES (15, 'M', 89.00, 190);
INSERT INTO `good_standard` VALUES (15, 'L', 89.00, 180);
INSERT INTO `good_standard` VALUES (15, 'XL', 89.00, 130);
INSERT INTO `good_standard` VALUES (16, 'EU 39', 139.00, 90);
INSERT INTO `good_standard` VALUES (16, 'EU 41', 139.00, 120);
INSERT INTO `good_standard` VALUES (16, 'EU 43', 139.00, 110);
INSERT INTO `good_standard` VALUES (17, 'EU 40', 159.00, 80);
INSERT INTO `good_standard` VALUES (17, 'EU 42', 159.00, 110);
INSERT INTO `good_standard` VALUES (17, 'EU 44', 159.00, 90);
INSERT INTO `good_standard` VALUES (18, 'EU 38', 79.00, 100);
INSERT INTO `good_standard` VALUES (18, 'EU 40', 79.00, 110);
INSERT INTO `good_standard` VALUES (18, 'EU 42', 79.00, 100);
INSERT INTO `good_standard` VALUES (19, 'Pack of 3', 29.00, 500);
INSERT INTO `good_standard` VALUES (19, 'Pack of 5', 45.00, 420);
INSERT INTO `good_standard` VALUES (20, 'Black 10 pcs', 19.00, 600);
INSERT INTO `good_standard` VALUES (20, 'Mixed 10 pcs', 21.00, 580);
INSERT INTO `good_standard` VALUES (21, 'Standard', 39.00, 300);
INSERT INTO `good_standard` VALUES (21, 'Large', 49.00, 220);
INSERT INTO `good_standard` VALUES (22, '6 Pads', 12.00, 700);
INSERT INTO `good_standard` VALUES (22, '12 Pads', 22.00, 500);
INSERT INTO `good_standard` VALUES (23, 'A5', 35.00, 420);
INSERT INTO `good_standard` VALUES (23, 'B5', 45.00, 350);
INSERT INTO `good_standard` VALUES (24, 'A4 40 sheets', 25.00, 360);
INSERT INTO `good_standard` VALUES (24, 'A3 30 sheets', 42.00, 240);
INSERT INTO `good_standard` VALUES (25, '12 Colours', 32.00, 300);
INSERT INTO `good_standard` VALUES (25, '24 Colours', 58.00, 180);
INSERT INTO `good_standard` VALUES (26, 'Set of 4', 49.00, 260);
INSERT INTO `good_standard` VALUES (26, 'Set of 8', 88.00, 160);
INSERT INTO `good_standard` VALUES (27, 'Pocket Edition', 29.00, 420);
INSERT INTO `good_standard` VALUES (28, 'Standard Edition', 35.00, 390);
INSERT INTO `good_standard` VALUES (29, 'Paperback', 45.00, 300);
INSERT INTO `good_standard` VALUES (30, 'Paperback', 29.00, 360);
INSERT INTO `good_standard` VALUES (31, 'Silver', 99.00, 180);
INSERT INTO `good_standard` VALUES (31, 'Space Grey', 99.00, 160);
INSERT INTO `good_standard` VALUES (32, '6-in-1', 119.00, 150);
INSERT INTO `good_standard` VALUES (32, '8-in-1', 149.00, 120);
INSERT INTO `good_standard` VALUES (33, '13 inch', 49.00, 210);
INSERT INTO `good_standard` VALUES (33, '15 inch', 59.00, 180);
INSERT INTO `good_standard` VALUES (34, 'Graphite', 39.00, 350);
INSERT INTO `good_standard` VALUES (34, 'White', 39.00, 320);
INSERT INTO `good_standard` VALUES (35, 'Black', 159.00, 130);
INSERT INTO `good_standard` VALUES (35, 'Cream', 159.00, 120);
INSERT INTO `good_standard` VALUES (36, '10000mAh', 79.00, 240);
INSERT INTO `good_standard` VALUES (36, '20000mAh', 129.00, 180);
INSERT INTO `good_standard` VALUES (37, 'Tabletop', 55.00, 250);
INSERT INTO `good_standard` VALUES (37, 'Extended', 89.00, 180);
INSERT INTO `good_standard` VALUES (38, 'iPhone Size', 19.00, 520);
INSERT INTO `good_standard` VALUES (38, 'Android Size', 19.00, 520);
INSERT INTO `good_standard` VALUES (39, 'White', 109.00, 160);
INSERT INTO `good_standard` VALUES (39, 'Graphite', 109.00, 150);
INSERT INTO `good_standard` VALUES (40, 'Compact', 99.00, 200);
INSERT INTO `good_standard` VALUES (40, 'With Cover', 129.00, 140);
INSERT INTO `good_standard` VALUES (41, 'Pack of 3', 12.00, 650);
INSERT INTO `good_standard` VALUES (41, 'Pack of 6', 20.00, 480);
INSERT INTO `good_standard` VALUES (42, '4 Cans', 26.00, 360);
INSERT INTO `good_standard` VALUES (42, '12 Cans', 72.00, 220);
INSERT INTO `good_standard` VALUES (43, '6 Bottles', 24.00, 340);
INSERT INTO `good_standard` VALUES (43, '12 Bottles', 45.00, 240);
INSERT INTO `good_standard` VALUES (44, '20 Sachets', 22.00, 420);
INSERT INTO `good_standard` VALUES (44, '40 Sachets', 39.00, 260);
INSERT INTO `good_standard` VALUES (45, '25 Tea Bags', 28.00, 360);
INSERT INTO `good_standard` VALUES (45, 'Loose Leaf 100g', 42.00, 240);
INSERT INTO `good_standard` VALUES (46, '20 Tea Bags', 24.00, 380);
INSERT INTO `good_standard` VALUES (46, '40 Tea Bags', 44.00, 220);
INSERT INTO `good_standard` VALUES (47, '250g', 39.00, 260);
INSERT INTO `good_standard` VALUES (47, '500g', 72.00, 170);
INSERT INTO `good_standard` VALUES (48, '20 Sachets', 29.00, 340);
INSERT INTO `good_standard` VALUES (48, '40 Sachets', 52.00, 220);
INSERT INTO `good_standard` VALUES (49, '500g', 32.00, 260);
INSERT INTO `good_standard` VALUES (49, '1kg', 58.00, 170);
INSERT INTO `good_standard` VALUES (50, 'Tin 300g', 18.00, 420);
INSERT INTO `good_standard` VALUES (50, 'Family Pack', 32.00, 260);
INSERT INTO `good_standard` VALUES (51, '500g', 39.00, 260);
INSERT INTO `good_standard` VALUES (51, '1kg', 72.00, 180);
INSERT INTO `good_standard` VALUES (52, '300g', 34.00, 280);
INSERT INTO `good_standard` VALUES (52, '600g', 62.00, 180);
INSERT INTO `good_standard` VALUES (53, '6 Cups', 25.00, 320);
INSERT INTO `good_standard` VALUES (53, '12 Cups', 46.00, 220);
INSERT INTO `good_standard` VALUES (54, 'Standard', 38.00, 240);
INSERT INTO `good_standard` VALUES (55, '30 Sheets', 32.00, 300);
INSERT INTO `good_standard` VALUES (55, '60 Sheets', 58.00, 200);
INSERT INTO `good_standard` VALUES (56, '500ml', 16.00, 360);
INSERT INTO `good_standard` VALUES (56, 'Refill 1L', 28.00, 280);
INSERT INTO `good_standard` VALUES (57, 'Set of 3', 29.00, 300);
INSERT INTO `good_standard` VALUES (57, 'Set of 6', 52.00, 190);
INSERT INTO `good_standard` VALUES (58, 'Set of 2', 19.00, 420);
INSERT INTO `good_standard` VALUES (58, 'Set of 5', 39.00, 280);
INSERT INTO `good_standard` VALUES (59, '700ml', 49.00, 220);
INSERT INTO `good_standard` VALUES (59, '1L', 69.00, 180);
INSERT INTO `good_standard` VALUES (60, '500ml', 18.00, 360);
INSERT INTO `good_standard` VALUES (60, 'Refill 1L', 30.00, 240);

-- ----------------------------
-- Table structure for icon
-- ----------------------------
DROP TABLE IF EXISTS `icon`;
CREATE TABLE `icon`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `value` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Icon code',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Icon table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of icon
-- ----------------------------
INSERT INTO `icon` VALUES (1, '&#xe600;');
INSERT INTO `icon` VALUES (15, '&#xe617;');
INSERT INTO `icon` VALUES (16, '&#xe709;');
INSERT INTO `icon` VALUES (17, '&#xe601;');
INSERT INTO `icon` VALUES (18, '&#xe618;');
INSERT INTO `icon` VALUES (19, '&#xe602;');
INSERT INTO `icon` VALUES (21, '&#xe606;');

-- ----------------------------
-- Table structure for icon_category
-- ----------------------------
DROP TABLE IF EXISTS `icon_category`;
CREATE TABLE `icon_category`  (
  `category_id` bigint(0) NOT NULL COMMENT 'Category ID',
  `icon_id` bigint(0) NOT NULL COMMENT 'Icon ID',
  PRIMARY KEY (`category_id`) USING BTREE,
  KEY `idx_icon_category_icon` (`icon_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Product category icon relation table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of icon_category
-- ----------------------------
INSERT INTO `icon_category` VALUES (1, 1);
INSERT INTO `icon_category` VALUES (2, 1);
INSERT INTO `icon_category` VALUES (10, 15);
INSERT INTO `icon_category` VALUES (11, 15);
INSERT INTO `icon_category` VALUES (12, 15);
INSERT INTO `icon_category` VALUES (13, 16);
INSERT INTO `icon_category` VALUES (14, 16);
INSERT INTO `icon_category` VALUES (15, 17);
INSERT INTO `icon_category` VALUES (16, 17);
INSERT INTO `icon_category` VALUES (17, 17);
INSERT INTO `icon_category` VALUES (18, 18);
INSERT INTO `icon_category` VALUES (19, 19);
INSERT INTO `icon_category` VALUES (20, 19);
INSERT INTO `icon_category` VALUES (21, 19);
INSERT INTO `icon_category` VALUES (22, 21);
INSERT INTO `icon_category` VALUES (23, 21);

-- ----------------------------
-- Table structure for order_goods
-- ----------------------------
DROP TABLE IF EXISTS `order_goods`;
CREATE TABLE `order_goods`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `order_id` bigint(0) NULL DEFAULT NULL COMMENT 'Order ID',
  `good_id` bigint(0) NULL DEFAULT NULL COMMENT 'Product ID',
  `count` int(0) NULL DEFAULT NULL COMMENT 'Quantity',
  `standard` varchar(1600) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Variant',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_order_goods_order` (`order_id`) USING BTREE,
  KEY `idx_order_goods_good` (`good_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_goods
-- ----------------------------
INSERT INTO `order_goods` VALUES (9, 9, 2, 3, 'M');
INSERT INTO `order_goods` VALUES (24, 24, 5, 1, 'White');

-- ----------------------------
-- Table structure for sys_file
-- ----------------------------
DROP TABLE IF EXISTS `sys_file`;
CREATE TABLE `sys_file`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'File name',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'File type',
  `size` bigint(0) NULL DEFAULT NULL COMMENT 'Size',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'File path',
  `is_delete` tinyint(1) NULL DEFAULT NULL COMMENT 'Deleted flag',
  `enable` tinyint(1) NULL DEFAULT NULL COMMENT 'Enabled flag',
  `md5` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'MD5 value',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'System file table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_file
-- ----------------------------
INSERT INTO `sys_file` VALUES (7, '07.jpg', 'jpg', 1814, '/file/7dfd10628edc4b4e97de19c1cb86585e.jpg', 0, 0, '04271616ebc6914643c3af592dd58bef');
INSERT INTO `sys_file` VALUES (8, '9a49edb823cc4cb799cb3438a7419a83.jpg', 'jpg', 132, '/file/2b6249b9ba24491a9048c1e8c0b5256e.jpg', 0, 0, 'f11ed5acc29b90770a453eceb7524712');
INSERT INTO `sys_file` VALUES (9, '9a49edb823cc4cb799cb3438a7419a83.jpg', 'jpg', 132, '/file/2b6249b9ba24491a9048c1e8c0b5256e.jpg', 0, 0, 'f11ed5acc29b90770a453eceb7524712');
INSERT INTO `sys_file` VALUES (10, '9a49edb823cc4cb799cb3438a7419a83.jpg', 'jpg', 132, '/file/2b6249b9ba24491a9048c1e8c0b5256e.jpg', 0, 0, 'f11ed5acc29b90770a453eceb7524712');
INSERT INTO `sys_file` VALUES (11, '9a49edb823cc4cb799cb3438a7419a83.jpg', 'jpg', 132, '/file/2b6249b9ba24491a9048c1e8c0b5256e.jpg', 0, 0, 'f11ed5acc29b90770a453eceb7524712');
INSERT INTO `sys_file` VALUES (12, '5a776cc21c1b407bbd2595a7af726a61.jpg', 'jpg', 846, '/file/0e8132c00dc6484faa18b2d1487b34ec.jpg', 0, 0, '8f0a34a66bbc1a794b7c138897a66dad');
INSERT INTO `sys_file` VALUES (13, '5a776cc21c1b407bbd2595a7af726a61.jpg', 'jpg', 846, '/file/0e8132c00dc6484faa18b2d1487b34ec.jpg', 0, 0, '8f0a34a66bbc1a794b7c138897a66dad');
INSERT INTO `sys_file` VALUES (14, '5a776cc21c1b407bbd2595a7af726a61.jpg', 'jpg', 846, '/file/0e8132c00dc6484faa18b2d1487b34ec.jpg', 0, 0, '8f0a34a66bbc1a794b7c138897a66dad');
INSERT INTO `sys_file` VALUES (15, '5a776cc21c1b407bbd2595a7af726a61.jpg', 'jpg', 846, '/file/0e8132c00dc6484faa18b2d1487b34ec.jpg', 0, 0, '8f0a34a66bbc1a794b7c138897a66dad');
INSERT INTO `sys_file` VALUES (16, '5a776cc21c1b407bbd2595a7af726a61.jpg', 'jpg', 846, '/file/0e8132c00dc6484faa18b2d1487b34ec.jpg', 0, 0, '8f0a34a66bbc1a794b7c138897a66dad');
INSERT INTO `sys_file` VALUES (17, '5a776cc21c1b407bbd2595a7af726a61.jpg', 'jpg', 846, '/file/0e8132c00dc6484faa18b2d1487b34ec.jpg', 0, 0, '8f0a34a66bbc1a794b7c138897a66dad');
INSERT INTO `sys_file` VALUES (18, '02.jpg', 'jpg', 33, '/file/84ad8a9829424254811ce2220edc2d3b.jpg', 0, 0, 'fcf09e93c497c75cf2b3656f80f997cc');
INSERT INTO `sys_file` VALUES (19, '01.jpg', 'jpg', 26, '/file/cef757d124ec4b169cffd65de5e3c47c.jpg', 0, 0, 'd5b6bb3b068c1980d77c59079248a4a4');
INSERT INTO `sys_file` VALUES (20, '03.jpg', 'jpg', 22, '/file/7791be8ea1ee4aa0a149ae8e75c857d6.jpg', 0, 0, '75e8b3e8790e514fb799857f636a1623');
INSERT INTO `sys_file` VALUES (21, '04.jpg', 'jpg', 25, '/file/867aaf026b684b1e8b1a10c87e31df7e.jpg', 0, 0, '1d7397d5a4ce0995f711a1484d593f44');
INSERT INTO `sys_file` VALUES (22, '05.jpg', 'jpg', 19, '/file/f9f26a01e13d4ba68d7f7bd12df282e0.jpg', 0, 0, 'b2d243af2652abf08a491074c8f099ea');
INSERT INTO `sys_file` VALUES (23, '06.jpg', 'jpg', 11, '/file/286aa7816325455b8cdcd522aca833fe.jpg', 0, 0, 'c160a645c3dacb58ffb123a4239dcb50');
INSERT INTO `sys_file` VALUES (24, '037c5b1f3e40406893b423563c557a91.jpg', 'jpg', 1641, '/file/09bb6edab07a4c68a44cce41a3300d97.jpg', 0, 0, '067143803d2f87dcb939de5d4ace2bbb');
INSERT INTO `sys_file` VALUES (25, '01.jpg', 'jpg', 329, '/file/15cb9fc604984dfa97e0e968eb1d196d.jpg', 0, 0, '8c78b307ff66fbc7db624da25138f480');
INSERT INTO `sys_file` VALUES (26, '02.jpg', 'jpg', 738, '/file/e2cf8486c2384b8296972a550bf7e934.jpg', 0, 0, '7db1f7335529ad2a68367d29d0441695');
INSERT INTO `sys_file` VALUES (27, '04.jpg', 'jpg', 158, '/file/0afa4eb1c51943808f6e83cd9ced25e8.jpg', 0, 0, '0bfaaafc7ca1a9a5478baa8c9cae492c');
INSERT INTO `sys_file` VALUES (28, '05 (1).jpg', 'jpg', 773, '/file/8dc5354c7332454796c614bb4a0572fb.jpg', 0, 0, '925882b34e70434888ee7ca373bae52c');
INSERT INTO `sys_file` VALUES (29, '03 (2).jpg', 'jpg', 208, '/file/b4ac53ed62c74c298366619399c39f99.jpg', 0, 0, '1468738643a2f6dbd5fad1f7c80cdb00');
INSERT INTO `sys_file` VALUES (30, '06.jpg', 'jpg', 3494, '/file/be9d2d6a17c5436fb0b8c2f7927484b2.jpg', 0, 0, 'd9950e2a7400a3d26ebde81c47e92e04');
INSERT INTO `sys_file` VALUES (31, '02.png', 'png', 5898, '/file/74488020672944968462e9e4a9c89096.png', 0, 0, 'ad801047fc9918bd626656d08d696898');
INSERT INTO `sys_file` VALUES (32, '02.png', 'png', 71, '/file/2e2a1df657324a3293642344327310cb.png', 0, 0, '2c3a088b474cb2144645411f2e3da9c6');
INSERT INTO `sys_file` VALUES (33, '03.jpg', 'jpg', 31, '/file/449ab0163ba648c08cb4a76b40a9dcec.jpg', 0, 0, 'fa95b8365bc4ec2096f4dc3f31dc8e27');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Username',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Password',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Nickname',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Email',
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Phone number',
  `address` varchar(1600) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Address',
  `avatar_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Avatar URL',
  `role` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Role',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_sys_user_username` (`username`) USING BTREE,
  UNIQUE KEY `uk_sys_user_email` (`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'User table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'Administrator', 'admin@example.com', '+60 12-345 6789', 'Kolej Keris Mas, Universiti Kebangsaan Malaysia, Bangi, Selangor 43600, Malaysia', '/avatar/09cd5add81ff4abfbd1ccf91b2e9c820.jpg', 'admin');
INSERT INTO `sys_user` VALUES (2, 'user', 'e10adc3949ba59abbe56e057f20f883e', 'Demo User', 'user@example.com', '+60 11-1234 5678', 'No. 12, Jalan Reko, Kajang, Selangor 43000, Malaysia', '/avatar/978418fbe75243b4ba38da389a468b78.jpg', 'user');

-- ----------------------------
-- Table structure for t_order
-- ----------------------------
DROP TABLE IF EXISTS `t_order`;
CREATE TABLE `t_order`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
  `order_no` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Order number',
  `total_price` decimal(10, 2) NULL DEFAULT NULL COMMENT 'Total price',
  `user_id` bigint(0) NULL DEFAULT NULL COMMENT 'User ID',
  `link_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Contact name',
  `link_phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Phone number',
  `link_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Address',
  `state` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT 'Order status',
  `create_time` datetime NULL DEFAULT NULL COMMENT 'Created time',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_t_order_order_no` (`order_no`) USING BTREE,
  KEY `idx_order_user_time` (`user_id`, `create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = 'Order table' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_order
-- ----------------------------
INSERT INTO `t_order` VALUES (9, '20260331223822860904', 367.65, 2, 'Aisha Rahman', '+60 11-1234 5678', 'No. 12, Jalan Reko, Kajang, Selangor 43000, Malaysia', 'Received', '2026-03-31 22:38:22');
INSERT INTO `t_order` VALUES (24, '20260805014642654151', 116.00, 2, 'Aisha Rahman', '+60 11-1234 5678', 'No. 12, Jalan Reko, Kajang, Selangor 43000, Malaysia', 'Paid', '2026-08-05 01:46:42');

-- ----------------------------
-- Foreign key constraints
-- ----------------------------
ALTER TABLE `address`
  ADD CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_good` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `carousel`
  ADD CONSTRAINT `fk_carousel_good` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `good`
  ADD CONSTRAINT `fk_good_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `good_standard`
  ADD CONSTRAINT `fk_good_standard_good` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `icon_category`
  ADD CONSTRAINT `fk_icon_category_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_icon_category_icon` FOREIGN KEY (`icon_id`) REFERENCES `icon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `t_order`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `order_goods`
  ADD CONSTRAINT `fk_order_goods_order` FOREIGN KEY (`order_id`) REFERENCES `t_order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_goods_good` FOREIGN KEY (`good_id`) REFERENCES `good` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
