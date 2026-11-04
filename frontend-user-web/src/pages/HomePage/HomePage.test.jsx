import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import HomePage from './HomePage';
import { getLandingBanners } from '../../services/bannerService';

// Id khác id thật và khác mọi id trong MOCK_BANNERS để bắt lỗi dùng nhầm trường.
const WOMEN_CATEGORY = { slug: 'women', name: 'Women', categoryId: 11 };
const MEN_CATEGORY = { slug: 'men', name: 'Men', categoryId: 12 };

const MOCK_BANNERS = [
  {
    id: 1,
    categoryId: 1,
    targetCategoryId: 5,
    position: 1,
    title: 'Banner A',
    subtitle: 'Some subtitle',
    description: 'Some description',
    price: 60,
    discountPercent: 50,
    discountInfo: 'Discount information',
    image: 'FirstImage.jpg',
    alt: 'First alternative text',
  },
  {
    id: 2,
    categoryId: 1,
    targetCategoryId: 7,
    position: 2,
    title: 'Banner B',
    subtitle: null,
    description: 'Some description',
    price: 40,
    discountPercent: null,
    discountInfo: null,
    image: 'SecondImage.jpg',
    alt: 'Second alternative text',
  },
  {
    id: 3,
    categoryId: 1,
    targetCategoryId: 9,
    position: 3,
    title: 'Banner C',
    subtitle: null,
    description: 'Some description',
    price: 20,
    discountPercent: null,
    discountInfo: null,
    image: 'ThirdImage.jpg',
    alt: 'Third alternative text',
  },
];

vi.mock('../../services/bannerService', () => ({
  getLandingBanners: vi.fn(),
}));

afterEach(() => {
  vi.resetAllMocks();
});

/**
 * Render HomePage trong router tối thiểu có 2 landing (Women, Men).
 * @param {string} [entry='/women'] - URL bắt đầu
 * @returns {object} router, để bước sau đổi category bằng router.navigate
 */
function renderHomePage(entry = '/women') {
  const routes = [WOMEN_CATEGORY, MEN_CATEGORY].map((category) => ({
    path: `/${category.slug}`,
    element: <HomePage category={category} />,
  }));
  const router = createMemoryRouter(routes, { initialEntries: [entry] });
  render(<RouterProvider router={router} />);

  return router;
}

describe('HomePage loading state', () => {
  it('should show the loading message while banners are being fetched', () => {
    getLandingBanners.mockReturnValue(new Promise(() => {}));
    renderHomePage();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should hide the loading message after banners are loaded', async () => {
    getLandingBanners.mockResolvedValue(MOCK_BANNERS);
    renderHomePage();
    await screen.findAllByRole('heading', { level: 2 });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should show the error message and no banners when fetching fails', async () => {
    getLandingBanners.mockRejectedValue(new Error('Loading error!'));
    renderHomePage();
    const error = await screen.findByText('Loading error!');
    const headings = screen.queryAllByRole('heading', { level: 2 });

    expect(error).toBeInTheDocument();
    expect(headings).toHaveLength(0);
  });
});

describe('HomePage category', () => {
  it('should fetch banners of the category in the route', () => {
    getLandingBanners.mockReturnValue(new Promise(() => {}));
    renderHomePage('/men');

    expect(getLandingBanners).toHaveBeenCalledWith(12);
  });

  it('should set the page title from the category name', () => {
    getLandingBanners.mockReturnValue(new Promise(() => {}));
    renderHomePage('/men');

    expect(document.title).toBe('Men | UNIQLO');
  });

  it('should render the category name in uppercase as the page heading', () => {
    getLandingBanners.mockReturnValue(new Promise(() => {}));
    renderHomePage('/men');

    expect(
      screen.getByRole('heading', { level: 1, name: 'MEN' })
    ).toBeInTheDocument();
  });
});

describe('HomePage banners', () => {
  it('should render one banner for each banner returned by the service', async () => {
    getLandingBanners.mockResolvedValue(MOCK_BANNERS);
    renderHomePage();
    const headings = await screen.findAllByRole('heading', { level: 2 });

    expect(headings).toHaveLength(3);
  });

  it('should show the subtitle when the banner has one', async () => {
    getLandingBanners.mockResolvedValue(MOCK_BANNERS);
    renderHomePage();
    const existSubtitle = await screen.findByText('Some subtitle');

    expect(existSubtitle).toBeInTheDocument();
  });

  it('should show the discounted price, original price and discount info when the banner is discounted', async () => {
    getLandingBanners.mockResolvedValue(MOCK_BANNERS);
    renderHomePage();
    const discountedBanner = await screen.findByRole('link', {
      name: /Banner A/,
    });
    const existTexts = ['$30.00', '$60.00', 'Discount information'];

    for (const textToFind of existTexts) {
      const text = within(discountedBanner).getByText(textToFind);
      expect(text).toBeInTheDocument();
    }
  });

  it('should show only the original price when the banner is not discounted', async () => {
    getLandingBanners.mockResolvedValue(MOCK_BANNERS);
    renderHomePage();
    const undiscountedBanner = await screen.findByRole('link', {
      name: /Banner B/,
    });
    const prices = within(undiscountedBanner).getAllByText(/\$/);

    expect(prices).toHaveLength(1);
  });

  it('should link each banner to its target category', async () => {
    getLandingBanners.mockResolvedValue(MOCK_BANNERS);
    renderHomePage();
    const bannerA = await screen.findByRole('link', { name: /Banner A/ });
    const bannerB = screen.getByRole('link', { name: /Banner B/ });

    expect(bannerA).toHaveAttribute('href', '/categories/5');
    expect(bannerB).toHaveAttribute('href', '/categories/7');
  });
});
