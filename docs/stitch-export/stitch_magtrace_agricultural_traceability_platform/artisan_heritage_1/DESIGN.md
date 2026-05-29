---
name: Artisan Heritage
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#4e453d'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#80756c'
  outline-variant: '#d2c4ba'
  surface-tint: '#725a42'
  primary: '#33210d'
  on-primary: '#ffffff'
  primary-container: '#4b3621'
  on-primary-container: '#bd9f83'
  inverse-primary: '#e1c1a4'
  secondary: '#79573f'
  on-secondary: '#ffffff'
  secondary-container: '#ffd1b3'
  on-secondary-container: '#7a5840'
  tertiary: '#1d2800'
  on-tertiary: '#ffffff'
  tertiary-container: '#303f00'
  on-tertiary-container: '#97ac5c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fedcbe'
  primary-fixed-dim: '#e1c1a4'
  on-primary-fixed: '#291806'
  on-primary-fixed-variant: '#59422c'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#eabda0'
  on-secondary-fixed: '#2d1604'
  on-secondary-fixed-variant: '#5f402a'
  tertiary-fixed: '#d5ec95'
  tertiary-fixed-dim: '#b9d07c'
  on-tertiary-fixed: '#161f00'
  on-tertiary-fixed-variant: '#3c4d05'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 24px
  container-padding-desktop: 48px
  gutter: 16px
  section-gap: 40px
---

## Brand & Style
The design system is rooted in the concept of "Digital Terroir"—merging the raw, organic beauty of Colombian agriculture with the precision of high-end luxury editorial. It evokes the feeling of a premium boutique hotel or a specialty coffee house.

The style is **Warm Minimalism**. It prioritizes extreme clarity and generous whitespace to allow high-fidelity photography of lush landscapes and textured coffee beans to serve as the primary visual anchor. The interface should feel like a curated gallery: quiet, confident, and deeply respectful of the heritage it tracks.

**Key Principles:**
- **Organic Precision:** Mathematical layouts met with soft, natural textures and rounded forms.
- **Warmth over Clinical:** Avoiding stark whites in favor of sun-drenched, creamy tones.
- **Editorial Pace:** Using dramatic typographic scale to guide the user through the story of their product.

## Colors
The palette is a sophisticated "Earth & Sun" harmony. 

- **Primary & Secondary (The Roast):** Deep Coffee Brown and Rich Mocha provide the structural foundation and text colors, replacing harsh blacks with warmth and depth.
- **Accents (The Harvest):** Plantain Green is used for growth indicators, verified status, and success states. Golden Banana Yellow is reserved for highlights, "New" badges, or premium features.
- **Background (The Canvas):** Warm Sand (#F9F7F2) is the default surface color, reducing eye strain and reinforcing the organic feel.
- **Neutral:** A very dark charcoal-brown is used for high-contrast labels where the primary brown might be too soft for accessibility.

## Typography
The typographic pairing balances classical authority with modern accessibility. 

**EB Garamond** (Serif) is used for all narrative elements, headings, and quotes. It should be typeset with slightly tighter tracking in large sizes to maintain a luxurious, editorial feel. 

**Plus Jakarta Sans** (Sans-serif) handles the functional UI: data points, body copy, navigation, and labels. Its wide apertures and soft curves complement the serif's elegance without sacrificing legibility on mobile devices.

Use `label-md` for metadata (e.g., "ALTITUDE", "BATCH ID") to create a clear visual hierarchy between "Data" and "Story."

## Layout & Spacing
This design system uses a **Fluid Organic Layout**. While it adheres to a standard 4-column mobile grid and 12-column desktop grid, the spacing is intentionally "breathable."

- **Generous Margins:** Mobile side margins are set to 24px (larger than the standard 16px) to create an immediate sense of "luxury space."
- **Vertical Rhythm:** A strict 8px baseline grid ensures alignment, but section gaps are kept wide (40px+) to prevent information density from feeling overwhelming.
- **Asymmetric Balance:** In editorial sections, use offset layouts where text overlays a portion of an image to create depth.

## Elevation & Depth
Depth is achieved through **Soft Tonal Layering** rather than heavy shadows.

- **Surface Tiers:** Use subtle shifts from Warm Sand (#F9F7F2) to pure Off-white (#FFFFFF) to define interactive cards.
- **Shadows:** When necessary, use "Sun-kissed Shadows"—highly diffused (30px+ blur), low opacity (5-8%), with a slight warm brown tint (`rgba(75, 54, 33, 0.08)`) rather than gray.
- **Glassmorphism:** Use for navigation bars and overlays. A 20px backdrop blur with a 40% opaque Off-white tint creates a sophisticated "frosted vellum" effect.

## Shapes
The shape language is "Tumbled"—like river stones or roasted coffee beans.

- **Standard Radius:** 16px for primary cards and input fields.
- **Large Radius:** 24px or 32px for container-level elements (e.g., bottom sheets, hero images).
- **Interactive Elements:** Buttons should use a 12px radius or be fully pill-shaped to contrast against the more architectural card structures.
- **Image Treatment:** All photography should have a minimum 16px corner radius to maintain the soft, organic aesthetic.

## Components

- **Buttons:** Primary buttons use the Deep Coffee Brown (#4B3621) with white text. Secondary buttons are outlined in Mocha with no fill. Always use a high-tap-target height (min 56px).
- **Cards:** Cards are pure white against the Warm Sand background. They feature a 1px border of `#E5E0D5` and a soft organic shadow.
- **Input Fields:** Use a floating label system. The "active" state is indicated by a Plantain Green border. Backgrounds of inputs should be slightly darker than the page background to indicate inset depth.
- **Chips/Badges:** Use for "Origin," "Variety," or "Process." These are small, pill-shaped elements with low-saturation backgrounds (e.g., a very pale green tint for "Verified Organic").
- **Progress Indicators:** Use a custom "Bean-to-Cup" stepper that uses organic dots and fine lines instead of bulky progress bars.
- **Iconography:** Use "Thin-stroke" icons (1.5px weight) with rounded terminals. Avoid solid-fill icons unless they are used as status indicators.