import styles from './SearchPanel.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal/Modal';
import { useFetch } from '../../hooks/useFetch';
import { searchProducts } from '../../services/productService';

/**
 * Kết quả tìm kiếm theo từ khóa: một dòng trạng thái và danh sách link tới trang chi tiết.
 * Chỉ được render khi có từ khóa, nên useFetch chỉ gọi service khi người dùng đã gõ.
 * Dòng trạng thái (role="status") luôn có mặt và chỉ đổi chữ (đang tải, lỗi, không có
 * kết quả, số kết quả) để screen reader đọc mỗi lần thay đổi.
 * Gõ tiếp thì giữ kết quả cũ tới khi kết quả mới về; kết quả của từ khóa cũ về trễ
 * bị bỏ qua (cờ ignore trong useFetch).
 * @param {object} props
 * @param {string} props.query - từ khóa đã bỏ khoảng trắng hai đầu, không rỗng
 * @param {function(): void} props.onClose - đóng khung tìm kiếm khi bấm một kết quả
 */
function SearchResults({ query, onClose }) {
  const {
    data: products,
    isLoading,
    errorMessage,
  } = useFetch(searchProducts, query);

  let statusText;
  let resultList = null;

  if (isLoading) {
    statusText = 'Loading...';
  } else if (errorMessage) {
    statusText = errorMessage;
  } else if (products.length === 0) {
    statusText = `No products match "${query}".`;
  } else {
    statusText = `${products.length} result(s)`;
    resultList = (
      <ul aria-label="Search results" className={styles.results}>
        {products.map((product) => (
          <li key={product.id}>
            <Link
              to={`/products/${product.id}`}
              onClick={onClose}
              className={styles.resultLink}
            >
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <p role="status" className={styles.status}>
        {statusText}
      </p>
      {resultList}
    </>
  );
}

/**
 * Nội dung của khung tìm kiếm: ô nhập từ khóa và nút đóng.
 * Chỉ được render khi khung đang mở, nên mỗi lần mở là một lần mount mới,
 * ô nhập luôn bắt đầu trống, có từ khóa (sau khi bỏ khoảng trắng) mới hiện kết quả.
 * Ô nhập đứng trước nút đóng để showModal() focus vào ô nhập khi mở.
 * @param {object} props
 * @param {function(): void} props.onClose - đóng khung tìm kiếm
 */
function SearchContent({ onClose }) {
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim();

  return (
    <div className={styles.panel}>
      <h2 id="search-panel-title" className="visually-hidden">
        Search
      </h2>
      <label className="visually-hidden" htmlFor="search-input">
        Search products
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        placeholder="What are you looking for?"
        onChange={(event) => setQuery(event.target.value)}
      />
      {trimmedQuery !== '' && (
        <SearchResults query={trimmedQuery} onClose={onClose} />
      )}
      <button type="button" aria-label="Close" onClick={onClose}>
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

/**
 * Khung tìm kiếm sản phẩm, dựng trên Modal với placement 'aboveNav' (nằm ngay trên BottomNav).
 * Modal luôn được render để đóng đúng cách và trả focus về nút Search;
 * phần nội dung chỉ render khi mở.
 * @param {object} props
 * @param {boolean} props.isOpen - true thì mở khung
 * @param {function(): void} props.onClose - cha đặt isOpen về false khi khung đóng
 */
function SearchPanel({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="search-panel-title"
      placement="aboveNav"
    >
      {isOpen && <SearchContent onClose={onClose} />}
    </Modal>
  );
}

export default SearchPanel;
