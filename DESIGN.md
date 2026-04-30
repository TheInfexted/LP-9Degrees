---
name: NINE°
description: Nightlife marketing agency, Kuala Lumpur. Brand register, single landing page. Runway to a WhatsApp or Instagram conversation.
---

<!-- SEED — re-run /impeccable document once there's code to capture the actual tokens, fonts, components, and per-component CSS. The frontmatter is intentionally minimal until then. -->

# Design System: NINE°

## 1. Overview

**Creative North Star: "The Booth at 2AM"**

The interface is the view from inside the venue, an hour after the room got loud. Deep room-black carries almost everything. Cyan, the brand color, behaves like a strobe: timed, intentional, unmissable when it lands, then gone. The whole system is editorial cinema applied to nightlife, the register of Boiler Room, Resident Advisor, Mixmag, and 9Degrees' own @ninedegrees_kl Instagram grid: grainy crowd photography, oversized condensed display type, the occasional script accent, full-bleed cyan tiles punctuating tiles of pure dark.

The system explicitly rejects the predictable nightclub-website palette: black plus pink-to-cyan gradients, fog particles, confetti animations, hands-in-the-air stock crowd photos. It also rejects the corporate agency boilerplate (service-card grids, "we tell stories" hero copy, stock laptop shots), the crypto / Web3 aesthetic (3D blobs, chrome typography, glitch fonts), and the SaaS template (cream backgrounds, gradient text, rounded "Get Started" pill). If the page looks like any of those at a glance, it has failed.

Energy comes from photography, scale contrast, and choreographed motion, not from decoration. Every visual decision should feel like it came from someone who actually runs 404 and Nono, not someone moodboarding "nightclub website."

**Key Characteristics:**

- True deep blacks as the primary surface. Tinted toward cyan, never neutral grey.
- Cyan as strobe punctuation, not ambient wash. Sections either wear it fully or not at all.
- Heavy photographic grain / cinematic crops. Photography is the proof.
- Oversized condensed display type, ranged against tight monoish small text.
- Choreographed motion that respects `prefers-reduced-motion`.
- WhatsApp and Instagram CTAs are the most reliable interactive elements on the page.

## 2. Colors

The palette is a two-color system carried by tinted black, with a single saturated brand accent. Real values land when the implementation begins; below is the working direction.

### Primary

- **Brand Cyan** (`oklch ~88% 0.16 188`, hex approximately `#1CECD8`, sampled from logo and Instagram grid; final value to be locked from the source logo file at implementation): the agency's signature. Used as a strobe, not a wash. Appears on the wordmark, the WhatsApp / Instagram CTAs, key hover states, and entire punctuation sections (one or two per scroll) where the surface itself wears cyan.

### Neutral

- **Room Black** (`oklch ~12% 0.01 200`, approximately `#0A0F11`): primary page surface. Tinted slightly toward cyan so it never feels grey or violet. Carries 70-85% of total surface area.
- **Booth Black** (`oklch ~18% 0.01 200`, approximately `#13191B`): one tonal step lighter than Room Black, used for elevated surfaces (cards, modals, image overlays where a layer needs to read as separate from the page).
- **Strobe White** (`oklch ~96% 0.01 200`, approximately `#EEF3F4`): primary text on dark surfaces. Tinted toward cyan, never pure white.
- **Smoke** (`oklch ~64% 0.005 200`, approximately `#9AA5A8`): secondary text, captions, metadata. Used sparingly.

Exact OKLCH and hex values to be finalized from the source logo and live design pass. None of these are `#000` or `#fff`; every neutral leans cyan by 0.005-0.01 chroma.

### Named Rules

**The Strobe Rule.** Cyan is never ambient. A section either wears cyan as its full surface (committed mode) or wears black with cyan as a single accent (restrained mode). Never both at once. Never half. The rhythm of the page is black, black, cyan, black, cyan, black. If three consecutive sections all carry cyan as accent, one of them is wrong.

**The Tinted-Neutral Rule.** No color in the system is `#000` or `#FFF`. Every neutral leans toward cyan (chroma 0.005-0.01). The page should never look grey or violet under accidental color cast.

**The Anti-Gradient Rule.** Cyan-to-pink, cyan-to-purple, and any other "neon nightclub" gradient is forbidden. If a surface needs depth, use tonal black layering, photography, or grain. Never a gradient between accent colors.

## 3. Typography

Direction picked: **Single sans, technical**. One workhorse grotesk carries everything, ranged from oversized display down to tight label. Editorial cinema, no decoration. Reference systems: Neue Haas Grotesk, Söhne, GT America, Inter (decision pending implementation).

**Display Font:** [single technical sans, family to be chosen at implementation]
**Body Font:** same family, lighter weight
**Label / Mono Font:** optional mono companion (e.g. JetBrains Mono / GT America Mono) for set-list rhythms, dates, captions, only if it earns its place

**Character:** The pairing is one font doing many jobs through scale and weight contrast. Display weight is heavy, set in tight letterspacing, often condensed. Body weight is regular. Label weight is medium with tracked-out uppercase. The contrast ratio between display and body is ≥1.6× to avoid a flat scale.

### Hierarchy

- **Display** (heavy / black weight, ~`clamp(3rem, 9vw, 8rem)`, line-height 0.95-1.0): hero headlines, section openers, occasional poster moments. Set tight, sometimes pushed to the edge.
- **Headline** (semibold-bold, ~`clamp(1.75rem, 4vw, 3rem)`, line-height 1.1): section titles inside scroll sections.
- **Title** (medium-semibold, ~`1.25-1.5rem`, line-height 1.25): card titles, venue names.
- **Body** (regular, `1rem-1.125rem`, line-height 1.5, capped at 65-75ch): the few paragraphs that exist on the page.
- **Label** (medium, `0.75-0.875rem`, letter-spacing `0.05-0.1em`, uppercase): metadata, set-list dates, tags, button captions.

### Named Rules

**The Range Rule.** Hierarchy is established by scale and weight contrast, never by color. The same Strobe White carries every text role on the dark; only size and weight separate Display from Body. Color is reserved for the Brand Cyan, used on the wordmark and CTAs.

**The Edge Rule.** Display type is allowed to push beyond the standard content gutter, occasionally bleeding to the page edge or breaking the grid. This is on-brand. Body type respects the gutter.

**The Tracked-Caps Rule.** Uppercase labels always carry positive letter-spacing (`0.05em` minimum, `0.12em` for set-list-style metadata). Uppercase without tracking reads as a yelling SaaS button, which is forbidden.

## 4. Elevation

Surfaces are flat by default. Depth comes from tonal black layering (Room Black behind, Booth Black in front), full-bleed photography, and grain texture, not from drop shadows. Shadows that exist are diffuse and atmospheric, never the standard SaaS card shadow.

### Shadow Vocabulary

- **Cyan Bloom** (atmospheric, used sparingly): a soft cyan glow under or around a hovered CTA or active state. Approximate `box-shadow: 0 0 32px -8px oklch(88% 0.16 188 / 0.4)`. Reads as a strobe responding to interaction, not as a card lift.
- **No card shadow**: cards (where they exist) are differentiated by Booth Black surface against Room Black page, never by box-shadow.

### Named Rules

**The Flat-Black Rule.** Cards, sections, and surfaces are flat at rest. Hierarchy comes from tonal contrast (Room Black vs Booth Black) and from spacing, not from elevation. The first instinct to add a `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` for "depth" is rejected; depth lives in the photography and the type.

**The Bloom-On-Action Rule.** Glow / bloom appears only as a response to interaction (hover, focus, active). Never decorative, never on a static element. The cyan responds; it does not announce.

## 5. Components

Component primitives have not been built yet; this section will be filled in by a follow-up scan-mode `/impeccable document` run once the landing page is implemented.

Working hypothesis for what will exist:
- **Primary Message Buttons** (WhatsApp, Instagram): the most prominent interactive elements on the page. Sized large (44px minimum tap target on mobile, comfortably larger on desktop). Filled cyan with Room Black text, or outlined cyan on cyan-section variants.
- **Secondary Link**: text plus an arrow / underline rule, no pill, no fill.
- **Section Header Block**: oversized display type plus a tracked-uppercase eyebrow label.
- **Venue Card** (404, Nono, future clients): full-bleed photography, venue name in display, optional set-list-style metadata.
- **Set List / Event Tile**: mono-leaning label scale, dates and venue names ranged in a poster grid.

These are placeholders for the scan-mode pass to formalize.

## 6. Do's and Don'ts

### Do:

- **Do** lead every section with photography or oversized type. The page argues by example, not by claim.
- **Do** keep the brand cyan rare. Most of the page is Room Black; cyan should feel like an event each time it lands.
- **Do** allow display type to bleed past the standard gutter. The page should occasionally feel like a poster, not a corporate column.
- **Do** ensure every long-scroll section ends within reach of a WhatsApp or Instagram CTA. The page is a runway.
- **Do** treat photography as a load-bearing system component. Grainy, low-light, cinematic crops. Sourced from the venues' own nights wherever possible.
- **Do** respect `prefers-reduced-motion` with a credible static fallback for every choreographed effect.
- **Do** keep all body text at minimum 4.5:1 contrast against its background, including over photography (use overlays).
- **Do** size touch targets at 44px minimum, especially the WhatsApp and Instagram buttons.

### Don't:

- **Don't** make this look like a generic nightclub site. No fog particles, no confetti, no neon pink-to-cyan gradients smeared across the hero, no stock photography of crowds with hands in the air.
- **Don't** make this look like corporate agency boilerplate. No "we tell stories" hero copy, no identical-card service grids ("Strategy / Creative / Production"), no laughing-team-at-laptop stock shots, no 6-step process diagrams.
- **Don't** make this look like a crypto / Web3 site. No animated 3D blobs, no metallic chrome typography, no cyber-glitch fonts, no neon gradients on black.
- **Don't** make this look like a generic SaaS landing page. No cream off-white background, no oversized rounded "Get Started" pill, no gradient text headers, no three-up feature cards.
- **Don't** use `#000` or `#FFF`. Every neutral leans cyan (chroma 0.005-0.01).
- **Don't** put cyan on more than ~10% of any restrained-mode section, or on less than ~80% of any committed-mode section. Half-cyan is the trap.
- **Don't** use side-stripe colored borders (`border-left: 4px solid cyan`) as accents on cards or callouts. Use full borders, background tints, leading numbers, or nothing.
- **Don't** use `background-clip: text` gradients. Emphasize through size and weight, never through gradient text.
- **Don't** use glassmorphism or backdrop blur as decoration. The room is dark; it does not need to be foggy.
- **Don't** use bouncy / elastic motion curves. Ease out with exponential curves (ease-out-quart, quint, expo). Motion should feel decisive, not playful.
- **Don't** add a contact form, email capture, or lead funnel. The conversion is WhatsApp / Instagram, full stop.
