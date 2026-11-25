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

-- 7. Banner landing của một category gốc (Women, id 2), theo thứ tự hiển thị.
--    Dùng cho: GET /api/landing-banners?categoryId=2
--    Mong đợi: banner 2 (Casual Pants Collection) rồi 1 (Knit Collection);
--    không có banner 3 của Men.
SELECT
  id,
  target_category_id,
  title,
  subtitle,
  description,
  price,
  discount_percent,
  discount_info,
  text_color,
  image,
  alt
FROM landing_banners
WHERE category_id = 2
ORDER BY position, id;

-- 8. Ảnh banner của một nhóm (Knit, id 4) cho carousel trên trang danh sách.
--    Dùng cho: GET /api/categories/:id/listing (banners của từng nhóm)
--    Mong đợi: ảnh 3 (knit-banner-1) rồi 2 (knit-banner-2).
--    Cotton (id 5) → ảnh 1; Flannel (id 6) → 0 dòng.
SELECT id, image, alt
FROM category_banners
WHERE category_id = 4
ORDER BY position, id;

-- 9. Mọi banner landing kèm tên category của landing và của đích (admin).
--    Dùng cho: trang quản lý banner của Admin Dashboard (Giai đoạn 7)
--    Mong đợi: banner 2, 1 (Women, theo position) rồi 3 (Men).
--    JOIN categories 2 lần vì 2 FK trỏ tới 2 dòng khác nhau của bảng này.
SELECT 
  lb.id, 
  lb.title, 
  lc.name AS landing_name,
  tc.name AS target_name
FROM landing_banners AS lb
JOIN categories AS lc ON lb.category_id = lc.id
JOIN categories AS tc ON lb.target_category_id = tc.id
ORDER BY lc.position, lc.id, lb.position, lb.id;

-- 10. Giỏ hàng của một user (id 1), kèm giá sau giảm và thành tiền từng món.
--     Dùng cho: trang Cart (6.4: giỏ hàng gắn với user trong JWT)
--     Mong đợi: variant 2 (2 × 40.00 = 80.00) rồi 4 (1 × 32.00 = 32.00);
--     không có dòng của user 4. Giá sau giảm dùng COALESCE vì
--     discount_percent NULL khi không giảm.
SELECT 
  ci.variant_id,
  p.name AS product_name,
  v.size_code,
  ci.quantity,
  ROUND(p.price * (100 - COALESCE(p.discount_percent, 0)) / 100, 2) AS unit_price,
  ROUND(p.price * (100 - COALESCE(p.discount_percent, 0)) / 100, 2) * ci.quantity AS line_total
FROM cart_items AS ci
JOIN variants AS v ON ci.variant_id = v.id
JOIN products AS p ON v.product_id = p.id
WHERE ci.user_id = 1
ORDER BY ci.created_at, ci.variant_id;

-- 11. Wishlist của một user (id 1), món mới lưu lên đầu.
--     Dùng cho: trang Wishlist (6.4: wishlist gắn với user trong JWT)
--     Mong đợi: variant 8, 5, 1 (created_at giảm dần); không có dòng
--     của user 4. Tên màu JOIN product_colors theo cả cặp (product_id, code).
SELECT
  wi.variant_id,
  p.name AS product_name,
  pc.name AS color_name,
  v.size_code,
  wi.created_at
FROM wishlist_items AS wi
JOIN variants AS v ON wi.variant_id = v.id
JOIN products AS p ON v.product_id = p.id
JOIN product_colors AS pc ON v.product_id = pc.product_id AND v.color_code = pc.code
WHERE wi.user_id = 1
ORDER BY wi.created_at DESC, wi.variant_id;

-- 12. Lịch sử đơn của một user (id 1), đơn mới nhất trước.
--     Dùng cho: GET /api/orders (6.4: chỉ đơn của user trong JWT)
--     Mong đợi: đơn 1, 4, 2 (created_at giảm dần, có cả đơn đã hủy);
--     không có đơn 3, 5 của user 4.
SELECT 
  id, 
  status, 
  total, 
  created_at
FROM orders
WHERE user_id = 1
ORDER BY created_at DESC, id;

-- 13. Chi tiết một đơn (id 2), chỉ khi đơn thuộc user đang xem (id 1).
--     Dùng cho: GET /api/orders/:id (6.4: WHERE o.id = $1 AND o.user_id = $2)
--     Mong đợi: 1 dòng, giá 35.00 (bản chụp, không phải giá hiện tại 40.00).
--     Đơn 3 với user 1 → 0 dòng: không phải chủ thì giống như không tồn tại.
SELECT 
  o.id, 
  o.status, 
  o.total, 
  i.product_name,
  i.color_name,
  i.size,
  i.quantity,
  i.unit_price
FROM orders AS o
JOIN order_items AS i ON o.id = i.order_id
WHERE o.id = 2 AND o.user_id = 1
ORDER BY i.id;

-- 14. Số đơn theo trạng thái (tổng quan cho admin).
--     Dùng cho: trang Dashboard của Admin (Giai đoạn 7)
--     Mong đợi: placed 2, rồi cancelled, delivered, shipped mỗi trạng thái 1.
--     Không có dòng confirmed: GROUP BY chỉ tạo nhóm từ giá trị có trong bảng.
SELECT
  status,
  COUNT(*) AS order_count
FROM orders
GROUP BY status
ORDER BY order_count DESC, status;

-- 15. Sản phẩm bán chạy: tổng số lượng đã bán, không tính đơn đã hủy.
--     Dùng cho: trang Dashboard của Admin (Giai đoạn 7)
--     Mong đợi: sản phẩm 1 bán 4, sản phẩm 2 bán 3.
--     Tính cả đơn hủy thì ra 4 – 4: lọc status bằng WHERE trước GROUP BY.
SELECT
  p.id,
  p.name,
  SUM(i.quantity) AS total_sold
FROM order_items AS i
JOIN orders AS o ON i.order_id = o.id
JOIN products AS p ON i.product_id = p.id
WHERE o.status <> 'cancelled'
GROUP BY p.id, p.name
ORDER BY total_sold DESC, p.id;