import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';

// Không giảm giá, 2 màu, dải size S-L
const productA = {
  id: 5,
  name: 'Product A',
  categoryId: 9,
  gender: 'Women',
  price: 40,
  discountPercent: null,
  discountInfo: null,
  sizes: ['S', 'M', 'L'],
  detailImages: ['/images/test/product-a-detail-1.avif'],
  colors: [
    {
      code: '01',
      name: '01 RED',
      swatch: '/images/test/swatch-01-red.avif',
      image: '/images/test/product-a-01-red.avif',
    },
    {
      code: '02',
      name: '02 BLUE',
      swatch: '/images/test/swatch-02-blue.avif',
      image: '/images/test/product-a-02-blue.avif',
    },
  ],
  features: [
    { img: '/images/test/product-a-feature-1.avif', text: 'Feature A1' },
  ],
};

// Giảm 50%: giá gốc $50.00, giá sau giảm $25.00
const productB = {
  id: 6,
  name: 'Product B',
  categoryId: 10,
  gender: 'Unisex',
  price: 50,
  discountPercent: 50,
  discountInfo: 'Sale ends 10/31',
  sizes: ['XS', 'M'],
  detailImages: ['/images/test/product-b-detail-1.avif'],
  colors: [
    {
      code: '03',
      name: '03 GREEN',
      swatch: '/images/test/swatch-03-green.avif',
      image: '/images/test/product-b-03-green.avif',
    },
    {
      code: '04',
      name: '04 BLACK',
      swatch: '/images/test/swatch-04-black.avif',
      image: '/images/test/product-b-04-black.avif',
    },
  ],
  features: [
    { img: '/images/test/product-b-feature-1.avif', text: 'Feature B1' },
  ],
};

/**
 * Render một ProductCard trong router tối thiểu (card có <Link> nên cần router).
 * @param {object} product - sản phẩm mock truyền vào card
 */
function renderCard(product) {
  const router = createMemoryRouter(
    [{ path: '/', element: <ProductCard product={product} /> }],
    { initialEntries: ['/'] }
  );

  render(<RouterProvider router={router} />);
}

describe('ProductCard', () => {
  it('should have correct name and href for link', () => {
    renderCard(productA);
    const link = screen.getByRole('link', { name: 'Product A' });

    expect(link).toHaveAttribute('href', '/products/5');
  });

  it('should show the regular price if the product is not discounted', () => {
    renderCard(productA);

    expect(screen.getByText('$40.00')).toBeInTheDocument();
  });

  it('should show the discounted price and discount info if the product is discounted', () => {
    renderCard(productB);

    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('Sale ends 10/31')).toBeInTheDocument();
  });

  it('should not show the original price if the product is discounted', () => {
    renderCard(productB);

    expect(screen.queryByText('$50.00')).not.toBeInTheDocument();
  });

  it('should show the correct size range', () => {
    renderCard(productA);

    expect(screen.getByText('S-L')).toBeInTheDocument();
  });

  it('should show all colors of the product', () => {
    renderCard(productA);

    expect(screen.getByAltText('01 RED')).toBeInTheDocument();
    expect(screen.getByAltText('02 BLUE')).toBeInTheDocument();
  });

  it('should disable the button used to add products to the wishlist', () => {
    renderCard(productA);
    const wishlistButton = screen.getByRole('button', {
      name: 'Add Product A to wishlist',
    });

    expect(wishlistButton).toBeDisabled();
  });
});
