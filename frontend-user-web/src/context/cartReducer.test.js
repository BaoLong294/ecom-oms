import { describe, it, expect } from 'vitest';
import { cartReducer } from './cartReducer';

function freezeCart(items) {
  items.forEach((item) => Object.freeze(item));

  return Object.freeze(items);
}

const EMPTY_CART = freezeCart([]);
const CART_ONE_ITEM = freezeCart([{ variantId: 5, quantity: 1 }]);
const CART_TWO_ITEMS = freezeCart([
  { variantId: 5, quantity: 1 },
  { variantId: 12, quantity: 2 },
]);
const CART_THREE_ITEMS = freezeCart([
  { variantId: 5, quantity: 1 },
  { variantId: 12, quantity: 2 },
  { variantId: 7, quantity: 3 },
]);

describe('added', () => {
  it('adds the item to an empty cart', () => {
    const action = { type: 'added', variantId: 12, quantity: 2 };
    const result = cartReducer(EMPTY_CART, action);

    expect(result).toEqual([{ variantId: 12, quantity: 2 }]);
  });

  it('appends a new item to the end of the cart', () => {
    const action = { type: 'added', variantId: 12, quantity: 2 };
    const result = cartReducer(CART_ONE_ITEM, action);

    expect(result).toEqual([
      { variantId: 5, quantity: 1 },
      { variantId: 12, quantity: 2 },
    ]);
  });

  it('adds to the quantity when the item is already in the cart', () => {
    const action = { type: 'added', variantId: 12, quantity: 3 };
    const result = cartReducer(CART_TWO_ITEMS, action);

    expect(result).toEqual([
      { variantId: 5, quantity: 1 },
      { variantId: 12, quantity: 5 },
    ]);
  });
});

describe('quantity_changed', () => {
  it('changes the quantity of only the matching item', () => {
    const action = { type: 'quantity_changed', variantId: 12, quantity: 4 };
    const result = cartReducer(CART_TWO_ITEMS, action);

    expect(result).toEqual([
      { variantId: 5, quantity: 1 },
      { variantId: 12, quantity: 4 },
    ]);
  });
});

describe('removed', () => {
  it('removes only the matching item', () => {
    const action = { type: 'removed', variantId: 12 };
    const result = cartReducer(CART_THREE_ITEMS, action);

    expect(result).toEqual([
      { variantId: 5, quantity: 1 },
      { variantId: 7, quantity: 3 },
    ]);
  });
});

describe('unknown action', () => {
  it('throws an error for an unknown action type', () => {
    const action = { type: 'unknown' };

    expect(() => cartReducer(CART_ONE_ITEM, action)).toThrow(
      'Unknown action: unknown'
    );
  });
});
