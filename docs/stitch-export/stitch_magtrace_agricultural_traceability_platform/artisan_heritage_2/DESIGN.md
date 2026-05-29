---
name: Artisan Heritage
colors:
  surface: '#fdf9f4'
  surface-dim: '#ddd9d5'
  surface-bright: '#fdf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ee'
  surface-container: '#f1ede8'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e6e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#504442'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0eb'
  outline: '#827472'
  outline-variant: '#d3c3c0'
  surface-tint: '#745853'
  primary: '#271310'
  on-primary: '#ffffff'
  primary-container: '#3e2723'
  on-primary-container: '#ae8d87'
  inverse-primary: '#e3beb8'
  secondary: '#1b6d24'
  on-secondary: '#ffffff'
  secondary-container: '#a0f399'
  on-secondary-container: '#217128'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a900'
  on-tertiary-container: '#4c3f00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#e3beb8'
  on-primary-fixed: '#2b1613'
  on-primary-fixed-variant: '#5b403c'
  secondary-fixed: '#a3f69c'
  secondary-fixed-dim: '#88d982'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005312'
  tertiary-fixed: '#ffe16d'
  tertiary-fixed-dim: '#e9c400'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#544600'
  background: '#fdf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e6e2dd'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
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
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  max-width: 1280px
---

## Brand & Style

The design system is anchored in the intersection of traditional craftsmanship and modern minimalism. It targets a discerning audience that values provenance, organic quality, and quiet luxury. The visual language evokes a sense of "botanical precision"—it is clean and structured, yet feels warm and human.

The style is a sophisticated blend of **Minimalism** and **Tactile Elegance**. We utilize heavy whitespace to allow content to breathe, paired with rich, organic textures and a color palette derived from natural elements. The goal is to evoke a calm, premium, and trustworthy emotional response, suggesting that every element has been curated with intentionality.

## Colors

The palette is rooted in the earth, utilizing a high-contrast hierarchy to guide the user's eye. 

*   **Primary (Coffee Brown):** Used for typography, primary branding, and structural elements. It provides a grounded, authoritative foundation.
*   **Secondary (Plantain Green):** Representing growth and vitality, this is used for supportive brand moments and secondary actions.
*   **Tertiary (Ripe Banana Yellow):** A vibrant, warm golden accent. This is the "spark" of the UI, reserved for high-priority highlights, status indicators, and specific secondary buttons that require immediate attention without breaking the luxury feel.
*   **Neutral (Alabaster):** A warm, off-white background color that prevents the "clinical" feel of pure white, maintaining the organic narrative.

## Typography

The typography strategy pairs a classical, high-contrast serif with a modern, balanced sans-serif to create an editorial feel.

*   **Headlines:** Utilize **EB Garamond**. It should be set with slightly tighter letter-spacing in larger sizes to emphasize its elegant, calligraphic roots.
*   **Body & UI:** Utilize **Manrope**. Its geometric yet friendly proportions provide excellent readability and a contemporary counterpoint to the serif headlines.
*   **Labels:** Always use Manrope in a semi-bold weight with increased letter-spacing and uppercase styling to denote metadata or small UI hints.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to ensure a curated, "boutique" browsing experience. 

- **Grid:** A 12-column grid with a maximum container width of 1280px.
- **Rhythm:** An 8px base unit governs all padding and margins. 
- **Desktop:** Generous 64px margins create an expensive, airy feel.
- **Mobile:** The layout collapses to a single column with 20px side margins.
- **Reflow:** Components like cards and image galleries should transition from a 3-column layout on desktop to a 2-column on tablet and a 1-column stack on mobile.

## Elevation & Depth

Visual hierarchy in the design system is achieved through **Tonal Layers** and **Low-Contrast Outlines**. 

- **Surfaces:** Use subtle shifts in background color (e.g., a slightly darker cream) to denote container nesting rather than heavy shadows.
- **Outlines:** Elements like input fields and cards use a 1px solid border in a desaturated version of the Coffee Brown at 10-15% opacity.
- **Shadows:** When necessary for interactivity (like a hovering card), use a single, ultra-diffused "Ambient Shadow"—a 12px blur with 4% opacity using the Primary Coffee Brown color to keep the shadow feeling warm and natural.

## Shapes

The shape language is **Soft**. We avoid sharp, aggressive corners to maintain the organic brand personality, but we also avoid overly bubbly or "tech-round" shapes to preserve luxury.

- **Base Radius:** 0.25rem (4px) for small components like checkboxes and tags.
- **Standard Radius:** 0.5rem (8px) for buttons and input fields.
- **Large Radius:** 0.75rem (12px) for cards and modals.

## Components

- **Buttons:** Primary buttons are solid Coffee Brown with Alabaster text. Secondary buttons use the Ripe Banana Yellow with Coffee Brown text for a high-visibility, "sun-drenched" call to action.
- **Chips/Tags:** Small, rounded-sm containers using a light tint of the Secondary Green or Tertiary Yellow.
- **Input Fields:** Minimalist design with only a bottom border that transitions to a full, soft-rounded outline on focus.
- **Cards:** Defined by a 1px low-contrast outline and a subtle change in background tone. Images within cards should always have a 4px corner radius.
- **Status Indicators:** Use Ripe Banana Yellow for "Warning" or "Pending" states, and Plantain Green for "Success." This maintains the botanical color story while providing clear functional feedback.
- **Lists:** Separated by thin, 1px lines in a faint neutral tone, utilizing generous vertical padding (16px+) to maintain the minimalist rhythm.