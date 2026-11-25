-- =====================================================================
-- Ecom-OMS – database schema (PostgreSQL)
-- Đủ 15 bảng của 4 nhóm: cửa hàng (catalog), banner, người dùng và đơn
-- hàng (Phần 2–5). Sơ đồ quan hệ: docs/erd.md.
-- =====================================================================


-- ---------------------------------------------------------------------
-- XÓA BẢNG CŨ
-- Thứ tự ngược với thứ tự tạo: bảng trỏ đến bị xóa trước bảng được trỏ
-- tới, để không xóa một bảng khi bảng khác còn FK trỏ vào nó.
-- IF EXISTS để lần chạy đầu (chưa có bảng nào) không báo lỗi; nhờ phần
-- này file chạy lại bao nhiêu lần cũng được.
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS shippers;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS users;
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

-- ---------------------------------------------------------------------
-- NHÓM NGƯỜI DÙNG (Phần 4)
-- Thay cho user, cart, wishlist trong localStorage của storefront.
-- ---------------------------------------------------------------------

-- Tài khoản của mọi người dùng: khách hàng, admin, shipper.
-- Không lưu mật khẩu nguyên văn, chỉ lưu hash một chiều (tạo ở 6.3).
-- UNIQUE của email phân biệt hoa thường: API phải lưu email chữ thường.
CREATE TABLE users (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR(254) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    -- Khách tự đăng ký là customer; tài khoản shipper do admin tạo.
    role          VARCHAR(10) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'shipper')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Giỏ hàng: mỗi dòng là một variant trong giỏ của một user.
-- PK ghép (user_id, variant_id): mỗi cặp chỉ một dòng, thêm trùng thì
-- cộng quantity (như cartReducer). Không có id vì không bảng nào trỏ tới.
CREATE TABLE cart_items (
    user_id    INT NOT NULL REFERENCES users(id),
    variant_id INT NOT NULL REFERENCES variants(id),
    -- Số lượng về 0 thì xóa dòng, không lưu 0.
    quantity   INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, variant_id)
);

-- Wishlist: mỗi dòng là một variant được user lưu lại.
-- created_at để sắp món mới lưu lên đầu (database không giữ thứ tự chèn).
CREATE TABLE wishlist_items (
    user_id    INT NOT NULL REFERENCES users(id),
    variant_id INT NOT NULL REFERENCES variants(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, variant_id)
);

-- ---------------------------------------------------------------------
-- NHÓM ĐƠN HÀNG (Phần 5)
-- Thay cho đơn hàng trong localStorage (OrdersContext) của storefront.
-- ---------------------------------------------------------------------

-- Hồ sơ của user có vai trò shipper; tài khoản đăng nhập nằm ở users.
-- user_id UNIQUE: mỗi user có không hoặc một hồ sơ shipper (1:1).
CREATE TABLE shippers (
    id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id),
    name    VARCHAR(100) NOT NULL,
    phone   VARCHAR(15) NOT NULL
);

-- Một đơn hàng. Thông tin người nhận chụp lại vào chính đơn (quan hệ 1:1
-- luôn có nên gộp vào bảng), không trỏ tới sổ địa chỉ.
-- user_id, shipper_id giữ mặc định (từ chối xóa): không xóa được user hay
-- shipper còn đơn, để lịch sử đơn không bị mất.
CREATE TABLE orders (
    id                  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id             INT NOT NULL REFERENCES users(id),
    -- NULL khi chưa gán shipper.
    shipper_id          INT REFERENCES shippers(id),
    -- Đơn mới luôn bắt đầu ở placed.
    status              VARCHAR(10) NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    shipping_first_name VARCHAR(100) NOT NULL,
    shipping_last_name  VARCHAR(100) NOT NULL,
    shipping_address    TEXT NOT NULL,
    shipping_phone      VARCHAR(15) NOT NULL,
    total               NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Đơn đang giao hoặc đã giao phải có shipper ("nếu B thì A").
    CHECK (status IN ('placed', 'confirmed', 'cancelled') OR shipper_id IS NOT NULL)
);

-- Các món trong đơn. Tên, màu, size, ảnh, giá đơn vị là bản chụp lúc đặt
-- hàng (không có REFERENCES): giá hay tên sản phẩm đổi sau này không làm
-- sai đơn cũ.
-- Giữ id riêng vì variant_id có thể thành NULL (cột PK không được NULL).
CREATE TABLE order_items (
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Xóa đơn thì xóa luôn các món của đơn.
    order_id     INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    -- Sản phẩm bị xóa thì món vẫn còn (đọc từ bản chụp), chỉ mất liên kết.
    variant_id   INT REFERENCES variants(id) ON DELETE SET NULL,
    product_id   INT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(100) NOT NULL,
    color_name   VARCHAR(100) NOT NULL,
    size         VARCHAR(3) NOT NULL,
    image        TEXT NOT NULL,
    quantity     INT NOT NULL CHECK (quantity > 0),
    unit_price   NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0)
);