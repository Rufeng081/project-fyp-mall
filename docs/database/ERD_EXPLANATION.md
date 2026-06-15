# ERD Explanation for FYP Report

The ERD for Project FYP Mall represents a small online shopping system. The central business entities are users, products, product variants, carts, orders, and order items.

`sys_user` stores account information for customers and administrators. Each user can own multiple delivery addresses in `address`, multiple cart records in `cart`, and multiple orders in `t_order`.

`good` stores the product master record, including product name, description, category, image path, discount, sales count, total sales amount, recommendation flag, and soft-delete flag. Product categories are stored in `category`. Category navigation icons are handled by `icon` and `icon_category`.

`good_standard` stores the selectable product variants, such as size, edition, or color. Each variant has its own price and stock value. This table is used by product detail, cart, order placement, and simulated payment stock deduction.

`cart` stores products that a user intends to buy. A cart row records the user, product, selected variant, quantity, and add time.

`t_order` stores the order header. It records the generated order number, total amount, owner user, delivery contact snapshot, order state, and creation time. `order_goods` stores the order line items. Each order can contain one or more purchased products.

`carousel` stores homepage carousel entries that link to selected products. `sys_file` and `avatar` store uploaded file metadata for product images and user avatars.

For the final FYP report, the ERD can be described as a compact relational design for a single-VM cloud e-commerce system. The SQL seed now includes the main keys, indexes, and foreign-key constraints after cleaning orphaned `order_goods` rows. Before applying it to the cloud VM, the database should be backed up and the script should be imported into a disposable MySQL database for final confirmation.
