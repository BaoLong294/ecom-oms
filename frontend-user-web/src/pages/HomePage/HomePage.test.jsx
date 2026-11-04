import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
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

const WOMEN_BANNER = {
  id: 21,
  categoryId: 11,
  targetCategoryId: 5,
  position: 1,
  title: 'Women banner',
  subtitle: null,
  description: 'Some description',
  price: 40,
  discountPercent: null,
  discountInfo: null,
  image: '/images/women-banner.jpg',
  alt: 'Women banner image',
};

const MEN_BANNER = {
  id: 22,
  categoryId: 12,
  targetCategoryId: 10,
  position: 1,
  title: 'Men banner',
  subtitle: null,
  description: 'Some description',
  price: 50,
  discountPercent: null,
  discountInfo: null,
  image: '/images/men-banner.jpg',
  alt: 'Men banner image',
};

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

describe('HomePage category switch', () => {
  it('should show the banners and title of the new category after switching', async () => {
    getLandingBanners.mockImplementation((categoryId) =>
      Promise.resolve(categoryId === 11 ? [WOMEN_BANNER] : [MEN_BANNER])
    );
    const router = renderHomePage();
    await screen.findByRole('heading', { level: 2, name: 'Women banner' });

    await act(async () => {
      await router.navigate('/men');
    });

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Men banner' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Women banner' })
    ).not.toBeInTheDocument();
    expect(document.title).toBe('Men | UNIQLO');
  });

  it('should keep the previous banners while the new ones are loading', async () => {
    const men = Promise.withResolvers();
    getLandingBanners.mockImplementation((categoryId) =>
      categoryId === 11 ? Promise.resolve([WOMEN_BANNER]) : men.promise
    );
    const router = renderHomePage();
    await screen.findByRole('heading', { level: 2, name: 'Women banner' });

    await act(async () => {
      await router.navigate('/men');
    });

    expect(getLandingBanners).toHaveBeenCalledWith(12);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Women banner' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should ignore banners of the previous category that arrive late', async () => {
    const women = Promise.withResolvers();
    const men = Promise.withResolvers();
    getLandingBanners.mockImplementation((categoryId) =>
      categoryId === 11 ? women.promise : men.promise
    );
    const router = renderHomePage();

    await act(async () => {
      await router.navigate('/men');
    });
    await act(async () => {
      men.resolve([MEN_BANNER]);
    });
    await screen.findByRole('heading', { level: 2, name: 'Men banner' });

    // WOMEN về sau MEN: kết quả này thuộc lần fetch đã hết hiệu lực, phải bị bỏ qua.
    await act(async () => {
      women.resolve([WOMEN_BANNER]);
    });

    expect(
      screen.getByRole('heading', { level: 2, name: 'Men banner' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Women banner' })
    ).not.toBeInTheDocument();
  });
});
