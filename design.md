# Design System

This document describes the visual design system currently implemented in the codebase.
It is generated from the CSS in `src/assets/css/` and reflects what's actually built, not
aspirational guidelines. Update it when the underlying CSS changes.

## Architecture

CSS is authored in layers and compiled with PostCSS (`postcss-import` + `postcss-nesting`).

```
src/assets/css/
├── main.css              # @layer order + imports
└── layers/
    ├── reset.css         # layer: reset
    ├── base.css          # layer: base — tokens + global element styles
    ├── layout.css        # layer: layout — layout primitives (.l-*)
    ├── components.css    # layer: components — reusable UI components
    └── pages.css         # layer: pages — page-specific overrides
```

Cascade layer order (low → high specificity precedence):

```css
@layer reset, base, layout, components, pages;
```

Later layers always win over earlier ones regardless of selector specificity. This means
`pages` can override `components`, which can override `layout`, etc., without needing
`!important` or selector games.

**No Tailwind, no utility-class framework.** Semantic class names only, scoped per
component/page. Nesting (native CSS via `postcss-nesting`) is used for child-element and
`:hover`/state selectors within a component's own rule block.

## Responsive strategy

**Container queries are the primary responsive mechanism**, not media queries. Media
queries are reserved for global, page-level layout shifts (e.g. switching the whole nav
from desktop to mobile, or a sidebar collapsing to a stacked layout).

Example — a card that reflows based on the width of its grid cell, not the viewport:

```css
.project-card-wrap {
  container-type: inline-size;
  container-name: card;
}

@container card (width >= 36rem) {
  .project-card {
    grid-template-columns: 1fr 1fr;
  }
}
```

Media query breakpoints used for global shifts: `48rem` (768px), `56rem` (896px),
`64rem` (1024px), `72rem` (1152px). There is no fixed breakpoint scale — each is chosen
contextually per layout.

## Design tokens

All tokens are CSS custom properties defined on `:root` in `base.css`.

### Color

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-bg` | `#fafaf8` | `#141412` | Page background |
| `--color-bg-subtle` | `#f0ede8` | `#1e1d1b` | Card/image placeholder backgrounds, hover fills |
| `--color-text` | `#111110` | `#f0ede8` | Primary text |
| `--color-text-muted` | `#6b6860` | `#9c9790` | Secondary text, labels, metadata |
| `--color-accent` | `#5c4b3b` | `#c8956a` | Links, emphasis, active states |
| `--color-accent-light` | `#e8ddd5` | `#2a2118` | Subtle accent fills (gradients) |
| `--color-border` | `#e2ddd8` | `#2e2c29` | Hairline borders, dividers |

Dark mode is toggled via `[data-theme="dark"]` on a root element, which overrides the
token values above. Components should always consume tokens, never hardcode colors, so
theming stays automatic.

The only hardcoded colors outside the token set are one-off overlay treatments (e.g.
`gallery-card__count`'s `rgba(0,0,0,0.5)` scrim, which is theme-independent by design)
and the per-category accent colors below.

### Category accent colors

Used for Design Seed cards/heroes to visually distinguish categories. Set via inline
`--seed-accent` on `[data-category]`, independent of light/dark theme:

| Category | Color |
|---|---|
| `layout` | `#7c8f4e` (olive green) |
| `typography` | `#4a7ba0` (blue) |
| `color` | `#b06b3a` (burnt orange) |
| `motion` | `#7a5e8a` (purple) |
| `interaction` | `#3d8a7a` (teal) |
| `philosophy` | `#8a6b3d` (brown/gold) |

### Typography

```
--font-serif: "Playfair Display", Georgia, "Times New Roman", serif;
--font-sans:  "Source Sans 3", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono:  "SF Mono", "Fira Code", "Cascadia Code", monospace;
```

- **Serif (Playfair Display)** — all headings (`h1`–`h6`), card/hero titles, timeline
  years, emphasis (`em`) inside marketing copy. Always `font-weight: normal` — the serif
  carries visual weight on its own; bolding it is never used.
- **Sans (Source Sans 3)** — body copy, nav, buttons, form fields. The default `body`
  font.
- **Mono (SF Mono)** — small uppercase labels with heavy letter-spacing (e.g.
  `.about-skills__heading`), and inline `code` in prose.

Fluid type scale via `clamp()`, so sizes respond to viewport width without breakpoints:

| Token | Range |
|---|---|
| `--text-xs` | 0.75rem → 0.875rem |
| `--text-sm` | 0.875rem → 1rem |
| `--text-base` | 1rem → 1.125rem |
| `--text-lg` | 1.125rem → 1.375rem |
| `--text-xl` | 1.25rem → 1.75rem |
| `--text-2xl` | 1.5rem → 2.5rem |
| `--text-3xl` | 2rem → 3.5rem |
| `--text-4xl` | 2.5rem → 5rem |

Heading defaults: `h1`→`--text-4xl`, `h2`→`--text-2xl`, `h3`→`--text-xl`, `h4`→`--text-lg`,
all with `line-height: 1.15` and `letter-spacing: -0.01em`.

Recurring typographic conventions:
- Uppercase eyebrow/label text uses `letter-spacing: 0.08em`–`0.12em` at `--text-xs` or
  `--text-sm`, colored `--color-text-muted`.
- Body line-height is `1.6` globally, `1.5`–`1.8` in specific prose contexts.

### Spacing

4px base scale, all as `rem`:

```
--space-1: 0.25rem   --space-8:  2rem
--space-2: 0.5rem    --space-10: 2.5rem
--space-3: 0.75rem   --space-12: 3rem
--space-4: 1rem      --space-16: 4rem
--space-5: 1.25rem   --space-20: 5rem
--space-6: 1.5rem    --space-24: 6rem
                     --space-32: 8rem
```

Used for gaps, padding, and margins everywhere — no arbitrary pixel/rem values appear in
component code.

### Layout

```
--max-width-content: 72rem   /* overall page/wrapper cap */
--max-width-prose:   68ch    /* comfortable reading measure */
```

### Motion

```
--duration-fast: 120ms   /* hover states, color/border transitions */
--duration-base: 220ms   /* image scale/transform transitions */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1)
```

Transitions are used sparingly and consistently: color/border-color on hover
(`--duration-fast`, plain `ease`), and transform (image zoom) on hover
(`--duration-base`, `--ease-out`).

## Layout primitives (`.l-*`)

Generic, composable layout classes defined in `layout.css`. These are the building
blocks every page is assembled from — reach for one of these before writing bespoke
layout CSS for a new page.

| Class | Purpose |
|---|---|
| `.l-wrapper` | Centers content, caps at `--max-width-content`, responsive inline padding |
| `.l-site` | Grid shell: sticky header / flexible main / footer |
| `.l-stack` | Vertical flex stack with `--space-6` gap |
| `.l-section` | Standard block padding (`--space-12`) for page sections |
| `.l-sidebar` | Sidebar + main grid; single column until `64rem`, then `18rem 1fr` |
| `.l-grid` | Auto-fill card grid, `minmax(min(100%, 22rem), 1fr)` |
| `.l-prose` | Centered column capped at `--max-width-prose` |
| `.l-prose--flush` | Same as `.l-prose` but left-aligned (no auto-centering) |

## Components (`components.css`)

Reusable, page-agnostic UI pieces. Naming follows BEM-ish `block__element--modifier`.

- **Site header/nav** (`.site-header`, `.site-logo`, `.site-nav`, `.nav-toggle`) —
  sticky, blurred-glass background (`color-mix` + `backdrop-filter`), collapses to a
  toggled mobile panel below `64rem`.
- **Theme toggle** (`.theme-toggle`) — circular icon button; sun/moon icons swapped via
  `[data-theme="dark"]`.
- **Site footer** (`.site-footer`, `.footer-social`).
- **Cards** — three card families, all `container-type: inline-size` where they need to
  reflow independent of viewport:
  - `.project-card` — image + meta, becomes 2-column inside wide containers (`@container
    card (width >= 36rem)`).
  - `.post-card` — bordered card with image, date, title, summary; border and title
    color shift on hover.
  - `.gallery-card` — bordered image card with a photo-count badge overlay.
- **Gallery detail** (`.gallery-hero`, `.photo-grid`) — masonry-style CSS columns (2 →
  3 → 4 across breakpoints), items use `break-inside: avoid`.
- **Hero** (`.hero`, `.hero__eyebrow`, `.hero__headline`, `.hero__body`,
  `.hero__actions`) — generic page-top hero block.
- **Buttons** (`.btn`, `.btn--primary`, `.btn--secondary`) — `border: 1px solid
  currentColor`, 2px radius, no shadows. Primary is filled/inverted, secondary is
  outlined/ghost.
- **Section label / header** (`.section-label`, `.section-header`) — uppercase eyebrow
  + flex header row pattern reused across index pages.
- **Tag/pill** (`.tag`) — small muted uppercase pill.
- **Design Seed card** (`.seed-card`) — bordered card with a colored top border keyed to
  `[data-category]` via the `--seed-accent` custom property pattern (see Category accent
  colors above).
- **Divider** (`.divider`) — plain `hr`-style rule with large block margin.

## Page-specific styles (`pages.css`)

Overrides and one-off layouts scoped to a single page/template, layered above
`components` so they can safely override component defaults without upping specificity:

- Work index (`.work-category__divider`)
- Case study detail (`.case-study-hero`, `.case-study-meta`, `.case-study-image`) —
  two-column hero (text + portrait image) above `48rem`, metadata as a bordered
  `<dl>` grid.
- Design Seeds listing/detail (`.seeds-page-title`, `.seed-hero`, `.seed-meta`) —
  mirrors the case study detail pattern.
- About page (`.about-hero`, `.about-intro`, `.about-timeline`, `.about-skills`,
  `.about-footer-cta`) — a stack of full-bleed sections each separated by
  `border-block-end`, alternating 1-col/2-col (`1fr 2fr` label+content) grids above
  `48rem`.
- Gear page (`.gear-page`, `.gear-category`, `.gear-item`) — sticky category label
  (`position: sticky`) beside an auto-fill item grid, above `56rem`.
- Contact page (`.contact-form`, `.form-field`) — bordered inputs, accent-colored focus
  ring via `border-color` swap (no glow/shadow).

## Recurring visual patterns

- **Borders over shadows.** No `box-shadow` appears anywhere in the component/page
  layers. Depth and separation are communicated entirely with 1px `--color-border`
  hairlines and background-color contrast (`--color-bg` vs `--color-bg-subtle`).
- **Small border-radius.** 2px–4px throughout (`.btn`, `.tag`, cards, form fields);
  circular only for the theme toggle and the About page portrait.
- **Hover = color/border shift + subtle image zoom.** Interactive elements transition
  `color`/`border-color` (fast, `ease`) and card images scale to `1.02`–`1.03` (base
  duration, `--ease-out`). No opacity fades, no shadows-on-hover.
- **Uppercase micro-labels.** Category tags, eyebrows, and metadata labels are
  consistently `text-transform: uppercase` + wide `letter-spacing` at `--text-xs`/`sm`,
  colored `--color-text-muted` (or a category accent).
- **Serif for identity, sans for utility.** Anything meant to feel editorial/branded
  (headings, titles, pull quotes, timeline years) is serif; anything functional (nav,
  labels, forms, buttons) is sans.
- **`:focus-visible` only**, never a generic `:focus` outline — keeps mouse users free
  of focus rings while keeping keyboard navigation accessible (2px solid
  `--color-accent`, offset 3px).
- **Prose is a scoped concern.** `.prose` only styles children (`h2`, `h3`, lists,
  blockquote, inline `code`) — it doesn't restyle the page around it, so it composes
  safely inside case studies, seeds, and any future long-form content.
