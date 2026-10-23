import styles from './ProductPage.module.css';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { getProductById } from '../../services/productService';
import StatusMessage from '../../components/StatusMessage/StatusMessage';
import ProductDetails from './ProductDetails';

/**
 * Trang chi tiết sản phẩm: lấy id từ URL (/products/:id) và gọi getProductById qua useFetch.
 * Đang tải hoặc lỗi thì hiện tiêu đề ẩn "Product" kèm StatusMessage; sản phẩm không tồn tại
 * (service trả null) thì hiện tiêu đề "Product not found"; có dữ liệu thì render ProductDetails.
 * Tiêu đề <h1> nằm trong từng nhánh thay vì cố định trong return, vì khi có dữ liệu
 * tên sản phẩm phải nằm trong cột thông tin của ProductDetails.
 */
function ProductPage() {
  const { id } = useParams();

  const {
    data: product,
    isLoading,
    errorMessage,
  } = useFetch(getProductById, Number(id));

  let content;

  if (isLoading) {
    content = (
      <>
        <h1 className="visually-hidden">Product</h1>
        <StatusMessage variant="loading" />
      </>
    );
  } else if (errorMessage) {
    content = (
      <>
        <h1 className="visually-hidden">Product</h1>
        <StatusMessage variant="error" message={errorMessage} />
      </>
    );
  } else if (product === null) {
    content = <h1 className={styles.title}>Product not found</h1>;
  } else {
    content = <ProductDetails product={product} />;
  }

  return <div className={styles.page}>{content}</div>;
}

export default ProductPage;
