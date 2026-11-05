/**
 * Bảng category của cửa hàng (mock của bảng `categories` tương lai).
 * Cây theo `parentId`: `null` là category gốc (Women, Men, Kids, Baby), category con
 * trỏ tới id của cha. `position` là thứ tự giữa các category cùng cha.
 * `image` là ảnh hiển thị trong mega-menu: ảnh chỉ có sản phẩm trên nền xám (packshot),
 * lấy từ `detailImages` của một sản phẩm tiêu biểu trong category; `null` khi category
 * chưa có sản phẩm.
 * Id 5-24 là đích của banner landing (`targetCategoryId`).`
 * @type {{ id: number, name: string, position: number, parentId: number | null, image: string | null }[]}
 */
const categories = [
  /* ===== ROOT ===== */
  { id: 1, name: 'Women', position: 1, parentId: null, image: null },
  { id: 2, name: 'Men', position: 2, parentId: null, image: null },
  { id: 3, name: 'Kids', position: 3, parentId: null, image: null },
  { id: 4, name: 'Baby', position: 4, parentId: null, image: null },

  /* ===== WOMEN ===== */
  {
    id: 5,
    name: 'Casual Pants Collection',
    position: 1,
    parentId: 1,
    image: '/images/product-details/cotton-relaxed-denim/detail-2.avif',
  },
  { id: 6, name: 'Knit Collection', position: 2, parentId: 1, image: null },
  {
    id: 7,
    name: 'Outerwear Collection',
    position: 3,
    parentId: 1,
    image: null,
  },
  {
    id: 8,
    name: 'Shirts & Blouses Collection',
    position: 4,
    parentId: 1,
    image: null,
  },
  { id: 9, name: 'T-shirt Collection', position: 5, parentId: 1, image: null },
  { id: 30, name: 'Dresses Collection', position: 6, parentId: 1, image: null },
  {
    id: 31,
    name: 'Short & Culottes Collection',
    position: 7,
    parentId: 1,
    image: null,
  },
  {
    id: 32,
    name: 'Loungewear Collection',
    position: 8,
    parentId: 1,
    image: null,
  },
  {
    id: 33,
    name: 'Accessories Collection',
    position: 9,
    parentId: 1,
    image: null,
  },
  {
    id: 34,
    name: 'Maternity Collection',
    position: 10,
    parentId: 1,
    image: null,
  },

  /* ===== MEN ===== */
  { id: 10, name: 'Bottoms Collection', position: 1, parentId: 2, image: null },
  { id: 11, name: 'Knit Collection', position: 2, parentId: 2, image: null },
  {
    id: 12,
    name: 'Outerwear Collection',
    position: 3,
    parentId: 2,
    image: null,
  },
  { id: 13, name: 'Shirts Collection', position: 4, parentId: 2, image: null },
  { id: 14, name: 'T-shirt Collection', position: 5, parentId: 2, image: null },
  { id: 35, name: 'Fleece Collection', position: 6, parentId: 2, image: null },
  {
    id: 36,
    name: 'Short & Jorts Collection',
    position: 7,
    parentId: 2,
    image: null,
  },
  {
    id: 37,
    name: 'Innerwear & Underwear Collection',
    position: 8,
    parentId: 2,
    image: null,
  },
  {
    id: 38,
    name: 'Loungewear Collection',
    position: 9,
    parentId: 2,
    image: null,
  },
  {
    id: 39,
    name: 'Accessories Collection',
    position: 10,
    parentId: 2,
    image: null,
  },

  /* ===== KIDS ===== */
  { id: 15, name: 'Girls Collection', position: 1, parentId: 3, image: null },
  {
    id: 16,
    name: 'Boys & Unisex Collection',
    position: 2,
    parentId: 3,
    image: null,
  },
  {
    id: 17,
    name: 'Outerwear Collection',
    position: 3,
    parentId: 3,
    image: null,
  },
  { id: 18, name: 'T-shirt Collection', position: 4, parentId: 3, image: null },
  {
    id: 19,
    name: 'Knitwear Collection',
    position: 5,
    parentId: 3,
    image: null,
  },
  { id: 40, name: 'Bottom Collection', position: 6, parentId: 3, image: null },
  { id: 41, name: 'Short Collection', position: 7, parentId: 3, image: null },
  {
    id: 42,
    name: 'Dresses & Skorts Collection',
    position: 8,
    parentId: 3,
    image: null,
  },
  {
    id: 43,
    name: 'Innerwear & Underwear Collection',
    position: 9,
    parentId: 3,
    image: null,
  },
  {
    id: 44,
    name: 'Accessories Collection',
    position: 10,
    parentId: 3,
    image: null,
  },

  /* ===== BABY ===== */
  { id: 20, name: 'Newborn Collection', position: 1, parentId: 4, image: null },
  {
    id: 21,
    name: 'Bodysuit Collection',
    position: 2,
    parentId: 4,
    image: null,
  },
  {
    id: 22,
    name: 'One Piece Collection',
    position: 3,
    parentId: 4,
    image: null,
  },
  {
    id: 23,
    name: 'Short & Leggings Collection',
    position: 4,
    parentId: 4,
    image: null,
  },
  { id: 24, name: 'Toddler Collection', position: 5, parentId: 4, image: null },
  {
    id: 45,
    name: 'T-shirts Collection',
    position: 6,
    parentId: 4,
    image: null,
  },
  {
    id: 46,
    name: 'Loungewear pajamas Collection',
    position: 7,
    parentId: 4,
    image: null,
  },
  {
    id: 47,
    name: 'Maternity Collection',
    position: 8,
    parentId: 4,
    image: null,
  },

  /* ===== WOMEN > CASUAL PANTS COLLECTION ===== */
  { id: 25, name: 'Cotton', position: 1, parentId: 5, image: null },
  { id: 26, name: 'Flannel', position: 2, parentId: 5, image: null },
  { id: 27, name: 'Knit', position: 3, parentId: 5, image: null },
  { id: 28, name: 'Sweat', position: 4, parentId: 5, image: null },
  { id: 29, name: 'Others', position: 5, parentId: 5, image: null },
];

export default categories;
