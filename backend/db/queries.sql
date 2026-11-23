-- 1. Sản phẩm thuộc một category (Cotton, id 5), cho lưới sản phẩm.
--    Dùng cho: GET /api/categories/:id/listing
--    Mong đợi: id 1, 2. Đổi thành category 4 (Knit) → 0 dòng.
SELECT id, name, price, discount_percent 
FROM products 
WHERE category_id = 5 
ORDER BY id;

-- 2. Tìm sản phẩm theo tên, không phân biệt hoa thường (ô tìm kiếm).
--    Dùng cho: GET /api/products?search=
--    Mong đợi: 'CARGO' → id 2. Đổi thành 'pants' → id 1, 3, 2 (theo tên).
SELECT id, name
FROM products
WHERE name ILIKE '%CARGO%'
ORDER BY name;

-- 3. Variant sắp hết hàng (tồn <= 3, kể cả hết), gấp nhất lên đầu.
--    Dùng cho: trang tồn kho của Admin Dashboard (Giai đoạn 7)
--    Mong đợi: variant 3, 8 (tồn 0), 4 (tồn 2), 2 (tồn 3); không có 7 (tồn 4).
SELECT v.id, p.name, v.color_code, v.size_code, v.stock_quantity
FROM variants AS v 
JOIN products AS p ON v.product_id = p.id
WHERE v.stock_quantity <= 3
ORDER BY v.stock_quantity, v.id;

-- 4. Thông tin hiển thị của các variant theo danh sách id (giỏ hàng, wishlist).
--    Dùng cho: GET /api/variants?ids=2,5,8
--    Mong đợi: 3 dòng (variant 2, 5, 8). JOIN product_colors theo cả cặp
--    (product_id, code); thiếu product_id thì variant 2 bị nhân đôi vì màu 09
--    có ở 2 sản phẩm.
SELECT
  v.id,
  v.size_code,
  v.stock_quantity,
  p.name AS product_name,
  p.price,
  p.discount_percent,
  pc.name AS color_name,
  pc.image AS color_image
FROM variants AS v
JOIN products AS p ON v.product_id = p.id
JOIN product_colors AS pc
  ON v.product_id = pc.product_id
  AND v.color_code = pc.code
WHERE v.id IN (2, 5, 8)
ORDER BY v.id;

-- 5. Một sản phẩm kèm các variant (trang chi tiết sản phẩm).
--    Dùng cho: GET /api/products/:id
--    Mong đợi: sản phẩm 1, 3 dòng: variant 1 (09, S), 2 (09, M), 3 (30, M).
--    Size sắp theo sizes.position (S trước M), không theo chữ cái.
SELECT
  p.id,
  p.name,
  p.price,
  v.id AS variant_id,
  v.color_code,
  v.size_code,
  v.stock_quantity
FROM products AS p
JOIN variants AS v ON p.id = v.product_id
JOIN sizes AS s ON v.size_code = s.code
WHERE p.id = 1
ORDER BY v.color_code, s.position;

-- 6. Menu: mỗi category gốc kèm các category con trực tiếp.
--    Dùng cho: GET /api/categories/menu
--    Mong đợi: 2 dòng, Women trước Men (theo position, không theo id):
--    Women – Casual Pants Collection; Men – NULL (LEFT JOIN giữ gốc chưa có con).
SELECT
  r.id AS root_id,
  r.name AS root_name,
  c.id AS child_id,
  c.name AS child_name
FROM categories AS r
LEFT JOIN categories AS c ON r.id = c.parent_id
WHERE r.parent_id IS NULL
ORDER BY r.position, r.id, c.position, c.id;