-- Live DB in-place optimization for Project FYP Mall.
-- Date: 2026-06-16
-- Scope: optimize existing electronic_mall schema without resetting demo data.
-- Prerequisite: back up the live database before applying this migration.

USE `electronic_mall`;

SET FOREIGN_KEY_CHECKS = 0;

-- Clean existing data that would block foreign-key enforcement.
DELETE og
FROM `order_goods` og
LEFT JOIN `t_order` o ON og.`order_id` = o.`id`
WHERE o.`id` IS NULL;

-- Remove unused legacy variant table. The backend maps variants to good_standard.
DROP TABLE IF EXISTS `standard`;

-- Product and money field improvements.
ALTER TABLE `good`
  MODIFY `discount` decimal(4, 2) NOT NULL DEFAULT 1.00 COMMENT 'Discount',
  MODIFY `sale_money` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'Sales amount',
  ADD KEY `idx_good_category_status` (`category_id`, `is_delete`, `recommend`) USING BTREE;

-- Active product variant table integrity.
ALTER TABLE `good_standard`
  MODIFY `good_id` bigint NOT NULL COMMENT 'Product ID',
  MODIFY `value` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT 'Variant',
  MODIFY `price` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Price',
  MODIFY `store` bigint NOT NULL DEFAULT 0 COMMENT 'Stock',
  ADD PRIMARY KEY (`good_id`, `value`) USING BTREE;

-- Common lookup indexes and uniqueness constraints.
ALTER TABLE `address`
  ADD KEY `idx_address_user` (`user_id`) USING BTREE;

ALTER TABLE `carousel`
  ADD KEY `idx_carousel_good` (`good_id`) USING BTREE,
  ADD KEY `idx_carousel_show_order` (`show_order`) USING BTREE;

ALTER TABLE `cart`
  ADD KEY `idx_cart_user_time` (`user_id`, `create_time`) USING BTREE,
  ADD KEY `idx_cart_good_standard` (`good_id`, `standard`) USING BTREE;

ALTER TABLE `icon_category`
  ADD KEY `idx_icon_category_icon` (`icon_id`) USING BTREE;

ALTER TABLE `order_goods`
  ADD KEY `idx_order_goods_order` (`order_id`) USING BTREE,
  ADD KEY `idx_order_goods_good` (`good_id`) USING BTREE;

ALTER TABLE `sys_user`
  ADD UNIQUE KEY `uk_sys_user_username` (`username`) USING BTREE;

ALTER TABLE `t_order`
  ADD UNIQUE KEY `uk_t_order_order_no` (`order_no`) USING BTREE,
  ADD KEY `idx_order_user_time` (`user_id`, `create_time`) USING BTREE;

-- Physical foreign-key relationships for core e-commerce tables.
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
