import styles from './SearchPanel.module.css';
import { useState } from 'react';
import Modal from '../Modal/Modal';

/**
 * Nội dung của khung tìm kiếm: ô nhập từ khóa và nút đóng.
 * Chỉ được render khi khung đang mở, nên mỗi lần mở là một lần mount mới
 * và ô nhập luôn bắt đầu trống.
 * Ô nhập đứng trước nút đóng để showModal() focus vào ô nhập khi mở.
 * @param {object} props
 * @param {function(): void} props.onClose - đóng khung tìm kiếm
 */
function SearchContent({ onClose }) {
  const [query, setQuery] = useState('');

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
