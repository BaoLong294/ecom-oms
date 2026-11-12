/**
 * Một category gốc có landing riêng.
 * @typedef {object} LandingCategory
 * @property {string} slug - phần chữ trên URL
 * @property {string} name - tên hiển thị
 * @property {number} categoryId - id của category gốc trong dữ liệu
 */

/**
 * 4 category gốc có landing riêng, theo thứ tự hiển thị trên menu header.
 * Là nguồn chung cho route ('/{slug}'), menu header và tiêu đề trang của HomePage.
 * slug là phần chữ trên URL; name là tên hiển thị (menu và <h1> viết hoa bằng toUpperCase());
 * categoryId là id của category gốc trong dữ liệu, dùng để lấy banner landing.
 * @type {LandingCategory[]}
 */
export const LANDING_CATEGORIES = [
  { slug: 'women', name: 'Women', categoryId: 1 },
  { slug: 'men', name: 'Men', categoryId: 2 },
  { slug: 'kids', name: 'Kids', categoryId: 3 },
  { slug: 'baby', name: 'Baby', categoryId: 4 },
];
