const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const vueRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(vueRoot, "..");
const sqlPath = path.join(repoRoot, "database/electronic_mall.sql");
const imageRoot = path.join(repoRoot, "ElectronicMallApi/file");
const minImageSide = 640;

const expectedCategoryByProductId = {
  2: "Men Clothing",
  3: "Household Supplies",
  5: "Clothing",
  6: "Books",
  7: "Casual Shoes",
  9: "Stationery",
  10: "Daily Essentials",
  11: "Clothing",
  12: "Men Clothing",
  13: "Clothing",
  14: "Clothing",
  15: "Clothing",
  16: "Casual Shoes",
  17: "Sports Shoes",
  18: "Casual Shoes",
  19: "Stationery",
  20: "Stationery",
  21: "Stationery",
  22: "Stationery",
  23: "Stationery",
  24: "Stationery",
  25: "Stationery",
  26: "Books",
  27: "Books",
  28: "Books",
  29: "Books",
  30: "Books",
  31: "Laptops",
  32: "Laptops",
  33: "Laptops",
  34: "Laptops",
  35: "Laptops",
  36: "Smartphones",
  37: "Smartphones",
  38: "Smartphones",
  39: "Tablets",
  40: "Tablets",
  41: "Laptops",
  42: "Beverages",
  43: "Beverages",
  44: "Tea",
  45: "Tea",
  46: "Tea",
  47: "Coffee",
  48: "Coffee",
  49: "Beverages",
  50: "Food and Beverages",
  51: "Food and Beverages",
  52: "Food and Beverages",
  53: "Food and Beverages",
  54: "Household Supplies",
  55: "Household Supplies",
  56: "Household Supplies",
  57: "Daily Essentials",
  58: "Daily Essentials",
  59: "Daily Essentials",
  60: "Daily Essentials",
};

function splitSqlValues(tuple) {
  const values = [];
  let current = "";
  let inString = false;

  for (let index = 0; index < tuple.length; index += 1) {
    const char = tuple[index];
    const next = tuple[index + 1];

    if (char === "'" && next === "'") {
      current += "'";
      index += 1;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      continue;
    }

    if (char === "," && !inString) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseRows(sql, tableName) {
  const rows = [];
  const pattern = new RegExp("INSERT INTO `" + tableName + "` VALUES \\((.*)\\);", "g");
  let match;

  while ((match = pattern.exec(sql)) !== null) {
    rows.push(splitSqlValues(match[1]));
  }

  return rows;
}

function readDimensions(filePath) {
  const output = execFileSync("/usr/bin/sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath], {
    encoding: "utf8",
  });
  const width = Number((output.match(/pixelWidth:\s*(\d+)/) || [])[1]);
  const height = Number((output.match(/pixelHeight:\s*(\d+)/) || [])[1]);
  return { width, height };
}

const sql = fs.readFileSync(sqlPath, "utf8");
const categories = new Map(parseRows(sql, "category").map((row) => [Number(row[0]), row[1]]));
const activeProducts = parseRows(sql, "good")
  .map((row) => ({
    id: Number(row[0]),
    name: row[1],
    categoryId: Number(row[6]),
    image: row[7],
    isDelete: Number(row[10]) === 1,
  }))
  .filter((product) => !product.isDelete);

const failures = [];

if (activeProducts.length === 0) {
  failures.push("No active products were parsed from database/electronic_mall.sql");
}

activeProducts.forEach((product) => {
  const categoryName = categories.get(product.categoryId);
  const expectedCategory = expectedCategoryByProductId[product.id];

  if (!categoryName) {
    failures.push(`${product.id} ${product.name}: missing category ${product.categoryId}`);
  }

  if (!expectedCategory) {
    failures.push(`${product.id} ${product.name}: missing catalog audit category expectation`);
  } else if (categoryName !== expectedCategory) {
    failures.push(`${product.id} ${product.name}: category is ${categoryName}, expected ${expectedCategory}`);
  }

  if (!product.image || !product.image.startsWith("/file/")) {
    failures.push(`${product.id} ${product.name}: image path must use /file/`);
    return;
  }

  const imagePath = path.join(imageRoot, product.image.replace("/file/", ""));
  if (!fs.existsSync(imagePath)) {
    failures.push(`${product.id} ${product.name}: missing image file ${product.image}`);
    return;
  }

  const dimensions = readDimensions(imagePath);
  if (Math.min(dimensions.width, dimensions.height) < minImageSide) {
    failures.push(
      `${product.id} ${product.name}: image ${product.image} is ${dimensions.width}x${dimensions.height}, expected minimum ${minImageSide}px per side`
    );
  }
});

if (failures.length > 0) {
  console.error("Product catalog quality check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Product catalog quality checks passed (${activeProducts.length} active products).`);
