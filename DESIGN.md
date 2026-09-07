---
name: TimePitch (formerly Oído Absoluto)
description: A gamified music history and year-guessing arcade game
colors:
  primary: "#d946ef"
  background: "#0c0a09"
  card-bg: "#1c1917"
  neon-cyan: "#22d3ee"
  neon-purple: "#a855f7"
  neon-fuchsia: "#d946ef"
  neon-amber: "#fcd34d"
typography:
  body:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
  label:
    fontFamily: "var(--font-geist-mono), monospace"
rounded:
  full: "9999px"
  md: "12px"
  lg: "24px"
spacing:
  sm: "8px"
  md: "16px"
components:
  slider-thumb:
    backgroundColor: "{colors.card-bg}"
    rounded: "{rounded.full}"
    width: "24px"
    height: "24px"
---

# Design System: TimePitch

## Overview

**Creative North Star: "The Neon Cyberpunk Arcade"**

TimePitch (formerly Oído Absoluto) embraces a high-octane, neon-drenched arcade aesthetic. The visual world is dark, intense, and deeply tied to retro-futuristic digital interfaces. It leverages a deep stone-black canvas punctuated by glowing neon gradients (cyan, purple, fuchsia, amber) to create a sense of speed, stakes, and technological immersion.

**Key Characteristics:**
- Dark, moody, and intense.
- Fast-paced, high-stakes arcade feel.
- Uses neon glows and high-contrast digital displays.
- Embraces complex gradients for typography and accents.

## Colors

The palette revolves around deep, dark backgrounds with explosive, highly saturated neon highlights.

### Primary Neons
- **Neon Fuchsia** (#d946ef): Primary accent for high-energy interactions.
- **Neon Cyan** (#22d3ee): Used for technical displays, multipliers, and secondary info.
- **Neon Purple** (#a855f7): Bridges the fuchsia and cyan for rich gradients.
- **Neon Amber** (#fcd34d): Reserved for scores and high-value achievements.

### Neutral
- **Deep Void Background** (#0c0a09): The universal canvas.
- **Surface Background** (#1c1917): Elevated panels and cards.
- **Text** (#fafaf9 / #a8a29e): High-contrast white for primary text, muted warm gray for secondary.

### Named Rules
**The Glowing Core Rule.** Important elements, active states, and scores emit a soft glow (`shadow-[0_0_15px_rgba(...)]`). The glow's color matches its semantic meaning (cyan for tech, amber for score).

## Typography

**Display/Body Font:** Geist Sans
**Label/Mono Font:** Geist Mono

**Character:** Digital, precise, and punchy. Monospace fonts are heavily utilized for HUD elements (scores, times, lives) to reinforce the technical, machine-driven theme.

### Hierarchy
- **Body** (400): Standard text throughout the interface.
- **Label** (700, Mono): Used aggressively for scores, HUD metrics, and technical details. Often rendered with glowing or high-contrast colors.
- **Headers** (900): Thick, bold, and often rendered with `bg-clip-text` gradients.

## Layout

The spatial model relies on a centered, max-width container (max-w-4xl). HUD elements (Score, Lives, Multiplier) are consolidated into a high-density, dashboard-like top bar to leave the main viewport focused on the central interaction module.

## Elevation & Depth

This system uses **Luminescent Depth**.

**The Luminescent Depth Rule.** Instead of traditional drop shadows simulating physical light, elevation and emphasis are created through emitted light (neon glows, intense borders, and stark contrast against the void background).

## Shapes

Forms are sleek and pill-like. Interactive elements use pronounced border radii (`rounded-2xl` or `rounded-full`) combined with thin, high-contrast borders to look like digital readouts or sci-fi hardware buttons.

## Components

Components feel like they belong on a spaceship dashboard or a high-end arcade cabinet.

### Slider Thumb
- **Shape:** Perfectly round (24px by 24px).
- **Style:** Dark background with a glowing neon cyan or fuchsia border.
- **Hover/Focus:** Emits a larger glow and slightly scales up.

### Content Cards
- **Corner Style:** Rounded edges (24px).
- **Background:** Deep stone (`#1c1917`) with a translucent white/colored border.
- **Shadow Strategy:** Only glows for active or highly important cards; otherwise flat against the dark void.

## Do's and Don'ts

### Do:
- **Do** use dark backgrounds to make the neon colors pop.
- **Do** use `bg-clip-text` gradients for major branding and titles.
- **Do** consolidate HUD metrics to avoid mobile clutter.
- **Do** use monospace fonts for all numbers and stats.

### Don't:
- **Don't** use soft pastels or pure white backgrounds.
- **Don't** spread stats randomly around the page; keep them in the HUD.
