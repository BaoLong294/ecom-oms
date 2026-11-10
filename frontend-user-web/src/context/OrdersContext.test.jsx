import { describe, it, expect, vi, afterEach } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersProvider from './OrdersProvider';
import { useOrders } from './OrdersContext';

const ORDERS_KEY = 'orders';

const ORDER_INPUT = {
  email: 'long@example.com',
  shipping: {
    firstName: 'Long',
    lastName: 'Nguyen',
    address: '1 Le Loi Street',
    phone: '0912345678',
  },
  items: [
    {
      variantId: 101,
      productName: 'Pants A',
      colorName: '09 BLACK',
      size: 'M',
      quantity: 2,
      unitPrice: 30,
    },
  ],
  total: 60,
};

// Đơn đã lưu sẵn: chỉ id khác nhau. Đặt id 3 trước id 1 để bắt lỗi
// tính id mới bằng số đơn (ra 3, trùng) hoặc bằng id của đơn cuối (ra 2).
function storedOrder(id) {
  return {
    ...ORDER_INPUT,
    id,
    status: 'placed',
    createdAt: '2026-11-01T00:00:00.000Z',
  };
}

// Component chỉ dùng trong test: in danh sách id đơn, id vừa tạo,
// và có nút gọi addOrder với dữ liệu cố định.
function OrdersStatus() {
  const { orders, addOrder } = useOrders();
  const [lastId, setLastId] = useState(null);

  return (
    <>
      <p>{`Orders: ${orders.map((order) => `#${order.id}`).join(', ') || 'none'}`}</p>
      <p>{`Last id: ${lastId ?? 'none'}`}</p>
      <button type="button" onClick={() => setLastId(addOrder(ORDER_INPUT))}>
        Place order
      </button>
    </>
  );
}

function renderOrders() {
  render(
    <OrdersProvider>
      <OrdersStatus />
    </OrdersProvider>
  );
}

function storeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function readStoredOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY));
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useOrders', () => {
  it('throws when used outside OrdersProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<OrdersStatus />)).toThrow(
      'useOrders must be used inside OrdersProvider'
    );
  });
});

describe('initial state', () => {
  it('starts empty when nothing is stored', () => {
    renderOrders();

    expect(screen.getByText('Orders: none')).toBeInTheDocument();
  });

  it('reads the stored orders', () => {
    storeOrders([storedOrder(3), storedOrder(1)]);
    renderOrders();

    expect(screen.getByText('Orders: #3, #1')).toBeInTheDocument();
  });

  it('starts empty when the stored value is not valid JSON', () => {
    localStorage.setItem(ORDERS_KEY, 'not json');
    renderOrders();

    expect(screen.getByText('Orders: none')).toBeInTheDocument();
  });
});

describe('addOrder', () => {
  it('adds the first order with id 1 and stores it', async () => {
    const user = userEvent.setup();
    renderOrders();

    await user.click(screen.getByRole('button', { name: 'Place order' }));

    expect(screen.getByText('Orders: #1')).toBeInTheDocument();
    expect(readStoredOrders()).toEqual([
      {
        ...ORDER_INPUT,
        id: 1,
        status: 'placed',
        createdAt: expect.any(String),
      },
    ]);
  });

  it('appends a new order after the stored ones', async () => {
    const user = userEvent.setup();
    storeOrders([storedOrder(3), storedOrder(1)]);
    renderOrders();
    expect(screen.getByText('Orders: #3, #1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Place order' }));

    expect(screen.getByText('Orders: #3, #1, #4')).toBeInTheDocument();
    expect(readStoredOrders().map((order) => order.id)).toEqual([3, 1, 4]);
  });

  it('returns the id of the new order', async () => {
    const user = userEvent.setup();
    storeOrders([storedOrder(3), storedOrder(1)]);
    renderOrders();

    await user.click(screen.getByRole('button', { name: 'Place order' }));

    expect(screen.getByText('Last id: 4')).toBeInTheDocument();
  });
});
