# Interactive Reverse-Scroll Portfolio Gallery

An immersive, full-screen vertical gallery modal triggered when clicking **VIEW GALLERY →** on the Portfolio slide, featuring opposing-direction column scrolling inspired by the CSS reverse-scroll pattern, seamless mouse wheel and finger-swipe inertia, and an unobstructed fullscreen lightbox for inspecting individual tattoo pieces.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design choices have been confirmed from your responses and incorporated into the architecture below:

- **Confirmed Decision 1 — Responsive Column Architecture**: **3 columns on desktop** (outer columns scroll in reverse from bottom-to-top while the center column scrolls normally from top-to-bottom) and **2 opposing columns on mobile** (left column scrolls normally, right column scrolls in reverse) to maintain generous image scale and touch legibility on smaller viewports.
- **Confirmed Decision 2 — Fullscreen Piece Detail Lightbox**: Clicking or tapping any tattoo card inside the reverse-scroll columns opens a high-resolution **fullscreen lightbox** displaying the piece title, style classification, placement, session duration, and healed/fresh notes with keyboard (`ESC`, left/right arrow) and touch navigation.
- **Confirmed Decision 3 — Curated Darkwork & Studio Imagery**: Combines existing studio photography with newly generated high-contrast darkwork, fine-line micro-realism, and blackwork tattoo imagery so every column has rich, authentic visual variety with zero broken links.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the static **VIEW GALLERY →** button on the `02 — VISUALS` slide into a portal that launches a full-viewport vertical scroll gallery overlay. As the user scrolls via mouse wheel, trackpad, or touch drag/swipe, adjacent vertical columns glide in opposite directions (`translateY` counter-motion), creating a kinetic editorial showcase.
- **Target Audience / Persona**: Prospective tattoo clients inspecting linework precision, ink saturation, and healed darkwork composition before booking a private session.
- **Key Value**: Delivers the tactile, counter-flowing visual rhythm of the CSS reverse-scroll showcase while ensuring rock-solid cross-browser compatibility, smooth spring physics on both desktop wheel and mobile touch swipes, and deep inspection of individual works.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Launching the Gallery**: Clicking **VIEW GALLERY →** on the Portfolio slide smoothly fades and scales in the fullscreen gallery overlay while locking background page scroll so horizontal slide progress remains untouched.
2. **Counter-Scrolling Exploration**:
   - Scrolling down (or swiping up with a finger on mobile) drives the primary scroll progress from `0` to `1`.
   - **Desktop (3 Columns)**: Column 1 (Left) and Column 3 (Right) start shifted upward (`-100% + viewportHeight`) and translate **downward** as the user scrolls down, while Column 2 (Center) scrolls **upward** naturally.
   - **Mobile (2 Columns)**: Column 1 (Left) scrolls upward naturally while Column 2 (Right) translates downward in reverse.
3. **Category Filtering**: A subtle, single-line segmented filter bar in the gallery header allows filtering or highlighting pieces by discipline (`All Works`, `Darkwork`, `Fine-Line`, `Realism`, `Healed`) without wrapping metadata in static pills.
4. **Inspecting a Piece (Lightbox)**: Clicking any image tile opens the **Piece Detail Lightbox** over the gallery, presenting the full uncropped artwork alongside unboxed editorial metadata (`Style · Placement · Session Hours · Status`), previous/next piece controls, and a direct **Inquire About Similar Concept** action that jumps to the Booking slide.
5. **Dismissing the Gallery**: Clicking the top-right `CLOSE [ESC]` button or pressing `Escape` cleanly exits the modal and restores the user's exact position on the Portfolio slide.

### Visual Identity & Theme
- **Aesthetic Direction**: Avant-garde brutalist monograph meets clinical darkwork studio—stark jet-black framing (`#050505`), razor-sharp hairline borders (`rgba(255,255,255,0.08)`), and high-contrast monochrome photography accented with signature ember orange (`#f27d26`).
- **Color Palette & Mood (60-30-10 Allocation)**:
  - **60% Dominant Neutral Canvas**: Deep obsidian `#050505` backdrop with subtle top/bottom edge vignette scrims (`from-[#050505] via-transparent to-[#050505]`) so columns emerge from and dissolve into darkness.
  - **30% Structural Surfaces**: `#0a0a0a` card frames, `1px` translucent white borders (`border-white/10`), and muted bone-white editorial captions (`text-white/60`).
  - **10% Accent Budget**: `#f27d26` reserved strictly for the active scroll progress indicator, interactive hover reticles, and primary action buttons.
- **Typography & Hierarchy**:
  - **Display Headings**: Bold geometric sans-serif (`font-sans font-black uppercase tracking-tighter`) for gallery headers and piece titles.
  - **Editorial Captions**: Italic `Playfair Display` (`font-serif italic`) for artist notes and anatomical placement context.
  - **Technical Indices**: Tabular monospace numerals (`font-mono tabular-nums`) for catalog indices (`01 / 12`) and scroll percentage readouts, using clean unboxed separators (`·`) with zero static pill badges.
- **Interactive Feedback & Motion**:
  - Compositor-only animations (`transform: translate3d`, `opacity`) driven by smoothed spring interpolation (`useSpring`) so both rapid mouse-wheel ticks and mobile finger flicks glide effortlessly without layout thrashing.
  - Hovering a card gently scales the artwork (`scale-105` over `200ms`) and reveals a subtle corner reticle with the piece index and title.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Spring-Driven Scroll Progress + Native Container Scroll vs. CSS-Only `animation-timeline: scroll()`**
  - *Chosen Approach*: Combine a native scrollable overlay container (`overflow-y: scroll`) with reactive scroll progress tracking (`useScroll` + `useSpring` + `useTransform`) that drives the reverse `y` transform on the outer/alternate columns, paired with CSS `animation-timeline: scroll(root)` progressive enhancement where supported.
  - *Why*: Pure CSS `animation-timeline` has inconsistent behavior inside nested fixed modal containers on iOS Safari and certain mobile WebViews. Driving the reverse column translation from the modal container's real scroll progress guarantees identical, buttery-smooth mouse wheel, scrollbar drag, trackpad two-finger scroll, and mobile touch-swipe physics on every device.
  - *Alternatives Considered*: Pure CSS `@keyframes` with `animation-timeline` alone (rejected due to nested overflow quirks on mobile Safari) or intercepting raw `wheel` events without a native scroll container (rejected because it breaks native iOS momentum scrolling).
- **Decision 2: Body Scroll Lock While Gallery Is Open**
  - *Chosen Approach*: Temporarily lock `document.body.style.overflow = "hidden"` while the gallery modal is mounted and stop touch event propagation to the underlying horizontal scroll section.
  - *Why*: Prevents vertical scrolling or touch swiping inside the gallery from accidentally advancing the 4-slide horizontal background canvas underneath.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Application Shell                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     HorizontalScroll Canvas                       │  │
│  │  ┌──────────────┐  ┌──────────────────────────┐  ┌─────────────┐  │  │
│  │  │ 01: Artist   │  │ 02: Portfolio Slide      │  │ 03/04: ...  │  │  │
│  │  └──────────────┘  │  [ VIEW GALLERY → CTA ]  │  └─────────────┘  │  │
│  └────────────────────┴────────────┬─────────────┴───────────────────┘  │
│                                    │ Opens Modal (isGalleryOpen = true) │
│                                    ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                 ReverseScrollGallery Modal Overlay                │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ Top Bar: Brand Index · Discipline Filter Tabs · Close [ESC] │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ Native Touch & Wheel Scroll Viewport (scrollContainerRef)   │  │  │
│  │  │   │                                                         │  │  │
│  │  │   ├──► Column 1 (Reverse on Desktop / Normal on Mobile)     │  │  │
│  │  │   │      transforms y: [-maxOffset -> 0px]                  │  │  │
│  │  │   ├──► Column 2 (Normal on Desktop / Reverse on Mobile)     │  │  │
│  │  │   │      transforms y: [0px -> -maxOffset]                  │  │  │
│  │  │   └──► Column 3 (Reverse on Desktop, hidden on Mobile)      │  │  │
│  │  │          transforms y: [-maxOffset -> 0px]                  │  │  │
│  │  └──────────────────────────────┬──────────────────────────────┘  │  │
│  │                                 │ Click / Tap Piece Card          │  │
│  │                                 ▼                                 │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │               Fullscreen Piece Detail Lightbox              │  │  │
│  │  │  • High-Res Artwork Viewer + CSS Fallback Protection        │  │  │
│  │  │  • Unboxed Metadata: Style · Placement · Session · Status   │  │  │
│  │  │  • Prev / Next Piece Controls + "Book Similar Concept" CTA  │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State
- **Gallery Piece Entity (`GalleryPiece`)**:
  - `id`: Unique identifier and catalog number (`01` through `12`).
  - `title`: Editorial piece title (e.g., *Serpent & Obsidian Spine*, *Anatomical Fine-Line Study*, *Chiaroscuro Forearm Sleeve*).
  - `category`: `'Darkwork' | 'Fine-Line' | 'Realism' | 'Healed'`.
  - `placement`: Anatomical placement (e.g., `Full Back`, `Inner Forearm`, `Sternum & Ribs`, `Outer Deltoid`).
  - `sessions`: Session count and hours (e.g., `2 Sessions · 11 Hours`).
  - `status`: `'Healed 8 Months' | 'Fresh Ink' | 'Healed 1 Year'`.
  - `description`: Brief curator note on needle grouping, contrast discipline, and skin flow.
  - `image`: Local studio asset path or generated high-resolution darkwork tattoo photograph, backed by a resilient dark monochrome SVG fallback container.

### Interactive Component & State Mapping
- **`isGalleryOpen` (`boolean`)**: Controlled by the **VIEW GALLERY →** button in `HorizontalScroll` and passed to the gallery modal. Locks background `body` scroll when active and listens for `Escape` keydown.
- **`activeCategory` (`'All' | 'Darkwork' | 'Fine-Line' | 'Realism' | 'Healed'`)**: Filters or highlights matching items across the columns and smoothly resets scroll position when switched.
- **`scrollYProgress` (`MotionValue<number>`)**: Bound to the gallery modal's dedicated scroll container (`useScroll({ container: scrollRef })`), smoothed via `useSpring`, and mapped via `useTransform` so opposing columns travel in exact inverse synchronization from top to bottom and bottom to top.
- **`selectedPiece` (`GalleryPiece | null`)**: Opens the fullscreen Lightbox modal with keyboard arrow navigation (`ArrowLeft` / `ArrowRight`) and a direct **Book Similar Concept** button that closes the gallery and scrolls smoothly to `04 — ENGAGE (Booking)`.
