-- =====================================================================
-- Ecom-OMS – database schema (PostgreSQL)
-- Phần 2–3: nhóm cửa hàng (catalog) và nhóm banner. Các nhóm người dùng,
-- đơn hàng được thêm ở Phần 4–5. Sơ đồ quan hệ: docs/erd.md.
-- =====================================================================


-- ---------------------------------------------------------------------
-- XÓA BẢNG CŨ
-- Thứ tự ngược với thứ tự tạo: bảng trỏ đến bị xóa trước bảng được trỏ
-- tới, để không xóa một bảng khi bảng khác còn FK trỏ vào nó.
-- IF EXISTS để lần chạy đầu (chưa có bảng nào) không báo lỗi; nhờ phần
-- này file chạy lại bao nhiêu lần cũng được.
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS category_banners;
DROP TABLE IF EXISTS landing_banners;
DROP TABLE IF EXISTS variants;
DROP TABLE IF EXISTS sizes;
DROP TABLE IF EXISTS product_features;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_colors;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;


-- ---------------------------------------------------------------------
-- TẠO BẢNG
-- Theo thứ tự phụ thuộc: bảng được trỏ tới phải có trước bảng trỏ đến.
-- ---------------------------------------------------------------------

-- Cây danh mục. Gốc (Women, Men, Kids, Baby) có parent_id NULL.
-- Không UNIQUE (parent_id, position): UNIQUE coi các NULL là khác nhau
-- nên không chặn được các gốc trùng position; truy vấn sắp theo
-- position, id để thứ tự luôn xác định.
CREATE TABLE categories (
    id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    position  INT NOT NULL CHECK (position > 0),
    parent_id INT REFERENCES categories(id),
    image     TEXT                       -- ảnh packshot, NULL khi chưa có
);

-- Sản phẩm, chỉ gồm các cột đơn. Màu, ảnh chi tiết, đặc điểm và size
-- nằm ở các bảng riêng bên dưới (một ô một giá trị).
CREATE TABLE products (
    id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    category_id      INT NOT NULL REFERENCES categories(id),
    gender           VARCHAR(10) NOT NULL
                     CHECK (gender IN ('Women', 'Men', 'Unisex', 'Kids', 'Baby')),
    price            NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    -- NULL nghĩa là không giảm giá (CHECK không chặn NULL).
    discount_percent INT CHECK (discount_percent BETWEEN 1 AND 99),
    discount_info    TEXT,
    -- Ràng buộc 2 cột nên đặt ở cấp bảng: có chữ khuyến mãi thì phải có
    -- phần trăm giảm giá ("nếu B thì A" viết thành A OR NOT B).
    CHECK (discount_percent IS NOT NULL OR discount_info IS NULL)
);

-- Màu của từng sản phẩm. Mã màu lặp lại giữa các sản phẩm (09 BLACK có
-- ở nhiều sản phẩm) nên khóa là cặp (product_id, code); variants trỏ tới
-- màu bằng đúng cặp này.
CREATE TABLE product_colors (
    product_id INT NOT NULL REFERENCES products(id),
    code       VARCHAR(3) NOT NULL,
    name       VARCHAR(100) NOT NULL,
    swatch     TEXT NOT NULL,           -- ảnh ô màu nhỏ
    image      TEXT NOT NULL,           -- ảnh sản phẩm ở màu này
    PRIMARY KEY (product_id, code)
);

-- Ảnh chi tiết của sản phẩm; position giữ thứ tự của mảng detailImages
-- trong mock (thứ tự dòng trong bảng không được bảo đảm).
CREATE TABLE product_images (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    image      TEXT NOT NULL,
    position   INT NOT NULL CHECK (position > 0)
);

-- Đặc điểm của sản phẩm (ảnh + chữ), thứ tự theo position.
CREATE TABLE product_features (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    image      TEXT NOT NULL,
    text       TEXT NOT NULL,
    position   INT NOT NULL CHECK (position > 0)
);

-- Bảng tra cứu size dùng chung. Mã size (XS, S, M...) đã duy nhất và hầu
-- như không đổi nên dùng thẳng làm PK; position cho thứ tự XS → XXL.
CREATE TABLE sizes (
    code     VARCHAR(3) PRIMARY KEY,
    position INT NOT NULL CHECK (position > 0)
);

-- Mỗi tổ hợp màu × size của một sản phẩm: đơn vị được nhập kho và bán.
-- Giữ id riêng vì cart_items, wishlist_items, order_items trỏ tới bằng
-- variant_id (một số gọn hơn bộ 3 cột).
CREATE TABLE variants (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id     INT NOT NULL REFERENCES products(id),
    color_code     VARCHAR(3) NOT NULL,
    size_code      VARCHAR(3) NOT NULL REFERENCES sizes(code),
    -- Hết hàng là 0, không phải NULL.
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    -- FK ghép: màu phải là màu của chính sản phẩm này, nên variant không
    -- thể trỏ nhầm sang màu của sản phẩm khác.
    FOREIGN KEY (product_id, color_code) REFERENCES product_colors(product_id, code),
    -- Cùng sản phẩm, màu, size là cùng một món hàng: chỉ được một dòng.
    UNIQUE (product_id, color_code, size_code)
);

-- ---------------------------------------------------------------------
-- NHÓM BANNER (Phần 3)
-- Chỉ trỏ vào categories nên đặt sau nhóm cửa hàng.
-- ---------------------------------------------------------------------

-- Banner lớn trên trang landing của một category gốc (Women, Men...).
-- Có 2 FK cùng trỏ categories: category_id là landing chứa banner,
-- target_category_id là category mà bấm banner sẽ dẫn tới.
-- "category_id phải là gốc" không kiểm tra được bằng CHECK (CHECK chỉ
-- nhìn các cột trong cùng một dòng); seed và API đảm bảo quy tắc này.
-- Giá và giảm giá dùng cùng ràng buộc với products.
CREATE TABLE landing_banners (
    id                 INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id        INT NOT NULL REFERENCES categories(id),
    target_category_id INT NOT NULL REFERENCES categories(id),
    position           INT NOT NULL CHECK (position > 0),
    title              VARCHAR(100) NOT NULL,
    subtitle           VARCHAR(100),
    description        TEXT NOT NULL,
    price              NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    discount_percent   INT CHECK (discount_percent BETWEEN 1 AND 99),
    discount_info      TEXT,
    -- Chữ trên ảnh sáng hay tối, do người làm nội dung chọn theo ảnh.
    text_color         VARCHAR(5) NOT NULL CHECK (text_color IN ('light', 'dark')),
    image              TEXT NOT NULL,
    alt                TEXT NOT NULL,
    -- Có chữ khuyến mãi thì phải có phần trăm giảm giá (như products).
    CHECK (discount_percent IS NOT NULL OR discount_info IS NULL)
);

-- Ảnh banner của một nhóm trên trang danh sách (dải carousel phía trên
-- lưới sản phẩm); một category có thể có nhiều ảnh, thứ tự theo position.
CREATE TABLE category_banners (
    id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id),
    position    INT NOT NULL CHECK (position > 0),
    image       TEXT NOT NULL,
    alt         TEXT NOT NULL
);