# E-Commerce Platform Design Guidelines

## Design Approach
**Reference-Based**: Drawing from industry leaders (Shopify, Amazon, Etsy) while maintaining clean, modern aesthetics. Prioritizing product visibility, trust signals, and conversion-optimized user flows.

## Core Design Principles
1. **Product-First**: Images and product information take visual priority
2. **Trust & Clarity**: Clean layouts with clear CTAs and pricing
3. **Efficient Navigation**: Quick access to categories, cart, and search
4. **Admin Efficiency**: Streamlined data-dense interfaces for product management

---

## Typography System

**Font Stack**: Inter (primary), system-ui fallback via Google Fonts CDN

### Hierarchy
- **Hero Headlines**: text-5xl md:text-6xl, font-bold
- **Page Titles**: text-3xl md:text-4xl, font-bold
- **Section Headers**: text-2xl font-semibold
- **Product Names**: text-lg font-semibold
- **Body Text**: text-base, leading-relaxed
- **Metadata** (prices, SKUs): text-sm font-medium
- **Labels**: text-xs uppercase tracking-wide font-semibold

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 3, 4, 6, 8, 12, 16, 20**
- Micro spacing (elements within components): p-2, p-3, gap-2
- Component internal: p-4, p-6, gap-4
- Section spacing: py-12, py-16, py-20
- Container gaps: gap-6, gap-8

**Grid System**:
- Products: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`
- Admin tables: `grid-cols-1 gap-4` with responsive breakpoints
- Checkout: `grid-cols-1 lg:grid-cols-3` (2 cols form, 1 col summary)

**Container Widths**:
- Main content: `max-w-7xl mx-auto px-4`
- Product detail: `max-w-6xl`
- Forms/checkout: `max-w-4xl`

---

## Component Library

### Navigation Header
- Sticky header with search bar, category mega-menu, cart icon with badge
- Two-tier: Top bar (shipping info, account), main nav (logo, search, cart)
- Mobile: Hamburger menu with slide-out drawer

### Product Cards
- Image with 4:3 aspect ratio container
- Product name, price, quick-add cart button
- Hover: subtle elevation (shadow-lg)
- Rating stars and stock indicator

### Product Detail Page
- Two-column layout: Image gallery (60%) + Product info (40%)
- Gallery: Main image + thumbnail strip below
- Info panel: Title, price, rating, variant selectors, quantity, add-to-cart CTA
- Tabs below: Description, Specifications, Reviews

### Shopping Cart
- Slide-out panel (right side) or dedicated page
- Line items: thumbnail, name, variant, quantity selector, price, remove
- Sticky footer: Subtotal, taxes, shipping estimate, checkout CTA

### Checkout Flow
- Multi-step or single-page layout
- Left: Form sections (Contact, Shipping, Payment)
- Right: Sticky order summary with itemized costs
- Progress indicator at top
- Trust badges near payment section

### Admin Dashboard
- Sidebar navigation with sections (Products, Orders, Shipping, Settings)
- Data tables with search, filters, pagination
- Action buttons in table rows (Edit, Delete, Export)
- Bulk upload: Drag-drop zone with CSV template download
- Forms: Two-column layout for product entry with image upload previews

### Category/Product Listing
- Breadcrumbs at top
- Left sidebar: Filters (price, category, attributes)
- Right: Product grid with sort dropdown
- Pagination at bottom

### Footer
- Four-column layout: Company info, Shop links, Support, Newsletter signup
- Payment method icons, trust badges
- Copyright and legal links

---

## Interaction Patterns

### Navigation
- Mega-menu on hover for categories (desktop)
- Search with autocomplete suggestions
- Cart icon shows item count badge

### Product Interactions
- Quick-view modal for product preview
- Image zoom on hover/click in product detail
- Variant selection updates price and availability
- Add-to-cart with success toast notification

### Forms
- Inline validation with error messages
- Loading states on submit buttons
- Auto-save in admin forms

### Admin Features
- Sortable table columns
- Inline editing where possible
- Confirmation modals for destructive actions
- Bulk selection checkboxes

---

## Images Strategy

### Required Images
1. **Homepage Hero**: Full-width banner (1920x600px) showcasing featured collection or sale
2. **Product Photos**: High-quality images (800x800px minimum), multiple angles
3. **Category Headers**: Banner images for category pages
4. **Trust Signals**: Payment logos, shipping partner logos in footer

### Placement
- Hero section: Above the fold with CTA overlays on blurred background
- Product grids: Consistent aspect ratios with lazy loading
- Product detail: Gallery with zoom capability
- Admin: Image upload previews with crop/resize options

Use placeholder services for demo: `https://placehold.co/800x800` for products

---

## Accessibility & Standards
- ARIA labels on all interactive elements
- Keyboard navigation support (tab order, escape to close modals)
- Form inputs with associated labels
- Alt text for all product images
- Color contrast ratios meeting WCAG AA standards (handled in color phase)

---

## Icons
**Library**: Heroicons via CDN (outline for nav, solid for actions)
- Shopping cart, search, user account, menu
- Chevrons for dropdowns, arrows for navigation
- Check marks for confirmations, X for close/remove

---

## Performance Considerations
- Lazy load product images below fold
- Paginate product listings (24-48 per page)
- Optimize admin tables with virtual scrolling for 100+ items
- Image CDN with responsive sizes