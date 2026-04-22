---
title: A Modern Web Starter
summary: A lean, opinionated foundation using semantic HTML, modern CSS with cascade layers, and vanilla JavaScript.
category: Creative Side Projects
role: Designer & Developer
company: Personal Project
year: 2026
order: 1
thumbnail: /assets/images/work/modern-we-starter.png
hero_image: /assets/images/work/modern-we-starter.png
hero_image_alt: A lean, opinionated foundation using semantic HTML, modern CSS with cascade layers
project_url: https://modern-web-starter.com
tags:
  - Design Systems
  - Modern CSS
  - Vanilla JavaScript
  - AI-Assisted Development
---

## The problem

The modern web stack has a complexity problem. Most starter templates pull in multiple frameworks, dozens of dependencies, and layers of build tooling before a single line of product code is written. For small projects, side projects, and design explorations, this overhead isn't just unnecessary — it actively gets in the way.

CSS specificity conflicts, utility-class sprawl, and the cognitive overhead of framework churn are real friction points. I wanted a foundation that solved these problems structurally, not by piling on more abstractions.

## Approach

The guiding constraint was zero dependencies. No framework, no preprocessor, no build step required to get started — just semantic HTML, modern CSS, and vanilla JavaScript with ES modules.

The architectural bet was CSS cascade layers. Rather than fighting specificity with `!important` or relying on utility classes for overrides, cascade layers make the order of precedence explicit: `reset → tokens → base → components → utilities`. Every rule knows exactly where it sits. Adding a new component layer never breaks an existing one.

The token system follows three tiers: primitives (raw values), semantic tokens (purpose-mapped aliases), and component tokens (scoped overrides). This separation means you can retheme an entire interface by changing a handful of semantic tokens without touching component code.

## Key decisions

**Fluid type scale over breakpoint-based sizes.** All type sizes use `clamp()` to scale smoothly between viewport extremes — no font-size overrides at arbitrary breakpoints.

**Light and dark mode built in.** The starter respects `prefers-color-scheme` by default and supports localStorage persistence so user preference survives page loads without a flash of wrong theme.

**CLAUDE.md included.** The repo ships with a `CLAUDE.md` file that documents project conventions for AI coding assistants. This reflects how the project was built — with Claude Code as a collaborative tool throughout — and makes the same workflow available to anyone who picks up the starter.

## Outcome

The result is a starter that weighs almost nothing but scales further than most projects will need. Five page layout templates, base components (buttons, badges, callouts, code blocks), and a token system that's genuinely easy to extend. The headline stat: 0 dependencies, infinite customizability.
