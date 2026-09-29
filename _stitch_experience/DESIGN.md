---
name: Guidance Modern
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#005522'
  on-tertiary: '#ffffff'
  tertiary-container: '#00702f'
  on-tertiary-container: '#78f591'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.025em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system pairs the structural clarity of high-tier SaaS with the welcoming optimism required of an educational guidance platform. The audience spans high school and university students seeking direction alongside parents and counselors seeking reassurance and credibility. 

The interface communicates calm competence, forward momentum, and safety. Visual density remains intentionally low to reduce anxiety around future planning. To differentiate from clinical assessment software or childish gamified apps, the aesthetic leans into balanced modern minimalism with crisp structural boundaries, airy surface relationships, and purposeful accents of luminous color.

- **Primary Metaphor:** A structured map—predictable, supportive, clear, and navigable.
- **Tone:** Encouraging, measured, intelligent, and unhurried.
- **Form Dynamic:** Soft geometry tempered by disciplined spatial rhythm and subtle architectural borders.

## Colors

The palette is engineered for cognitive clarity and high-trust interactions, using high contrast against clean, cool-tinted foundations.

- **Primary (`#4F46E5`):** Reserved for primary interactive journeys, progress indicators, active state anchors, and pivotal callouts.
- **Secondary (`#0EA5E9`):** Represents AI-generated insights, exploratory path suggestions, and conversational prompts.
- **Tertiary (`#16A34A`):** Indicates milestones achieved, strong career fit matches, and validated skill verifications.
- **Warning Accent (`#F59E0B`):** Flags educational prerequisite gaps, critical timeline deadlines, or advisory notices.
- **Neutral Palette:**
  - `Canvas / Background`: `#F8FAFC` (Slate 50) creates subtle separation from foreground modules.
  - `Card / Surface`: `#FFFFFF` (Pure White) provides crisp readability and high optical contrast.
  - `Primary Text`: `#0F172A` (Slate 900) ensures maximum accessibility and authoritative readability.
  - `Muted Secondary Text`: `#64748B` (Slate 500) supports secondary labels, metadata, and directional hints.
  - `Border / Divider`: `#E2E8F0` (Slate 200) sets structural boundaries without visual heaviness.

## Typography

The type hierarchy relies entirely on `Inter` across all functional roles to prioritize optical neutrality, legibility at small sizes, and internationalization readiness.

- **Weight Discipline:** Restrict usage primarily to `400 (Regular)`, `500 (Medium)`, `600 (Semi-Bold)`, and `700 (Bold)`. Avoid hairline and extra-heavy black weights.
- **Letter Spacing:** Headlines utilize slight negative tracking (-0.01em to -0.025em) to tighten geometric density and avoid a loose, unconsidered appearance. All caps badges and status tags (`label-sm`) require subtle positive tracking (+0.02em) to maintain quick legibility.
- **Body Rhythm:** Body copy line height remains at a generous 1.5–1.6 ratio to ensure comfortable long-form reading for complex pathway descriptions, career analyses, and parent-student split overviews.

## Layout & Spacing

The layout system operates on an 8pt structural rhythm within a 12-column responsive fluid grid, bounded by a standard maximum content width of 1280px.

- **Desktop (1024px+):** 12 columns, 24px (`1.5rem`) gutters, minimum 40px (`2.5rem`) outer canvas margins. Sidebars for navigation and diagnostic steps take 3-4 columns; workspace panels span 8-9 columns.
- **Tablet (768px - 1023px):** 8 columns, 20px gutters, 32px margins. Secondary details shift beneath primary assessment flows.
- **Mobile (Below 768px):** 4 columns, 16px (`1rem`) gutters, 20px (`1.25rem`) margins. Multi-column paths collapse into vertically stacked progressive steps.
- **Vertical Spacing Rhythm:** Dashboard sections and content groupings utilize `space-xl` (40px) vertical margins to reinforce psychological breathing room and reduce sensory overload during discovery phases.

## Elevation & Depth

This design system avoids heavy drop shadows and exaggerated glass reflections, relying instead on low-contrast outlines coupled with soft ambient light diffusion to separate layers.

- **Structural Boundaries:** Primary depth begins with a 1px solid border (`#E2E8F0`) across all cards and elevated surfaces.
- **Flat Surface (Level 0):** Used for main viewport canvases (`#F8FAFC`). No shadow, no border.
- **Card Base (Level 1):** Pure white (`#FFFFFF`) with 1px solid `#E2E8F0` and an ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Card Interactive / Hover (Level 2):** Pure white with border shifted to `#CBD5E1` and ambient shadow: `0 8px 16px -4px rgba(15, 23, 42, 0.06), 0 4px 6px -2px rgba(15, 23, 42, 0.03)`.
- **Modals & Flyouts (Level 3):** Floated dialogs and tooltips use 1px solid `#E2E8F0` with `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Overlays:** Dark slate modal scrim using `#0F172A` set at 40% opacity with a mild 4px backdrop blur to focus user attention entirely on high-stakes choices.

## Shapes

The design uses balanced, modern curves that soften the clinical nature of career aptitude tests while maintaining architectural discipline.

- **Small Components (Inputs, Buttons, Chips, Tooltips):** 8px (`0.5rem`) corner radius. This keeps interactive touch points distinct, organized, and structurally aligned.
- **Medium Panels & Cards:** 12px to 16px (`0.75rem` - `1rem`) corner radius. Serves as the standard envelope for career summary tiles, assessment questions, and profile blocks.
- **Modals, Dialogs & Large Containers:** 16px (`1rem`) to 24px (`1.5rem`) corner radius. Provides a clear container frame for multi-step career simulations and pathway comparisons.
- **Status Pills & Progress Trackers:** Full capsule rounding (`9999px`) to contrast against rectangular content blocks.

## Components

### Buttons
- **Primary:** Filled `#4F46E5` with `#FFFFFF` text. Height: 44px (touch-friendly), horizontal padding: 20px, font: `label-md` (`font-weight: 600`), radius: 8px. Hover state deepens to `#4338CA`. Active state scales down gently (`scale: 0.99`). Focus ring uses `0 0 0 3px rgba(79, 70, 229, 0.25)`.
- **Secondary:** Filled `#FFFFFF` with `#0F172A` text, 1px border `#E2E8F0`. Hover shifts background to `#F8FAFC` and border to `#CBD5E1`.
- **Tertiary / Ghost:** No background, `#4F46E5` or `#64748B` text, 8px padding. Hover adds `#F1F5F9` background.
- **AI Action Button:** Subtle gradient border or background wash of `#0EA5E9` tinting to `#4F46E5` at 10% opacity, accompanied by an AI sparkle icon.

### Chips & Badges
- **Category & Skill Chips:** Height: 28px–32px, radius: 9999px. Background: `#F1F5F9`, text: `#0F172A`, font: `label-sm`. Selectable variants toggle to `#4F46E5` background with white text.
- **Match / Status Badges:** Soft pastel fills with saturated labels:
  - Strong Match / Complete: Background `#DCFCE7`, text `#15803D`.
  - In Progress / AI Suggestion: Background `#E0F2FE`, text `#0369A1`.
  - Prerequisite Warning: Background `#FEF3C7`, text `#B45309`.

### Input Fields & Selects
- **Base Style:** 44px height, background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#0F172A`, placeholder `#94A3B8`, radius: 8px, padding: 0 14px.
- **Focus State:** Border changes to `#4F46E5` with a shadow halo: `0 0 0 3px rgba(79, 70, 229, 0.15)`.
- **Helper & Validation Messages:** Rendered 6px below inputs in `body-sm`. Errors use `#DC2626` text with matching field border.

### Checkboxes & Radio Buttons
- **Dimensions:** 20px x 20px. Border 1.5px solid `#CBD5E1`, radius 4px (checkboxes) or 50% (radios).
- **Checked State:** Fill `#4F46E5` with pure white checkmark/dot icon. Transition duration: 150ms ease-out.

### Cards & Pathway Modules
- **Base Card:** `#FFFFFF` background, 1px solid `#E2E8F0`, 16px radius, internal padding of 24px (`space-lg`).
- **Interactive Career Card:** Includes an icon container (40x40px, rounded-lg, 10% tint fill of `#4F46E5` or `#0EA5E9`), career title (`title-md`), salary/growth metadata (`body-sm` in `#64748B`), and a compatibility indicator pill in top-right.

### Career Pathway / Progress Stepper
- Horizontal nodes linked by a 2px track (`#E2E8F0`). Completed segments transition to `#16A34A`; active nodes show an inner dot of `#4F46E5` inside a white circle with a 3px ring of `#4F46E5` at 20% opacity.

### AI Insight Callout Box
- Surface styled with 1px border `#BAE6FD` and subtle background `#F0F9FF`. Includes a left accent border or icon marker in `#0EA5E9`, designed specifically for parent-student conversation starters and synthetic market trends.