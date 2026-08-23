# ECOMMERCE – OMS

## Introduction

Ecommerce – OMS is an educational project that replicates the structure of a modern retail website like Uniqlo and gradually evolves into a full commerce system including OMS (Order Management System), IMS (Inventory Management System), and DMS (Delivery Management System).
This project is developed alongside the curriculum of The Odin Project to strengthen frontend fundamentals, backend logic, database design, React development and overall system architecture thinking.

## Initial Project Goals

- Strengthen core skills in HTML, CSS and JavaScript through recreating the Uniqlo storefront.
- Practice analyzing real-world UI using DevTools and rebuilding layouts.
- Apply Flexbox and Responsive Design to support multiple screen sizes.
- Build foundational pages such as product lists, product details and cart UI.
- Establish a clean project structure and use Git/GitHub for version control.

## Technologies Used

- HTML5 (Semantic HTML, ARIA-friendly focus patterns)
- CSS3 (Flexbox, Grid, Responsive Design, CSS Transitions, `:focus-visible`, pseudo-elements)
- JavaScript (ES6, ES Modules)
- Asynchronous JavaScript (Promises, async/await)
- localStorage for client-side state persistence
- Web Accessibility (WAI-ARIA basics, keyboard navigation, focus management)
- Git & GitHub
- VS Code, Chrome DevTools (accessibility tree, box model, force element state)

## Completed Features

- **Phase 0 – Project Setup**
  - Created GitHub repository with folder structure for user frontend, admin frontend and backend.
  - Analysed Uniqlo.com using DevTools to understand its layout, components, typography and visual structure.
  - Initialized the base files and project structure.

- **Phase 1 – Static Landing Page**
  - Built the Uniqlo-like homepage layout using HTML and CSS.
  - Created Header with logo, WOMEN MEN KIDS BABY menu and icons.
  - Designed Hero (banner) and collection highlight sections.
  - Implemented Flexbox-based Footer with multiple columns.
  - Achieved an accurate desktop layout similar to the real Uniqlo site.

- **Phase 2 – Basic Interactivity & Responsive Design**
  - Made the entire landing page responsive with CSS media queries.
  - Implemented mobile hamburger navigation.
  - Built a simple JavaScript carousel for the homepage banner.
  - Created products.html with mock product data.
  - Created product-detail.html displaying product info by id.
  - Built a static cart page (cart.html).
  - Added hover effects and basic DOM interactions.
  - Skills Demonstrated
  - HTML & CSS Layout: Recreating complex layouts with Flexbox and Grid.
  - Responsive Web Design: Adapting UI for mobile, tablet and desktop.
  - DOM Manipulation: Implementing carousel and UI effects via JavaScript.
  - Event Handling: Toggling mobile navigation, handling user interactions.
  - UI Analysis Skills: Breaking down real website UI into components.
  - Version Control: Using Git and GitHub with clean commit history.

- **Phase 3 – Advanced JavaScript & Storefront Architecture**
  - Refactored the entire storefront into single-responsibility ES modules: `data/products.js` (product source), `cart/cart.js` and `wishlist/wishlist.js` (dedicated state modules, the only code allowed to touch their `localStorage` keys), `auth/auth.js` (simulated login state), `ui/` (reusable render components), and `utils/price.js` (shared pricing helpers).
  - Centralized cart and wishlist state so every page reads and writes through the same functions instead of duplicating `localStorage` logic.
  - Tracked wishlist items by exact `{id, color, size}` combination, keeping the heart icon in sync across product cards, the wishlist popup, and the product details page — including correct re-sync when the user changes color or size.
  - Introduced a singleton popup pattern (wishlist popup, login-required popup): built once on first use, reused on every later interaction instead of being recreated.
  - Simulated an async API with `fetchProducts()` (Promise + artificial delay), adding loading and friendly error states across the product listing and product detail pages.
  - Built a full Wishlist page (`shopping-wishlist.html`) with empty/filled states, a sticky item-count sidebar, and per-item cards supporting remove-from-wishlist and add-to-cart.
  - Implemented a login-required flow: wishlisting a product while logged out opens a popup prompting login, matching the real Uniqlo UX; wired the login form to `auth.js` so successful validation sets the logged-in flag and redirects.
  - Replaced the header's placeholder icon with a custom hand-drawn account icon matching the existing icon set's stroke style, linked to the login page across every storefront page.
  - Documented every exported function with JSDoc (`@param`/`@returns`) and gave each module a short header comment describing its responsibility.

- **Phase 4 – Advanced UI Polish Before React**

  Applied the Advanced HTML & CSS curriculum (accessibility, animation, responsive design) to bring the storefront to a portfolio-ready, production-feel state before the upcoming React rewrite.
  - **Accessibility (a11y)**
    - Converted every wishlist heart icon from a bare `<svg>` into a real `<button>` across product cards, the wishlist popup, product details, and the wishlist page, restoring proper keyboard operability.
    - Built a shared `ui/focus-trap.js` module using the `inert` attribute and a `keydown` listener to trap Tab focus inside open popups (wishlist, login-required, add-to-cart), preventing focus from silently escaping to the page behind them.
    - Made product cards keyboard-navigable with `role="link"` and `tabindex="0"`, resolving an event-bubbling conflict where Enter on the nested heart button also triggered the card's own navigation.
    - Converted layout `<div>`s into semantic landmarks (`<header>`, `<nav>`, `<main>`) across all six pages, fixed an invalid `button > a` nesting in `product-details.html`, and added a `.visually-hidden` `<h1>` to the landing page so each page exposes exactly one `h1` to assistive technology.
    - Rolled out `:focus-visible` styling to every interactive control site-wide, using two consistent patterns: a flush outline (`outline: 1px solid`, no offset) for icon-sized controls, and an offset outline (`outline-offset`) for larger pill/circular controls — matching each element's existing hover/active styling for visual consistency.
    - Added a skip-to-main-content link as the first focusable element in the header on every page: hidden by default via `opacity`/`pointer-events` (not `display`/`visibility`, which would remove it from the tab order) and revealed with a full-header overlay on `:focus`.
    - Added an `id` to every page's `<main>` as the skip link's target landmark.
    - Added `:focus-visible` handling for a visually-hidden native checkbox (the "show password" toggle) by targeting its visible `label::before` counterpart, since the real input has zero size and cannot be outlined directly.
    - Replaced generic `alt="Color Swatch"` text with the actual color name pulled from product data, so screen readers announce meaningful color information.
    - Diagnosed and fixed several real accessibility bugs along the way: silent CSS selector typos (missing leading dot, copy-pasted wrong class name) that made focus rules never match; a `line-height: 0` popup close button with no padding that caused its focus outline to clip through the glyph; and a `<button>` nested inside an `<a>` (invalid HTML) that made a "Continue Shopping" link require two Tab presses before showing focus.
  - **Animation**
    - Added fade + scale transitions to all three popup types (login-required, wishlist, add-to-cart), animating only `opacity` and `transform` for cheap compositing performance, with `transition-delay` on `visibility` to avoid a flash on close.
    - Used `requestAnimationFrame` to ensure the first-open animation of JS-generated popups actually plays instead of snapping instantly.
  - **Responsive Design**
    - Replaced fixed-width layout containers (`width: 1170px`, etc.) with `max-width` + `width: 100%` across all six pages, eliminating horizontal overflow on mobile.
    - Rebuilt every page for a `max-width: 480px` breakpoint using a desktop-first strategy: header, product grid, product details image carousel (via `scroll-snap-type`), wishlist, cart, login form, and all three popups.
  - **Landing page polish**
    - Added a focus-visible outline to the landing page hero banner link using a `::after` pseudo-element overlay, since a standard `outline` on a full-bleed image gets clipped by the image layer and is invisible with `outline-offset` set to a negative value.

## Lessons Learned

- Importance of UI analysis before writing code.
- Learning to break large layouts into smaller manageable sections.
- Improved understanding of responsive breakpoints.
- Better project organization and folder structuring for scalable systems.
- Recognizing when duplicated logic across files is a signal to extract a shared module — and, just as importantly, when a single-use function is not worth abstracting yet.
- The value of designing a clear data shape (e.g. wishlist items keyed by id + color + size) up front, since it determines how simple or painful every feature built on top of it will be.
- Accessibility is not just "add an outline" — it requires understanding _which_ element in the DOM actually receives keyboard focus (a wrapping `<a>` vs. an inner `<svg>`), how invalid HTML nesting silently breaks focus order, and how positioning/stacking (`z-index`, `position`, pseudo-elements) can hide or clip focus indicators even when the CSS rule is technically correct.
- CSS selector mistakes (a missing dot, a copy-pasted wrong class name) fail completely silently — no console error, no visual break — making methodical, page-by-page testing with the keyboard and DevTools essential rather than optional.
- The difference between hiding an element for accessibility (`opacity` + `pointer-events`, which preserves tab order) versus hiding it visually only (`display`/`visibility`, which removes it from the accessibility tree entirely) — and why the wrong choice can make a feature invisible to the very users it's meant to help.
- Credits / Attribution
- Visual references from uniqlo.com for educational, non-commercial purposes.
- Icons from SVG libraries, Material Icons, and hand-drawn custom icons (non-commercial usage).

## Contact

- GitHub: https://github.com/BaoLong294
- Email: longbao2904@gmail.com
- LinkedIn: https://www.linkedin.com/in/long-b%E1%BA%A3o-a9226a377/
