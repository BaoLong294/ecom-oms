import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ProductPage from './ProductPage';
import { getProductById } from '../../services/productService';
import CartProvider from '../../context/CartProvider.jsx';
import { getVariantsByIds } from '../../services/variantService';

vi.mock('../../services/productService', () => ({
  getProductById: vi.fn(),
}));

vi.mock('../../services/variantService', () => ({
  getVariantsByIds: vi.fn(),
}));

const productA = {
  id: 1,
  name: 'Product A',
  categoryId: 5,
  gender: 'Unisex',
  price: 50,
  discountPercent: null,
  discountInfo: null,
  sizes: ['M', 'L'],
  detailImages: ['/images/product-a-details.avif'],
  colors: [
    {
      code: '09',
      name: '09 BLACK',
      swatch: '/images/09-black.avif',
      image: '/images/product-a/09-black.avif',
    },
    {
      code: '11',
      name: '11 PINK',
      swatch: '/images/11-pink.avif',
      image: '/images/product-a/11-pink.avif',
    },
  ],
  features: [
    { img: '/images/product-a-feature.avif', text: 'Product A Feature' },
  ],
  variants: [
    {
      id: 101,
      productId: 1,
      colorCode: '09',
      size: 'M',
      stockQuantity: 10,
    },
    {
      id: 102,
      productId: 1,
      colorCode: '09',
      size: 'L',
      stockQuantity: 10,
    },
    {
      id: 103,
      productId: 1,
      colorCode: '11',
      size: 'M',
      stockQuantity: 10,
    },
    {
      id: 104,
      productId: 1,
      colorCode: '11',
      size: 'L',
      stockQuantity: 10,
    },
  ],
};

const productB = {
  id: 2,
  name: 'Product B',
  categoryId: 6,
  gender: 'Women',
  price: 40,
  discountPercent: 50,
  discountInfo: 'Happy New Year',
  sizes: ['S', 'XL'],
  detailImages: ['/images/product-b-details.avif'],
  colors: [
    {
      code: '05',
      name: '05 BLUE',
      swatch: '/images/05-blue.avif',
      image: '/images/product-b/05-blue.avif',
    },
    {
      code: '10',
      name: '10 WHITE',
      swatch: '/images/10-white.avif',
      image: '/images/product-b/10-white.avif',
    },
  ],
  features: [],
  variants: [
    {
      id: 201,
      productId: 2,
      colorCode: '05',
      size: 'S',
      stockQuantity: 10,
    },
    {
      id: 202,
      productId: 2,
      colorCode: '05',
      size: 'XL',
      stockQuantity: 10,
    },
    {
      id: 203,
      productId: 2,
      colorCode: '10',
      size: 'S',
      stockQuantity: 10,
    },
    {
      id: 204,
      productId: 2,
      colorCode: '10',
      size: 'XL',
      stockQuantity: 10,
    },
  ],
};

const variant101 = {
  id: 101,
  productId: 1,
  colorCode: '09',
  size: 'M',
  stockQuantity: 10,
  productName: 'Product A',
  gender: 'Unisex',
  price: 50,
  discountPercent: null,
  discountInfo: null,
  colorName: '09 BLACK',
  colorImage: '/images/product-a/09-black.avif',
};

const variant203 = {
  id: 203,
  productId: 2,
  colorCode: '10',
  size: 'S',
  stockQuantity: 10,
  productName: 'Product B',
  gender: 'Women',
  price: 40,
  discountPercent: 50,
  discountInfo: 'Happy New Year',
  colorName: '10 WHITE',
  colorImage: '/images/product-b/10-white.avif',
};

function renderProductPage() {
  const router = createMemoryRouter(
    [
      { path: '/products/:id', element: <ProductPage /> },
      { path: '/cart', element: <h1>Cart page</h1> },
    ],
    { initialEntries: ['/products/29'] }
  );

  render(
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

// jsdom không cài đặt scrollTo, cũng như 2 phương thức của dialog, gọi tới sẽ ném TypeError.
// Gắn hàm giả mới trước mỗi test và gỡ sau mỗi test để các test không ảnh hưởng nhau.
beforeEach(() => {
  Element.prototype.scrollTo = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn(function () {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

afterEach(() => {
  vi.resetAllMocks();
  delete Element.prototype.scrollTo;
  HTMLDialogElement.prototype.showModal = originalShowModal;
  HTMLDialogElement.prototype.close = originalClose;
  localStorage.clear();
});

describe('ProductPage', () => {
  it('shows loading message while fetching', () => {
    getProductById.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const loading = screen.getByText('Loading...');

    expect(loading).toBeInTheDocument();
  });

  it('renders hidden "Product" heading while loading', () => {
    getProductById.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const heading = screen.getByRole('heading', { level: 1, name: 'Product' });

    expect(heading).toBeInTheDocument();
  });

  it('calls getProductById with the id from the URL as a number', () => {
    getProductById.mockReturnValue(new Promise(() => {}));
    renderProductPage();

    expect(getProductById).toHaveBeenCalledWith(29);
  });

  it('shows error message when the request fails', async () => {
    getProductById.mockRejectedValue(new Error('Loading error!'));
    renderProductPage();
    const errorMessage = await screen.findByText('Loading error!');

    expect(errorMessage).toBeInTheDocument();
  });

  it('shows "Product not found" when the product does not exist', async () => {
    getProductById.mockResolvedValue(null);
    renderProductPage();
    const notFound = await screen.findByRole('heading', {
      level: 1,
      name: 'Product not found',
    });

    expect(notFound).toBeInTheDocument();
  });

  it('shows the product name as heading and hides loading', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const heading = await screen.findByRole('heading', {
      level: 1,
      name: 'Product A',
    });
    const loading = screen.queryByText('Loading...');

    expect(heading).toBeInTheDocument();
    expect(loading).not.toBeInTheDocument();
  });
});

describe('ProductDetails display', () => {
  it('shows regular price when there is no discount', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const regularPrice = await screen.findByText('$50.00');

    expect(regularPrice).toBeInTheDocument();
  });

  it('shows discount price, original price and discount info', async () => {
    getProductById.mockResolvedValue(productB);
    renderProductPage();
    await screen.findByRole('heading', { level: 1, name: 'Product B' });

    const productInfos = ['$20.00', '$40.00', 'Happy New Year'];
    productInfos.forEach((info) => {
      expect(screen.getByText(info)).toBeInTheDocument();
    });
  });

  it('shows the product id from the data', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const productID = await screen.findByText('Product ID: 1');

    expect(productID).toBeInTheDocument();
  });

  it('shows features when the product has them', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const heading = await screen.findByRole('heading', { name: 'Feature' });
    const productFeature = screen.getByText('Product A Feature');

    expect(heading).toBeInTheDocument();
    expect(productFeature).toBeInTheDocument();
  });

  it('hides the feature section when the product has no features', async () => {
    getProductById.mockResolvedValue(productB);
    renderProductPage();
    const description = await screen.findByRole('heading', {
      name: 'Description',
    });
    const feature = screen.queryByRole('heading', { name: 'Feature' });

    expect(description).toBeInTheDocument();
    expect(feature).not.toBeInTheDocument();
  });

  it('renders the wishlist button as disabled', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const wishlist = await screen.findByRole('button', {
      name: 'Add Product A to wishlist',
    });

    expect(wishlist).toBeDisabled();
  });
});

describe('ProductDetails color and size selection', () => {
  it('selects the first color by default', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const colorRadio = await screen.findByRole('radio', { name: '09 BLACK' });
    const colorText = screen.getByText('Color: 09 BLACK');
    const image = screen.getByRole('img', { name: 'Product A, 09 BLACK' });

    expect(colorRadio).toBeChecked();
    expect(colorText).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });

  it('changes color label and main image when selecting another color', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const colorRadio = await screen.findByRole('radio', { name: '11 PINK' });

    await user.click(colorRadio);

    const colorText = screen.getByText('Color: 11 PINK');
    const existedImage = screen.getByRole('img', {
      name: 'Product A, 11 PINK',
    });
    const hiddenImage = screen.queryByRole('img', {
      name: 'Product A, 09 BLACK',
    });

    expect(colorRadio).toBeChecked();
    expect(colorText).toBeInTheDocument();
    expect(existedImage).toBeInTheDocument();
    expect(hiddenImage).not.toBeInTheDocument();
  });

  it('scrolls the gallery back to the start when selecting another color', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    renderProductPage();

    const colorRadio = await screen.findByRole('radio', { name: '11 PINK' });
    expect(Element.prototype.scrollTo).not.toHaveBeenCalled();

    await user.click(colorRadio);
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith({
      left: 0,
      behavior: 'smooth',
    });
  });

  it('selects the first size by default', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const sizeRadio = await screen.findByRole('radio', { name: 'M' });
    const sizeText = screen.getByText('Size: UNISEX M');

    expect(sizeRadio).toBeChecked();
    expect(sizeText).toBeInTheDocument();
  });

  it('changes size label when selecting another size', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const sizeRadio = await screen.findByRole('radio', { name: 'L' });

    await user.click(sizeRadio);

    const sizeText = screen.getByText('Size: UNISEX L');

    expect(sizeRadio).toBeChecked();
    expect(sizeText).toBeInTheDocument();
  });
});

describe('ProductDetails quantity stepper', () => {
  it('starts at 1 with decrease marked as disabled', async () => {
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const quantityValue = await screen.findByRole('status', {
      name: 'Quantity',
    });
    const decreaseQuantity = screen.getByRole('button', {
      name: 'Decrease quantity',
    });

    expect(quantityValue).toHaveTextContent('1');
    expect(decreaseQuantity).toHaveAttribute('aria-disabled', 'true');
  });

  it('increases quantity and enables decrease when clicking plus', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const increaseQuantity = await screen.findByRole('button', {
      name: 'Increase quantity',
    });

    await user.click(increaseQuantity);

    const quantityValue = screen.getByRole('status', { name: 'Quantity' });
    const decreaseQuantity = screen.getByRole('button', {
      name: 'Decrease quantity',
    });

    expect(quantityValue).toHaveTextContent('2');
    expect(decreaseQuantity).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('does not go below 1 when clicking minus at 1', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const decreaseQuantity = await screen.findByRole('button', {
      name: 'Decrease quantity',
    });

    await user.click(decreaseQuantity);

    const quantityValue = screen.getByRole('status', { name: 'Quantity' });

    expect(quantityValue).toHaveTextContent('1');
  });

  it('returns to 1 after clicking plus then minus', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    renderProductPage();
    const increaseQuantity = await screen.findByRole('button', {
      name: 'Increase quantity',
    });
    const decreaseQuantity = screen.getByRole('button', {
      name: 'Decrease quantity',
    });

    await user.click(increaseQuantity);
    await user.click(decreaseQuantity);

    const quantityValue = screen.getByRole('status', { name: 'Quantity' });

    expect(quantityValue).toHaveTextContent('1');
  });
});

describe('ProductDetails add to cart', () => {
  function readStoredCart() {
    return JSON.parse(localStorage.getItem('cart'));
  }

  it('adds the default color, size and quantity to the cart', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const addToCart = await screen.findByRole('button', {
      name: 'ADD TO CART',
    });

    await user.click(addToCart);

    expect(readStoredCart()).toEqual([{ variantId: 101, quantity: 1 }]);
  });

  it('adds the variant of the selected color and size with the chosen quantity', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const pinkRadio = await screen.findByRole('radio', { name: '11 PINK' });

    await user.click(pinkRadio);
    await user.click(screen.getByRole('radio', { name: 'L' }));
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    await user.click(screen.getByRole('button', { name: 'ADD TO CART' }));

    expect(readStoredCart()).toEqual([{ variantId: 104, quantity: 2 }]);
  });
});

describe('ProductDetails add to cart popup', () => {
  it('opens the popup with the quantity just added', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const increase = await screen.findByRole('button', {
      name: 'Increase quantity',
    });

    await user.click(increase);
    await user.click(screen.getByRole('button', { name: 'ADD TO CART' }));

    const dialog = screen.getByRole('dialog', {
      name: '2 item(s) added to your cart',
      hidden: true,
    });
    expect(dialog).toHaveAttribute('open');
  });

  it('shows the item count and total of the whole cart', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'cart',
      JSON.stringify([{ variantId: 203, quantity: 1 }])
    );
    getProductById.mockResolvedValue(productA);
    getVariantsByIds.mockResolvedValue([variant203, variant101]);
    renderProductPage();
    const increase = await screen.findByRole('button', {
      name: 'Increase quantity',
    });

    await user.click(increase);
    await user.click(screen.getByRole('button', { name: 'ADD TO CART' }));

    expect(await screen.findByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('3 item(s)')).toBeInTheDocument();
    expect(getVariantsByIds).toHaveBeenCalledWith([203, 101]);
  });

  it('closes the popup with the close button', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const addToCart = await screen.findByRole('button', {
      name: 'ADD TO CART',
    });

    await user.click(addToCart);
    const dialog = screen.getByRole('dialog', { hidden: true });
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(dialog).not.toHaveAttribute('open');
  });

  it('closes the popup with CONTINUE SHOPPING', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const addToCart = await screen.findByRole('button', {
      name: 'ADD TO CART',
    });

    await user.click(addToCart);
    const dialog = screen.getByRole('dialog', { hidden: true });
    await user.click(screen.getByRole('button', { name: 'CONTINUE SHOPPING' }));

    expect(dialog).not.toHaveAttribute('open');
  });

  it('goes to the cart page with VIEW CART', async () => {
    const user = userEvent.setup();
    getProductById.mockResolvedValue(productA);
    getVariantsByIds.mockReturnValue(new Promise(() => {}));
    renderProductPage();
    const addToCart = await screen.findByRole('button', {
      name: 'ADD TO CART',
    });

    await user.click(addToCart);
    await user.click(screen.getByRole('link', { name: 'VIEW CART' }));

    expect(
      screen.getByRole('heading', { level: 1, name: 'Cart page' })
    ).toBeInTheDocument();
  });
});
