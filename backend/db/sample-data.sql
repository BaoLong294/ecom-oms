-- =====================================================================
-- Ecom-OMS – dữ liệu thử (PostgreSQL)
-- Chạy SAU schema.sql, trên cùng database. Dữ liệu lấy từ mock của
-- storefront (frontend-user-web/src/data/), chỉ một phần nhỏ của nhóm
-- cửa hàng và nhóm banner, dùng để kiểm tra ràng buộc và để các truy vấn
-- trong queries.sql có kết quả kiểm chứng được. Seed đầy đủ (id khớp
-- mock) làm ở 6.2–6.3.
--
-- Cột id là GENERATED ALWAYS AS IDENTITY: không ghi id, PostgreSQL cấp
-- 1, 2, 3... theo thứ tự chèn. Comment "id N" bên cạnh mỗi dòng là id
-- dự tính, dùng để điền FK ở các bảng sau.
--
-- Một số dòng cố ý chèn lệch position, để truy vấn quên ORDER BY
-- position sẽ ra sai thứ tự.
-- =====================================================================


-- Cây danh mục: 2 gốc, 1 con, 3 cháu.
INSERT INTO categories (name, position, parent_id, image) VALUES
    ('Men',                     2, NULL, NULL),  -- id 1: chèn trước Women dù position lớn hơn
    ('Women',                   1, NULL, NULL),  -- id 2
    ('Casual Pants Collection', 1, 2,    '/images/product-details/cotton-relaxed-denim/detail-2.avif'),  -- id 3
    ('Knit',                    3, 3,    NULL),  -- id 4: 0 sản phẩm (thử category rỗng); chèn trước Cotton
    ('Cotton',                  1, 3,    NULL),  -- id 5
    ('Flannel',                 2, 3,    NULL);  -- id 6

-- 2 sản phẩm thuộc Cotton, 1 thuộc Flannel; chỉ sản phẩm 2 giảm giá.
INSERT INTO products (name, category_id, gender, price, discount_percent, discount_info) VALUES
    ('Cotton Relaxed Ankle Pants', 5, 'Women',  40, NULL, NULL),    -- id 1
    ('Jersey Easy Cargo Pants',    5, 'Unisex', 40, 20,   'Sale'),  -- id 2
    ('Flannel Pants | Gingham',    6, 'Women',  40, NULL, NULL);    -- id 3

-- Mã màu '09' có ở cả sản phẩm 1 và 2: hợp lệ nhờ khóa ghép
-- (product_id, code). Mã màu là chuỗi, giữ số 0 đầu.
INSERT INTO product_colors (product_id, code, name, swatch, image) VALUES
    (1, '09', '09 Black',     '/images/color-swatches/cotton/09-black.avif',     '/images/product-details/cotton-relaxed/09-black.avif'),
    (1, '30', '30 Natural',   '/images/color-swatches/cotton/30-natural.avif',   '/images/product-details/cotton-relaxed/30-natural.avif'),
    (2, '09', '09 Black',     '/images/color-swatches/cotton/09-black.avif',     '/images/product-details/jersey-easy/09-black.avif'),
    (2, '01', '01 Off White', '/images/color-swatches/cotton/01-off-white.avif', '/images/product-details/jersey-easy/01-off-white.avif'),
    (3, '66', '66 Blue',      '/images/color-swatches/flannel/66-blue.avif',     '/images/product-details/flannel-gingham/66-blue.avif');

-- Ảnh chi tiết; ảnh position 2 của sản phẩm 1 chèn trước ảnh position 1.
INSERT INTO product_images (product_id, image, position) VALUES
    (1, '/images/product-details/cotton-relaxed/detail-2.avif',  2),  -- id 1
    (1, '/images/product-details/cotton-relaxed/detail-1.avif',  1),  -- id 2
    (3, '/images/product-details/flannel-gingham/detail-1.avif', 1);  -- id 3

-- Đặc điểm của sản phẩm 1, cũng chèn lệch position.
INSERT INTO product_features (product_id, image, text, position) VALUES
    (1, '/images/product-details/cotton-relaxed/feature-2.avif', 'Elastic waistband makes for easy outfit changes. Versatile relaxed silhouette.', 2),  -- id 1
    (1, '/images/product-details/cotton-relaxed/feature-1.avif', 'Made from soft and comfortable 100% cotton.', 1);  -- id 2

-- Đủ 6 size của mock, chèn lộn xộn: sắp theo code (chữ cái) sẽ ra
-- L, M, S, XL, XS, XXL; sắp theo position mới ra XS → XXL.
INSERT INTO sizes (code, position) VALUES
    ('M',   3),
    ('XS',  1),
    ('XXL', 6),
    ('S',   2),
    ('L',   4),
    ('XL',  5);

-- Mỗi dòng là một tổ hợp (sản phẩm, màu, size) có thật trong
-- product_colors và sizes. Tồn kho 0, 2, 3, 4 nằm quanh ngưỡng
-- "sắp hết hàng" (<= 3) của queries.sql: viết nhầm < thay vì <= là
-- ra sai số dòng.
INSERT INTO variants (product_id, color_code, size_code, stock_quantity) VALUES
    (1, '09', 'S',  15),  -- id 1
    (1, '09', 'M',  3),   -- id 2: đúng ngưỡng
    (1, '30', 'M',  0),   -- id 3: hết hàng
    (2, '09', 'M',  2),   -- id 4
    (2, '01', 'L',  15),  -- id 5
    (2, '01', 'XL', 8),   -- id 6
    (3, '66', 'M',  4),   -- id 7: ngay trên ngưỡng
    (3, '66', 'L',  0);   -- id 8: hết hàng

-- ---------------------------------------------------------------------
-- NHÓM BANNER (Phần 3)
-- category_id dùng id của dữ liệu thử ở trên: Men 1, Women 2,
-- Casual Pants 3, Knit 4, Cotton 5, Flannel 6.
-- ---------------------------------------------------------------------

-- 2 banner landing của Women chèn lệch position (banner position 2 chèn
-- trước), 1 banner của Men để thử lọc theo category gốc. Banner 1 không
-- có subtitle và không giảm giá; banner 2, 3 có đủ.
INSERT INTO landing_banners (
  category_id,
  target_category_id,
  position,
  title,
  subtitle,
  description,
  price,
  discount_percent,
  discount_info,
  text_color,
  image,
  alt
)
VALUES
  (
    2,
    4,
    2,
    'Knit Collection',
    NULL,
    'Explore our lineup of comfy sweaters and cardigans, perfect for effortless layering.',
    50,
    NULL,
    NULL,
    'light',
    '/images/banners/women/women-knit-collection.jpg',
    'Smiling young woman standing in front of a brick building and a black fence, wearing a dark brown knitted cardigan, white turtleneck, and casual trousers.'
  ), -- id 1: Women, position 2, chèn trước banner position 1
  (
    2,
    3,
    1,
    'Casual Pants Collection',
    'Easy Stretch Pants | Jersey Fabric',
    'Comfortable by your side no matter where you are.',
    60,
    50,
    'Online + App-Only Offer',
    'light',
    '/images/banners/women/women-casual-pants.jpg',
    'Smiling woman walking outdoors wearing casual gray knit wide-leg pants and a white long-sleeve top while carrying flowers.'
  ), -- id 2: Women, position 1
  (
    1,
    6,
    1,
    'Bottoms Collection',
    'Smart Ankle Pants | 2WAY Stretch',
    'Sharp enough for the office, easy enough for the commute home.',
    50,
    20,
    'Limited Offer until 10/31',
    'dark',
    '/images/banners/men/men-bottoms-collection.jpg',
    'Man walking through a bright glass-walled lobby in a charcoal gray suit, rust-brown sweater, and light blue shirt, carrying a black bag.'
  ); -- id 3: Men; đích thật là Bottoms (không có trong dữ liệu thử), trỏ tạm Flannel

-- Knit có 2 ảnh banner (carousel) chèn lệch position, Cotton có 1 ảnh.
INSERT INTO category_banners (category_id, position, image, alt)
VALUES
  (
    5,
    1,
    '/images/all-products/women/casual-pants/cotton/cotton-banner.jpg',
    'Smiling woman stepping out of a café in a navy short-sleeve knit polo and beige relaxed cotton pants, holding an iced coffee and a brown bag.'
  ), -- id 1: Cotton
  (
    4,
    2,
    '/images/all-products/women/casual-pants/knit/knit-banner-2.avif',
    'Woman standing by an open car door in a lilac hooded jacket, pink T-shirt, and beige cable knit wide-leg pants.'
  ), -- id 2: Knit, position 2, chèn trước ảnh position 1
  (
    4,
    1,
    '/images/all-products/women/casual-pants/knit/knit-banner-1.avif',
    'Smiling woman on a seaside boardwalk in a beige cap, an open blue shirt over a navy top, and cream ribbed knit wide-leg pants with a drawstring.'
  ); -- id 3: Knit, position 1