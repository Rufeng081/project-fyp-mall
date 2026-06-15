const fs = require("fs");
const path = require("path");

const sqlPath = path.join(__dirname, "..", "database", "electronic_mall.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

function fail(message) {
  failures.push(message);
}

function has(pattern) {
  return pattern.test(sql);
}

function tableBlock(tableName) {
  const pattern = new RegExp(
    `CREATE TABLE \`${tableName}\`\\s*\\(([^]*?)\\) ENGINE`,
    "m"
  );
  const match = sql.match(pattern);
  return match ? match[1] : "";
}

function insertedIds(tableName) {
  const pattern = new RegExp(`INSERT INTO \`${tableName}\` VALUES \\((\\d+),`, "g");
  return new Set([...sql.matchAll(pattern)].map((match) => Number(match[1])));
}

function insertedForeignIds(tableName, valueIndex) {
  const pattern = new RegExp(`INSERT INTO \`${tableName}\` VALUES \\(([^;]+)\\);`, "g");
  const values = [];
  for (const match of sql.matchAll(pattern)) {
    const parts = match[1]
      .split(/,(?=(?:[^']*'[^']*')*[^']*$)/)
      .map((part) => part.trim().replace(/^'|'$/g, ""));
    values.push(Number(parts[valueIndex]));
  }
  return values.filter((value) => Number.isFinite(value));
}

const failures = [];

const goodBlock = tableBlock("good");
const goodStandardBlock = tableBlock("good_standard");
const sysUserBlock = tableBlock("sys_user");
const orderBlock = tableBlock("t_order");

if (!goodBlock) fail("Missing table `good`.");
if (!goodStandardBlock) fail("Missing table `good_standard`.");
if (!sysUserBlock) fail("Missing table `sys_user`.");
if (!orderBlock) fail("Missing table `t_order`.");

if (has(/CREATE TABLE `standard`\s*\(/)) {
  fail("Legacy duplicate table `standard` still exists.");
}

if (!/PRIMARY KEY \(`good_id`,\s*`value`\)/.test(goodStandardBlock)
    && !/UNIQUE KEY `[^`]+` \(`good_id`,\s*`value`\)/.test(goodStandardBlock)) {
  fail("`good_standard` must have a primary or unique key on (`good_id`, `value`).");
}

if (/`sale_money`\s+double/i.test(goodBlock)) {
  fail("`good.sale_money` must use DECIMAL, not DOUBLE.");
}

if (/`discount`\s+double/i.test(goodBlock)) {
  fail("`good.discount` should use DECIMAL for consistent numeric behavior.");
}

if (!/UNIQUE KEY `uk_sys_user_username` \(`username`\)/.test(sysUserBlock)) {
  fail("`sys_user.username` should have a unique key.");
}

if (!/UNIQUE KEY `uk_t_order_order_no` \(`order_no`\)/.test(orderBlock)) {
  fail("`t_order.order_no` should have a unique key.");
}

const expectedIndexes = [
  /KEY `idx_good_category_status` \(`category_id`,\s*`is_delete`,\s*`recommend`\)/,
  /KEY `idx_cart_user_time` \(`user_id`,\s*`create_time`\)/,
  /KEY `idx_order_user_time` \(`user_id`,\s*`create_time`\)/,
  /KEY `idx_order_goods_good` \(`good_id`\)/,
  /KEY `idx_carousel_show_order` \(`show_order`\)/,
];

for (const pattern of expectedIndexes) {
  if (!has(pattern)) {
    fail(`Missing expected index matching ${pattern}.`);
  }
}

const expectedConstraints = [
  "fk_address_user",
  "fk_cart_user",
  "fk_cart_good",
  "fk_carousel_good",
  "fk_good_category",
  "fk_good_standard_good",
  "fk_icon_category_category",
  "fk_icon_category_icon",
  "fk_order_user",
  "fk_order_goods_order",
  "fk_order_goods_good",
];

for (const constraint of expectedConstraints) {
  if (!has(new RegExp(`CONSTRAINT \`${constraint}\``))) {
    fail(`Missing foreign key constraint ${constraint}.`);
  }
}

const orderIds = insertedIds("t_order");
const orderGoodsOrderIds = insertedForeignIds("order_goods", 1);
const orphanOrderGoods = [...new Set(orderGoodsOrderIds.filter((id) => !orderIds.has(id)))];
if (orphanOrderGoods.length > 0) {
  fail(`Orphan order_goods.order_id values found: ${orphanOrderGoods.join(", ")}.`);
}

if (failures.length > 0) {
  console.error("Database schema validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Database schema validation passed.");
