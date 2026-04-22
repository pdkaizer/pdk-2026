---
title: Portfolio Starter
summary: A zero-setup HTML and CSS template built as the hands-on capstone for the From Figma to Fluent Code curriculum.
category: Creative Side Projects
role: Designer & Developer
company: Design Bytes Media
year: 2026
order: 3
thumbnail: /assets/images/work/portfolio-starter.png
hero_image: /assets/images/work/portfolio-starter.png
hero_image_alt: Portfolio Starter — a beginner-friendly HTML and CSS portfolio template
project_url: https://github.com/pdkaizer/Portfolio-Starter
tags:
  - Curriculum Design
  - Modern CSS
  - Design Systems
  - Accessibility
---

## The problem

Learning to code from tutorials is easy. Applying that knowledge to something real is where most designers stall. The From Figma to Fluent Code curriculum teaches modern HTML and CSS across five phases — but without a concrete project to build, the concepts stay abstract.

The Portfolio Starter is the answer to that gap: a deliberately incomplete template that gives learners enough structure to orient themselves, and enough blank space to make it their own.

## Approach

The template is intentionally zero-setup. No package manager, no build tool, no terminal required — open `index.html` in a browser and start editing. That constraint keeps the focus on the code itself rather than the toolchain around it, which is exactly right for someone working through a curriculum rather than shipping production software.

Every feature in the template maps directly to a concept from the curriculum. The design token system uses a three-tier structure of CSS custom properties — primitives, semantic tokens, component tokens — so learners practice the same architecture they studied in Phase 3. The layout uses Flexbox and Grid in real contexts, not toy examples. Container queries demonstrate responsive design without media query hacks. Light and dark mode theming is wired up and ready to customize.

## What it teaches

The template is annotated throughout with comments explaining semantic element choices, and TODO markers flag the sections learners are expected to replace with their own content. Working through it, they practice:

- Semantic HTML and heading hierarchy
- CSS custom properties and three-tier token architecture
- BEM naming conventions and cascade layers
- Flexbox and Grid in a real layout
- Container queries for component-level responsiveness
- Fluid typography with `clamp()`
- Pseudo-classes and transitions
- ARIA attributes and accessible markup patterns

## Outcome

The Portfolio Starter functions as both a learning tool and a deliverable — by the time a student finishes the capstone, they have a working portfolio they can actually deploy. Hosting is intentionally approachable: Netlify Drop, GitHub Pages, or Vercel all work with no configuration required.
