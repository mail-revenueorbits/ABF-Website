# Design

AB Furniture and Furnishing -- Premium furniture retailer website. Dark + Orange + Wood Tones aesthetic blending Traditional & Heritage, Warm & Luxurious, and Minimal & Modern sensibilities. Mobile-first, image-led, editorial-commerce hybrid.

## Color

### Brand Primary -- Orange `#E8501A`

The signature brand orange, used for CTAs, accent highlights, overline text, active states, and trust-signal icons. Warm and bold without veering into retail-discount territory.

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#FFF5F0` | Badge backgrounds, subtle tint |
| `primary-100` | `#FFE8DC` | Hover tint, light accent bg |
| `primary-200` | `#FFD0B8` | Decorative quote marks |
| `primary-300` | `#FFB08A` | Banner title emphasis (italic) |
| `primary-400` | `#FF8652` | Side card tags, hover CTA text, light-on-dark accent |
| `primary-500` | `#E8501A` | **Brand primary.** Buttons, overlines, active states, icons, focus rings |
| `primary-600` | `#D04516` | WhatsApp CTA banner bg, gradient start |
| `primary-700` | `#AD3812` | Hover/active on primary buttons, dark variant |
| `primary-800` | `#8C2E10` | Deep accent, rarely used |
| `primary-900` | `#732611` | Reserved for extreme contrast |
| `primary-950` | `#3E1208` | Near-black warm tint |

### Wood -- Warm Brown `#A0522D`

Sheesham/Teak-inspired brown tones. Used for secondary text, ghost buttons, price display, footer accents, and logo text. Establishes the material warmth of the brand.

| Token | Hex | Usage |
|---|---|---|
| `wood-50` | `#FAF6F1` | Badge backgrounds |
| `wood-100` | `#F0E8DC` | Light brown tint |
| `wood-200` | `#E0CDB6` | Decorative borders |
| `wood-300` | `#CDAC89` | Muted accents |
| `wood-400` | `#B8895E` | Light wood tone |
| `wood-500` | `#A0522D` | **Brand wood.** Product material labels, ghost button text |
| `wood-600` | `#8B4513` | Nav links, logo, price text, ghost/text buttons, view-all links |
| `wood-700` | `#6F3710` | Strong wood accent |
| `wood-800` | `#5A2E11` | Secondary text color |
| `wood-900` | `#4A2610` | Deep warm tone for shadows |
| `wood-950` | `#291308` | Near-black warm |

### Dark -- Charcoal `#141414`

The primary dark palette. Used for dark sections, header/footer backgrounds, button fills, and primary text color.

| Token | Hex | Usage |
|---|---|---|
| `dark-50` | `#F5F5F5` | Light neutral |
| `dark-100` | `#E8E8E8` | Subtle borders |
| `dark-200` | `#D4D4D4` | Dividers |
| `dark-300` | `#B0B0B0` | Disabled state |
| `dark-400` | `#888888` | Muted UI, search icons, placeholder text |
| `dark-500` | `#616161` | Secondary text |
| `dark-600` | `#424242` | Mid-dark |
| `dark-700` | `#2E2E2E` | Mobile category label text |
| `dark-800` | `#1E1E1E` | **Dark section bg.** Footer, trust section, materials section |
| `dark-900` | `#141414` | **Carbon/primary text.** Body text, dark button fills, hero card bg |
| `dark-950` | `#0A0A0A` | Near-black |

### Ivory -- Warm Neutral `#FBF9F5`

Warm off-white backgrounds. The primary surface color for the site, replacing cold pure white.

| Token | Hex | Usage |
|---|---|---|
| `ivory-50` | `#FEFDFB` | Lightest surface |
| `ivory-100` | `#FBF9F5` | **Primary surface.** Body background, inverse text, footer text |
| `ivory-200` | `#F5F0E8` | Skeleton shimmer, image placeholders, disabled inputs, newsletter bg |
| `ivory-300` | `#EBE4D8` | Heavier neutral |
| `ivory-400` | `#DDD3C2` | Borders on hover |
| `ivory-500` | `#C9BBAA` | Mid-neutral |
| `ivory-600` | `#A8977F` | Muted elements |
| `ivory-700` | `#8A7A65` | **Muted text.** Subtitles, helper text, captions |
| `ivory-800` | `#6D614F` | Deeper muted |
| `ivory-900` | `#534A3C` | Dark warm |
| `ivory-950` | `#2E2820` | Near-black warm |

### Semantic Colors

| Role | Token | Hex | Usage |
|---|---|---|---|
| Success | `success-500` | `#22C55E` | In-stock indicators |
| Error | `error-500` | `#EF4444` | Form validation, out-of-stock |
| Warning | `warning-500` | `#F59E0B` | Star ratings, low-stock |
| Info | `info-500` | `#3B82F6` | Informational badges |
| WhatsApp | `whatsapp` | `#25D366` | WhatsApp floating button, CTA |
| Sale red | -- | `#C41E3A` | Sale badges, wishlisted hearts |

### Semantic Token Aliases

```
--brand-primary: primary-500          (#E8501A)
--brand-primary-light: primary-400    (#FF8652)
--brand-primary-dark: primary-700     (#AD3812)
--brand-wood: wood-500                (#A0522D)
--brand-wood-light: wood-400          (#B8895E)
--brand-wood-dark: wood-700           (#6F3710)
--brand-dark: dark-900                (#141414)
--brand-carbon: dark-800              (#1E1E1E)

--text-primary: dark-900              (#141414)
--text-secondary: wood-800            (#5A2E11)
--text-muted: ivory-700               (#8A7A65)
--text-inverse: ivory-100             (#FBF9F5)
--text-accent: primary-500            (#E8501A)

--surface-primary: ivory-100          (#FBF9F5)
--surface-dark: dark-800              (#1E1E1E)
--surface-card: #FFFFFF
--surface-elevated: rgba(255,255,255,0.85)

--border-light: rgba(160,82,45,0.08)
--border-medium: rgba(160,82,45,0.15)
--border-strong: wood-500
--border-dark: rgba(251,249,245,0.1)
```

## Typography

### Font Stack

| Role | Family | Fallbacks |
|---|---|---|
| Display / Headings | `Playfair Display` | Georgia, Times New Roman, serif |
| Body / UI | `Helvetica` | Helvetica Neue, Arial, Nimbus Sans L, Liberation Sans, sans-serif |
| Icons | `Material Symbols Outlined` | -- (icon font, `FILL` 0, `wght` 300 default) |

Playfair Display is loaded via Google Fonts in `<head>`. Helvetica uses the system font stack (no import). The pairing creates a classic editorial feel: serif for display hierarchy, clean sans for readability.

### Type Scale

| Class | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display-grand` | clamp(48px, 6vw, 88px) | 400 | 1.02 | -0.03em | Grand hero headlines (unused currently) |
| `display-hero` | clamp(40px, 5vw, 72px) | 400 | 1.05 | -0.02em | Hero headlines |
| `heading-1` | clamp(32px, 3.5vw, 52px) | 400 | 1.1 | -0.01em | Page titles |
| `heading-2` | clamp(26px, 2.5vw, 40px) | 400 | 1.15 | -- | Section titles |
| `heading-3` | clamp(20px, 2vw, 28px) | 500 | 1.25 | -- | Card titles, subsections |
| `body-xl` | 20px | 300 | 1.7 | -- | Lead paragraphs |
| `body-lg` | 18px | 400 | 1.7 | -- | Featured body text |
| `body-md` | 16px | 400 | 1.6 | -- | Default body text (base) |
| `body-sm` | 14px | 400 | 1.5 | -- | Secondary content, footer links |
| `caption` | 12px | 400 | 1.4 | -- | Captions, helper text (muted color) |
| `overline` | 12px | 600 | -- | 0.25em | Section overlines, UPPERCASE |
| `overline-lg` | 13px | 600 | -- | 0.2em | Larger overlines, UPPERCASE |
| `label` | 12px | 600 | -- | 0.08em | Form labels, filter titles, UPPERCASE |
| `price` | -- | 600 | -- | -- | Product prices (wood-600 color) |
| `price-strike` | -- | 400 | -- | -- | Original price (strikethrough, muted) |
| `price-sale` | -- | 700 | -- | -- | Sale price (primary-500 color) |

### Heading Pattern in Sections

Section headers follow a consistent pattern:
1. **Overline** -- 11px, weight 600, letter-spacing 0.2em, uppercase, primary-500 color, preceded by a 32px horizontal line
2. **Title** -- Playfair Display, clamp(28px, 3.5vw, 44px), weight 400
3. **Subtitle** -- 15px, weight 300, line-height 1.7, muted color, max-width 500px

## Layout

### Container System

| Utility | Max Width | Padding (Desktop) | Padding (Tablet) | Padding (Mobile) |
|---|---|---|---|---|
| `container` / `container-page` | 1440px | 80px | 40px | 24px |
| `container-narrow` | 1100px | 80px | 40px | 24px |
| `home-section__container` | 1440px | 60px (1200+) / 40px (769+) | -- | 24px |

### Section Spacing

| Token | Desktop (1200+) | Tablet | Mobile |
|---|---|---|---|
| `--section-gap` | 140px | 100px | 80px |
| `home-section` padding | 120px top/bottom | 100px | 80px |
| Section header margin-bottom | 64px (desktop) | -- | 48px (mobile) |

### Breakpoints

| Token | Value | Intent |
|---|---|---|
| `xs` | 480px | Small mobile |
| `sm` | 640px | Large mobile / small tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1440px | Max container width |
| `3xl` | 1600px | Ultra-wide |

Primary breakpoints used in practice: **640px** (2-col grid), **768px/769px** (mobile/desktop split, nav switch), **1024px** (sidebar layout, 3-col grids), **1200px** (hero sizing), **1440px** (hero max-width).

### Grid Patterns

- **Product grids:** 2-col (mobile) -> 2-col (640px) -> 3-col (900px+)
- **Category cards:** 2-col (mobile) -> 3-col (640px) -> 5-col (1024px)
- **Trust pillars:** 1-col -> 2-col (640px) -> 4-col (1024px)
- **Testimonials:** 1-col -> 3-col (768px)
- **Material cards:** 1-col -> 2-col (640px) -> 3-col (1024px)
- **Shop layout:** Full-width (mobile) -> 240px sidebar + fluid main (1024px+)
- **Hero desktop:** 2-col grid `1fr 0.42fr`, 560-600px height

## Components

### Buttons

All buttons use Helvetica, uppercase, letter-spacing 0.12em, font-size 12px, weight 700. Three sizes: `btn-sm` (10px/20px padding), default (16px/36px), `btn-lg` (20px/48px).

| Variant | Background | Text | Border | Hover Behavior |
|---|---|---|---|---|
| `btn-primary` | primary-500 | white | primary-500 | Dark-900 slides in from left, text becomes primary-400, orange glow shadow, -2px lift |
| `btn-secondary` | transparent | ivory-100 | ivory-100 @ 40% | Fills ivory-100, text dark-900, -2px lift |
| `btn-outline-dark` | transparent | dark-900 | dark-900 | Fills dark-900, text ivory-100, -2px lift |
| `btn-outline-primary` | transparent | primary-500 | primary-500 | Fills primary-500, text white, orange glow, -2px lift |
| `btn-ghost` | none | wood-600 | none | Underline grows from left, gap widens 8->14px, color primary-500 |
| `btn-text` | none | wood-600 | none | Underline grows from left, gap widens |
| `btn-whatsapp` | whatsapp green | white | none | Darker green, -2px lift, green glow shadow |

### Cards

**Product Card (`pc-card`):**
- 3:4 aspect ratio image container
- Lifestyle image visible by default, studio (white bg) image revealed on hover via opacity swap
- Wishlist button (bottom-right) appears on hover, always visible on touch devices
- "View Details" overlay fades in from bottom on hover
- Tag badge (top-left): frosted glass `rgba(248,245,241,0.92)` + backdrop-blur
- Sale badge (top-right): `#C41E3A` red
- Info: material label (11px uppercase, success-700 green) -> name (Playfair 17px) -> price (15px, wood-500)
- Whole card lifts -4px on hover

**Category Card (`cat-card`):**
- 4:5 aspect ratio, 10px border-radius
- Full-bleed image with gradient overlay (transparent -> dark 75%)
- Content at bottom: count (10px, primary-400) -> name (Playfair 20px, white) -> "Explore" link (appears on hover)
- Image scales 1.06 on hover

**Material Card:**
- Fixed height 380px (mobile) / 440px (desktop), 10px radius
- Image at 70% brightness, scales + brightens on hover
- Content: label (10px, primary-500) -> name (Playfair 24px, ivory) -> description -> CTA (appears on hover)

**Testimonial Card:**
- White background, light border, 10px radius
- Large quote mark in primary-200
- Star rating (Material Symbols, filled, warning-500 gold)
- Author row: circular avatar (ivory-200 bg, Playfair initials) + name + role

### Header

Two-state sticky header with glassmorphism:
- **Default:** Two-row layout. Top row: search (left), logo centered (Playfair Display, wood-600), phone + wishlist (right). Bottom row: category nav links centered.
- **Scrolled (>80px):** Single row. Logo shrinks left, nav stays center, actions compress right. Background becomes `rgba(255,255,255,0.97)`.
- **Mobile (<768px):** Hamburger (left), logo (center), search + wishlist (right). Slide-in menu from left.
- Background: `rgba(251,249,245,0.92)` + `blur(20px)`
- Nav links: 12px, weight 600, uppercase, 0.12em spacing, muted color. Underline from left on hover (primary-500).

### Footer

- Dark background (`dark-800`) with subtle orange gradient line at top
- Brand column: logo + description (max-width 320px)
- Link columns: 11px uppercase titles, 14px weight-300 links
- Phone in primary-500, WhatsApp in whatsapp green
- Bottom bar: copyright + meta links, divided by `rgba(251,249,245,0.06)` border

### Hero Section

**Desktop:** 3-card grid (main carousel left `1fr` + 2 stacked static cards right `0.42fr`), 560-600px height, 14px border-radius. Side cards have gradient overlay, hover lifts -4px with enhanced shadow.

**Mobile:** Search bar (15px font, 10px radius) -> Category circles (62px diameter, scrollable rows) -> Multiple carousel sections (210px height, 12px radius, auto-rotating slides with dot indicators) -> WhatsApp CTA banner (orange gradient).

### Form Inputs

- Padding: 14px 18px
- Border: 1px solid `--border-medium`
- Focus: primary-500 border + `0 0 0 3px rgba(232,80,26,0.1)` ring
- Labels: 12px, weight 600, uppercase, 0.06em spacing
- Error: error-500 border + red ring
- Select: custom chevron SVG (ivory-700 stroke)

### WhatsApp Floating Button

- Fixed bottom-right (24px offset, 16px on mobile)
- 60px circle (52px mobile), whatsapp green, white SVG icon
- Green glow shadow, scales 1.08 + lifts -2px on hover
- z-index: 999

## Spacing

### Spacing Tokens

Standard Tailwind 4 spacing plus custom additions:

| Token | Value | Common Usage |
|---|---|---|
| `spacing-18` | 4.5rem (72px) | -- |
| `spacing-88` | 22rem | -- |
| `spacing-92` | 23rem | -- |
| `spacing-100` | 25rem | -- |
| `spacing-120` | 30rem | -- |
| `spacing-140` | 35rem | -- |
| `spacing-160` | 40rem | -- |

### Layout Tokens

| Token | Desktop | Tablet | Mobile |
|---|---|---|---|
| `--margin-edge` | 80px | 40px | 24px |
| `--gutter` | 24px | 24px | 16px |
| `--section-gap` | 140px | 100px | 80px |

### Common Spacing Patterns

- Section padding: 120px / 100px / 80px (responsive)
- Section header to content: 64px / 48px
- Card body padding: 20px
- Card content (overlayed): 28px (material), 22px (side), 20px (category)
- Button gap between icon and text: 10px (default), 6px (sm), 12px (lg)
- Form group margin-bottom: 24px
- Footer top padding: 128px, link gap: 14px

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 2px | Badges |
| `radius-sm` | 4px | WhatsApp button, carousel dots, tags |
| `radius-md` | 6px | -- |
| `radius-lg` | 8px | -- |
| `radius-xl` | 12px | CTA banner, mobile carousels |
| `radius-2xl` | 16px | -- |
| `radius-3xl` | 24px | -- |
| 10px | -- | Category cards, material cards, testimonial cards (commonly used inline) |
| 14px | -- | Hero cards, hero main card |

**Note:** Despite having a radius token scale, most components use hardcoded values (10px, 12px, 14px) rather than tokens. Buttons have NO border-radius by default (sharp rectangles) -- this is intentional for the premium aesthetic.

## Shadows

All shadows use warm-tinted `rgba(74,38,16,...)` instead of neutral black, reinforcing the wood-tone brand warmth.

| Token | Value | Usage |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(74,38,16,0.05)` | Subtle elevation |
| `shadow-sm` | `0 1px 3px ..., 0 1px 2px ...` | Default card resting |
| `shadow-md` | `0 4px 6px -1px ...` | Moderate lift |
| `shadow-lg` | `0 10px 15px -3px ...` | Emphasized elements |
| `shadow-xl` | `0 20px 25px -5px ...` | High elevation |
| `shadow-2xl` | `0 25px 50px -12px rgba(74,38,16,0.16)` | Maximum depth |
| `shadow-product` | `0 8px 30px rgba(74,38,16,0.10)` | Product card emphasis |
| `shadow-card-hover` | `0 16px 40px rgba(74,38,16,0.14)` | Card hover state |
| `shadow-orange-glow` | `0 12px 32px rgba(232,80,26,0.25)` | Primary button hover, WhatsApp CTA |

## Motion & Animation

### Easing Curves

| Token | Value | Usage |
|---|---|---|
| `--ease-smooth` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary easing. Buttons, cards, reveals |
| `--ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` | Scroll reveals, menu slide-in, hero transitions |
| `--ease-in-out` | `cubic-bezier(0.45, 0, 0.55, 1)` | Hero zoom, scroll line |

### Duration Tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 200ms | Quick state changes |
| `--duration-normal` | 400ms | Link hovers, input focus, icon transitions |
| `--duration-slow` | 700ms | Button fills, card lifts, underline grows, image scale |
| `--duration-cinematic` | 1s | Image zoom on card hover, scroll reveal |

### Keyframe Animations

| Name | Duration | Usage |
|---|---|---|
| `fade-in` | 0.6s | General fade entrance |
| `fade-up` | 0.7s | Element entrance from below (30px) |
| `slide-in-right` | 0.6s | Element entrance from right (20px) |
| `shimmer` | 1.5s infinite | Skeleton loading states |
| `hero-zoom` | 20s alternate | Slow background image zoom (1.05 -> 1.12) |
| `scroll-line` | 2s infinite | Decorative scroll indicator |
| `pulse-soft` | 2s infinite | Subtle opacity pulse (1 -> 0.7) |
| `menuFadeIn` | 0.3s | Mobile overlay backdrop |
| `menuSlideIn` | 0.35s | Mobile menu slide from left |

### Scroll Reveal System

Two reveal systems are in use:

1. **Homepage (`home-reveal`):** opacity 0 -> 1, translateY(32px -> 0), 0.8s duration, with staggered delays (`--delay-1` through `--delay-5`, 100ms increments). Triggered by `IntersectionObserver` adding `.is-visible` class.

2. **Global (`reveal`):** opacity 0 -> 1, translateY(40px -> 0), cinematic duration (1s). Triggered by adding `.revealed` class. Delays 100-400ms.

### Hover Patterns

- **Cards:** translateY(-4px to -6px) lift + enhanced shadow
- **Images:** scale(1.03 to 1.06) zoom
- **Buttons:** translateY(-2px) lift + background fill animation + shadow glow
- **Ghost buttons:** underline grows from width 0 to 100%, gap expands 8px to 14px
- **Nav links:** color change + underline grows from left
- **Side card content:** translateY(-8px) + CTA fades in from below

## Icons

Material Symbols Outlined with default settings:
- `font-variation-settings: 'FILL' 0, 'wght' 300`
- Size: 24px default, adjusted per context (18px in headers, 16-20px in buttons, 28-36px for pillar/trust icons)
- Filled variant (`'FILL' 1`) used for: star ratings, wishlisted hearts
- Lighter weight (`'wght' 200`) used for: pillar icons, trust icons

Common icons used: `search`, `favorite_border`, `call`, `menu`, `close`, `chat`, `workspace_premium`, `forest`, `design_services`, `verified_user`, `star`.

## Patterns

### Dark/Light Section Alternation

The homepage alternates between light (ivory-100 surface) and dark (dark-800 background) sections:
- Categories: light
- Featured Products: light
- Why Choose Us: **dark**
- Shop by Material: **dark**
- Testimonials: light
- CTA Banner: dark (within light section)

Dark sections use ivory-100 for text, `rgba(251,249,245,0.45-0.6)` for muted text, and `rgba(251,249,245,0.06)` for subtle dividers.

### Image Treatment

- Product images: 3:4 aspect ratio, `object-fit: cover`
- Category/material images: full-bleed with gradient overlay (transparent at top -> dark at bottom)
- Hero images: full-bleed within rounded cards
- Lifestyle vs Studio swap on product cards (hover)
- Dark image filter (`brightness(0.7)`) on material cards, lightens to 0.8 on hover

### Price Display

Format: `NPR XX,XXX` with tabular-nums for alignment. Font: Helvetica, weight 600, wood-600 color. Sale prices in primary-500 (or `#C41E3A` red for badges). Original price has strikethrough in muted color.

### Overline + Title Pattern

Used consistently across all sections:
```
[horizontal line 32px] OVERLINE TEXT    <- 11px, 600, 0.2em spacing, primary-500
Section Title Here                      <- Playfair Display, clamp responsive
Supporting subtitle text below.         <- 15px, 300, muted, max-width 500px
```

### WhatsApp Integration

Every major section and page has a path to WhatsApp:
- Floating button (always visible, bottom-right)
- CTA banner at page bottom
- Mobile hero banner
- Header phone link
- Mobile menu contact links
- Product pages: "Buy" button pre-fills WhatsApp message with product details
