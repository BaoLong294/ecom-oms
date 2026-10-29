import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import Modal from './Modal.jsx';

// jsdom chưa cài đặt showModal() và close() của <dialog>. Thay tạm bằng hàm giả
// bắt chước phần tối thiểu: bật/tắt thuộc tính open, và close() bắn sự kiện "close"
// giống trình duyệt. Lưu bản gốc để khôi phục sau mỗi test.
const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function () {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

afterEach(() => {
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
  vi.resetAllMocks();
});

// Component chỉ dùng trong test: giữ state isOpen như một component cha thật,
// nút Close nằm bên trong dialog giống các popup sẽ dùng Modal.
function ModalHost() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      labelledBy="modal-title"
    >
      <h2 id="modal-title">Modal title</h2>
      <button type="button" onClick={() => setIsOpen(false)}>
        Close
      </button>
    </Modal>
  );
}

describe('Modal', () => {
  it('opens as a modal dialog named by its title when isOpen is true', () => {
    render(
      <Modal isOpen onClose={vi.fn()} labelledBy="modal-title">
        <h2 id="modal-title">Modal title</h2>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Modal title',
      hidden: true,
    });
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute('open');
  });

  it('stays closed when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} labelledBy="modal-title">
        <h2 id="modal-title">Modal title</h2>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('closes the dialog when the parent sets isOpen to false', async () => {
    const user = userEvent.setup();
    render(<ModalHost />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveAttribute('open');

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('calls onClose when the browser closes the dialog (e.g. Escape)', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen onClose={handleClose} labelledBy="modal-title">
        <h2 id="modal-title">Modal title</h2>
      </Modal>
    );
    const dialog = screen.getByRole('dialog', { hidden: true });

    fireEvent(dialog, new Event('close'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
