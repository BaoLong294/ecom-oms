// Đây là module chứa tổ hợp tất cả các case của sản phẩm theo mỗi size và màu
// import mảng products để có thể duyệt qua từng sản phẩm, sau đó duyệt qua từng màu, từng size để tạo variants
import products from './products';

const DEFAULT_STOCK_QUANTITY = 10;
const variants = [];
let id = 1;

products.forEach((product) => {
  product.colors.forEach((color) => {
    product.sizes.forEach((size) => {
      const variant = {
        id: id++,
        productId: product.id,
        colorCode: color.code,
        size,
        stockQuantity: DEFAULT_STOCK_QUANTITY,
      };

      variants.push(variant);
    });
  });
});

export default variants;
