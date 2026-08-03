---
name: Vibrant Event Marketplace
colors:
  surface: '#faf8ff'
  surface-dim: '#cfd9ff'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e3e7ff'
  surface-container-highest: '#dbe1ff'
  on-surface: '#0b1a3d'
  on-surface-variant: '#444654'
  inverse-surface: '#222f53'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2b50d8'
  primary: '#0e3ec7'
  on-primary: '#ffffff'
  primary-container: '#3559e0'
  on-primary-container: '#e0e3ff'
  inverse-primary: '#b8c3ff'
  secondary: '#a33800'
  on-secondary: '#ffffff'
  secondary-container: '#cd4800'
  on-secondary-container: '#fffbff'
  tertiary: '#4a4e58'
  on-tertiary: '#ffffff'
  tertiary-container: '#626670'
  on-tertiary-container: '#e1e4f0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001355'
  on-primary-fixed-variant: '#0036bc'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb59a'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#802a00'
  tertiary-fixed: '#dfe2ee'
  tertiary-fixed-dim: '#c3c6d2'
  on-tertiary-fixed: '#171c24'
  on-tertiary-fixed-variant: '#434750'
  background: '#faf8ff'
  on-background: '#0b1a3d'
  surface-variant: '#dbe1ff'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  price-tag:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1rem
  gutter: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
  card-padding: 1.25rem
---

## Brand & Style

This design system is built for a high-energy, Indonesian event discovery and booking platform. The brand personality is **vibrant, energetic, and accessible**, aimed at Gen Z and Millennial audiences seeking entertainment and cultural experiences.

The visual style is **Corporate Modern with Playful Accents**. It utilizes a clean white canvas to prioritize event imagery, while injecting personality through saturated primary colors and soft, friendly geometry. The interface focuses on high legibility and quick scanning of event details like dates and pricing.

**Key visual traits:**
- High-density information presented with clean separation.
- Softly rounded corners that suggest friendliness and safety.
- Vibrant, high-contrast primary actions to drive conversion.
- Generous use of white space to prevent "event fatigue" during long browsing sessions.

## Colors

The palette is anchored by a **Vibrant Cobalt Blue** that evokes trust and modern technology. This is contrasted against a stark white background to ensure event posters remain the visual center of gravity.

- **Primary (#3559E0):** Used for key actions, selected states in navigation, and brand elements.
- **Secondary / Accent (#FF5C00):** Used sparingly for "Hot" tags, promos, or urgency-based indicators.
- **Surface & Background:** The primary background is pure white. A soft blue-tinted gray (#F0F3FF) is used for card containers to provide subtle separation without heavy borders.
- **Text & UI Neutral:** Deep indigo-blacks are used for primary headings to maintain higher contrast than pure black, ensuring a premium feel.

## Typography

The system utilizes **Plus Jakarta Sans** across all levels. This typeface was chosen for its modern, geometric construction and friendly, open counters which perform exceptionally well in Indonesian editorial contexts.

**Scale Philosophy:**
- **Headlines:** Use a bold weight to establish clear section hierarchy.
- **Event Titles:** Use a medium-to-semibold weight to ensure clarity even at smaller sizes on cards.
- **Numerical Data:** Pricing and dates use a emphasized weight to ensure the most critical booking information is processed first.
- **Hierarchy:** Maintain a clear vertical rhythm by using a 4px-based baseline grid.

## Layout & Spacing

The layout follows a **Fluid 4-column grid for mobile** and a **12-column grid for desktop** with a fixed max-width of 1200px.

- **Horizontal Rhythm:** Standard mobile margins are set at 16px. Carousel elements should bleed to the edge of the screen or use a "peek-a-boo" effect to indicate more content.
- **Vertical Rhythm:** Sections are separated by a consistent 32px or 48px gap to allow the UI to breathe.
- **Card Internals:** Use a 12px or 16px internal padding for event cards to ensure content doesn't feel cramped against the card boundaries.
- **Bottom Navigation:** The bar is horizontally centered with a floating effect, utilizing safe-area insets.

## Elevation & Depth

This design system uses **Tonal Layering** rather than heavy shadows to create depth.

1.  **Level 0 (Background):** Pure White (#FFFFFF).
2.  **Level 1 (Cards/Containers):** Subtle background fills using the tertiary color (#F0F3FF) or very thin, low-opacity borders (1px, 5% black).
3.  **Level 2 (Interactive Elements):** Buttons and active navigation items use high-saturation color fills to appear "above" the surface.
4.  **Floating Elements:** Elements like the Bottom Navigation Bar and floating "Next/Prev" arrows use a soft, large-radius ambient shadow (0px 8px 24px rgba(0, 0, 0, 0.08)) to indicate they are on the highest Z-axis.

## Shapes

The shape language is consistently **Rounded**, reinforcing the approachable brand personality.

- **Standard Radius:** 8px for small buttons and input fields.
- **Container Radius:** 16px for event cards and major layout containers.
- **Max Radius:** Large promo banners and the Bottom Navigation "Pill" use a 24px-32px radius or full pill-shape.
- **Icons:** Use rounded-cap line icons to match the softened edges of the UI components.

## Components

### Event Cards
Event cards are the primary unit of the UI. They consist of a 16:9 aspect ratio image at the top with a 12px corner radius, followed by a content area containing:
- **Title:** Headline-md, max 2 lines.
- **Meta Info:** Date and Location paired with small, tinted primary-color icons.
- **Pricing:** Emphasized price-tag style at the bottom left.
- **Divider:** A subtle dashed or solid line to separate the main info from the organizer/brand footer.

### Carousel Indicators
- Active state: An elongated "pill" in Primary Blue.
- Inactive state: Circular dots in a light-tinted version of the primary color or soft gray.

### Bottom Navigation Bar
A floating, high-radius pill container.
- **Active State:** A solid Primary Blue capsule background with white icon and text.
- **Inactive State:** Blue-tinted gray icons with no background fill.
- **Visuals:** Uses a backdrop-blur (Glassmorphism) if positioned over content, or a clean white background with an ambient shadow.

### Buttons & Interaction
- **Primary Button:** Full-width on mobile, 16px height padding, Bold Typography.
- **Navigation Arrows:** Circular white buttons with a subtle drop shadow, placed at the vertical center of carousels to assist desktop/tablet navigation.