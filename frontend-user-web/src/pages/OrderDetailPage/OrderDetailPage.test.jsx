import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AuthProvider from '../../context/AuthProvider';
import OrdersProvider from '../../context/OrdersProvider';
import OrderDetailPage from './OrderDetailPage';

// Đơn của người khác: vào /orders/2 phải ra not found.
const OTHER_USER_ORDER = {
  id: 2,
  email: 'other@example.com',
  status: 'placed',
  createdAt: '2026-11-05T12:00:00.000Z',
  shipping: {
    firstName: 'An',
    lastName: 'Tran',
    address: '9 Hai Ba Trung Street',
    phone: '0987654321',
  },
  items: [
    {
      variantId: 12,
      productId: 3,
      image: '/images/regular-pants/09-black.avif',
      productName: 'Regular Pants',
      colorName: '09 BLACK',
      size: 'M',
      quantity: 1,
      unitPrice: 30,
    },
  ],
  total: 30,
};

// Đơn đang xem: 2 món có productId khác nhau, tổng số lượng 5, tổng tiền 180.
const ORDER = {
  id: 3,
  email: 'long@example.com',
  status: 'placed',
  createdAt: '2026-11-10T12:00:00.000Z',
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
  localStorage.setItem('orders', JSON.stringify([OTHER_USER_ORDER, ORDER]));
}

/**
 * Render trang chi tiết đơn trong router tối thiểu tại /orders/:id.
 * Router không có RequireAuth nên mọi test phải đăng nhập trước khi render.
 * @param {string} entry - URL mở trang, ví dụ '/orders/3'
 */
function renderOrderDetailPage(entry) {
  const router = createMemoryRouter(
    [{ path: '/orders/:id', element: <OrderDetailPage /> }],
    { initialEntries: [entry] }
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

describe('OrderDetailPage not found', () => {
  it('shows not found for an order that does not exist', () => {
    logIn();
    renderOrderDetailPage('/orders/99');

    expect(document.title).toBe('Order not found | UNIQLO');
    expect(
      screen.getByRole('heading', { level: 1, name: 'ORDER NOT FOUND' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'BACK TO ORDER HISTORY' })
    ).toHaveAttribute('href', '/orders');
  });

  it('shows not found for an order of another user', () => {
    logIn();
    renderOrderDetailPage('/orders/2');

    expect(
      screen.getByRole('heading', { level: 1, name: 'ORDER NOT FOUND' })
    ).toBeInTheDocument();
  });

  it('shows not found for an id that is not a number', () => {
    logIn();
    renderOrderDetailPage('/orders/abc');

    expect(
      screen.getByRole('heading', { level: 1, name: 'ORDER NOT FOUND' })
    ).toBeInTheDocument();
  });
});

describe('OrderDetailPage', () => {
  it('sets the title, heading and breadcrumb of the order', () => {
    logIn();
    renderOrderDetailPage('/orders/3');
    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Breadcrumb' })
    );

    expect(document.title).toBe('Order #3 | UNIQLO');
    expect(
      screen.getByRole('heading', { level: 1, name: 'ORDER #3' })
    ).toBeInTheDocument();
    expect(
      breadcrumb.getByRole('link', { name: 'ORDER HISTORY' })
    ).toHaveAttribute('href', '/orders');
  });

  it('shows the order date', () => {
    logIn();
    renderOrderDetailPage('/orders/3');

    expect(screen.getByText('Placed on Nov 10, 2026')).toBeInTheDocument();
  });

  it('lists the items in order', () => {
    logIn();
    renderOrderDetailPage('/orders/3');
    const items = within(screen.getByRole('region', { name: 'ITEMS' }));

    expect(
      items
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent)
    ).toEqual(['Regular Pants', 'Discounted Pants']);
  });

  it('shows the details of an item', () => {
    logIn();
    renderOrderDetailPage('/orders/3');
    const [, secondItem] = within(
      screen.getByRole('region', { name: 'ITEMS' })
    ).getAllByRole('listitem');
    const item = within(secondItem);

    expect(item.getByText('Color: 31 BEIGE')).toBeInTheDocument();
    expect(item.getByText('Size: L')).toBeInTheDocument();
    expect(item.getByText('$40.00')).toBeInTheDocument();
    expect(item.getByText('Quantity: 3')).toBeInTheDocument();
    expect(item.getByText('$120.00')).toBeInTheDocument();
  });

  it('links each item to its product page', () => {
    logIn();
    renderOrderDetailPage('/orders/3');

    expect(screen.getByRole('link', { name: 'Regular Pants' })).toHaveAttribute(
      'href',
      '/products/3'
    );
    expect(
      screen.getByRole('link', { name: 'Discounted Pants' })
    ).toHaveAttribute('href', '/products/5');
  });

  it('shows the delivery address', () => {
    logIn();
    renderOrderDetailPage('/orders/3');
    const shipping = within(
      screen.getByRole('region', { name: 'DELIVERY ADDRESS' })
    );

    expect(shipping.getByText('Long Nguyen')).toBeInTheDocument();
    expect(shipping.getByText('1 Le Loi Street')).toBeInTheDocument();
    expect(shipping.getByText('0912345678')).toBeInTheDocument();
  });

  it('shows the item count and totals in the summary', () => {
    logIn();
    renderOrderDetailPage('/orders/3');
    const summary = within(
      screen.getByRole('region', { name: 'Order summary' })
    );

    expect(summary.getByText('5 ITEM(S)')).toBeInTheDocument();
    // Một lần ở Subtotal, một lần ở ORDER TOTAL.
    expect(summary.getAllByText('$180.00')).toHaveLength(2);
  });
});

describe('OrderDetailPage status timeline', () => {
  it('lists the status steps in order', () => {
    logIn();
    renderOrderDetailPage('/orders/3');
    const timeline = within(screen.getByRole('list', { name: 'Order status' }));

    expect(
      timeline.getAllByRole('listitem').map((step) => step.textContent)
    ).toEqual(['Placed', 'Shipped', 'Delivered']);
  });

  it('marks the placed step as current for a placed order', () => {
    logIn();
    renderOrderDetailPage('/orders/3');
    const timeline = within(screen.getByRole('list', { name: 'Order status' }));

    expect(timeline.getByText('Placed')).toHaveAttribute(
      'aria-current',
      'step'
    );
    expect(timeline.getByText('Shipped')).not.toHaveAttribute('aria-current');
  });

  it('marks the shipped step as current for a shipped order', () => {
    logIn();
    // Ghi đè đơn đã lưu: cùng đơn #3 nhưng đã chuyển sang shipped.
    localStorage.setItem(
      'orders',
      JSON.stringify([{ ...ORDER, status: 'shipped' }])
    );
    renderOrderDetailPage('/orders/3');
    const timeline = within(screen.getByRole('list', { name: 'Order status' }));

    expect(timeline.getByText('Shipped')).toHaveAttribute(
      'aria-current',
      'step'
    );
    expect(timeline.getByText('Placed')).not.toHaveAttribute('aria-current');
    expect(timeline.getByText('Delivered')).not.toHaveAttribute('aria-current');
  });
});
