import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from '../../context/AuthProvider';
import OrdersProvider from '../../context/OrdersProvider';
import OrderHistoryPage from './OrderHistoryPage';

// Đơn cũ của người đang đăng nhập.
const OLDER_ORDER = {
  id: 1,
  email: 'long@example.com',
  status: 'placed',
  createdAt: '2026-10-01T12:00:00.000Z',
  shipping: {
    firstName: 'Long',
    lastName: 'Nguyen',
    address: '1 Le Loi Street',
    phone: '0912345678',
  },
  items: [
    {
      variantId: 12,
      productId: 3,
      image: '/images/regular-pants/09-black.avif',
      productName: 'Regular Pants',
      colorName: '09 BLACK',
      size: 'M',
      quantity: 2,
      unitPrice: 30,
    },
  ],
  total: 60,
};

// Đơn mới nhất trong storage nhưng thuộc người khác: quên lọc thì nó đứng đầu.
const OTHER_USER_ORDER = {
  ...OLDER_ORDER,
  id: 2,
  email: 'other@example.com',
  createdAt: '2026-11-20T12:00:00.000Z',
};

// Đơn mới của người đang đăng nhập: 2 dòng món nhưng tổng số lượng là 5,
// trạng thái shipped để bắt lỗi viết cứng chữ Placed.
const NEWER_ORDER = {
  ...OLDER_ORDER,
  id: 3,
  status: 'shipped',
  createdAt: '2026-11-10T12:00:00.000Z',
  items: [
    OLDER_ORDER.items[0],
    {
      variantId: 7,
      productId: 5,
      image: '/images/discounted-pants/31-beige.avif',
      productName: 'Discounted Pants',
      colorName: '31 BEIGE',
      size: 'L',
      quantity: 3,
      unitPrice: 40,
    },
  ],
  total: 180,
};

// AuthProvider và OrdersProvider chỉ đọc storage một lần lúc khởi tạo nên phải ghi trước render.
function logIn() {
  localStorage.setItem('user', JSON.stringify({ email: 'long@example.com' }));
}

function storeOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Render trang lịch sử đơn trong router tối thiểu tại /orders.
 * Router không có RequireAuth nên mọi test phải đăng nhập trước khi render.
 */
function renderOrderHistoryPage() {
  const router = createMemoryRouter(
    [{ path: '/orders', element: <OrderHistoryPage /> }],
    { initialEntries: ['/orders'] }
  );
  render(
    <AuthProvider>
      <OrdersProvider>
        <RouterProvider router={router} />
      </OrdersProvider>
    </AuthProvider>
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('OrderHistoryPage', () => {
  it('sets the page title', () => {
    logIn();
    renderOrderHistoryPage();

    expect(document.title).toBe('Order History | UNIQLO');
  });

  it('links the breadcrumb back to the membership page', () => {
    logIn();
    renderOrderHistoryPage();
    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Breadcrumb' })
    );

    expect(
      breadcrumb.getByRole('link', { name: 'MEMBERSHIP' })
    ).toHaveAttribute('href', '/account');
  });
});

describe('OrderHistoryPage empty state', () => {
  it('shows the empty message when there are no orders', () => {
    logIn();
    renderOrderHistoryPage();

    expect(screen.getByText('You have no orders yet.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'CONTINUE SHOPPING' })
    ).toHaveAttribute('href', '/');
  });

  it('shows the empty message when only other users have orders', () => {
    logIn();
    storeOrders([OTHER_USER_ORDER]);
    renderOrderHistoryPage();

    expect(screen.getByText('You have no orders yet.')).toBeInTheDocument();
    expect(
      screen.queryByRole('list', { name: 'Orders' })
    ).not.toBeInTheDocument();
  });
});

describe('OrderHistoryPage orders', () => {
  it('lists only the orders of the user, newest first', () => {
    logIn();
    storeOrders([OLDER_ORDER, OTHER_USER_ORDER, NEWER_ORDER]);
    renderOrderHistoryPage();
    const list = within(screen.getByRole('list', { name: 'Orders' }));

    expect(list.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Order #3',
      'Order #1',
    ]);
  });

  it('shows the number of orders', () => {
    logIn();
    storeOrders([OLDER_ORDER, OTHER_USER_ORDER, NEWER_ORDER]);
    renderOrderHistoryPage();

    expect(screen.getByText('2 order(s)')).toBeInTheDocument();
  });

  it('shows the date, item count, total and status of an order', () => {
    logIn();
    storeOrders([OLDER_ORDER, NEWER_ORDER]);
    renderOrderHistoryPage();
    const [newest] = screen.getAllByRole('listitem');
    const card = within(newest);

    expect(card.getByText('Placed on Nov 10, 2026')).toBeInTheDocument();
    expect(card.getByText('5 item(s)')).toBeInTheDocument();
    expect(card.getByText('$180.00')).toBeInTheDocument();
    expect(card.getByText('Shipped')).toBeInTheDocument();
  });

  it('links each order to its detail page', () => {
    logIn();
    storeOrders([NEWER_ORDER]);
    renderOrderHistoryPage();

    expect(screen.getByRole('link', { name: 'Order #3' })).toHaveAttribute(
      'href',
      '/orders/3'
    );
  });
});
