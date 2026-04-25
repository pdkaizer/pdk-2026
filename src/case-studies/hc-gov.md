---
title: Building and maintaining Healthcare.gov at scale
summary: My role as a frontend developer on one of the largest Jekyll-powered sites in the federal government
category: Federal
role: Frontend Developer
company: Healthcare.gov
year: 2017
order: 5
thumbnail: /assets/images/work/hc-gov-600.jpg
hero_image: /assets/images/work/hc-gov-600.jpg
hero_image_alt: Healthcare.gov — a large-scale Jekyll site serving millions of Americans
project_url: https://www.healthcare.gov
tags:
  - Frontend Development
  - Jekyll
  - Design Systems
  - Federal
---

## The site

Healthcare.gov is one of the largest and most visited federal websites in the country. It serves millions of Americans during Open Enrollment each year, providing plan comparison tools, eligibility information, and enrollment guidance across dozens of states. The public-facing informational site — separate from the enrollment application itself — was built on Jekyll and managed through GitHub, making it one of the largest Jekyll-powered sites in operation at the time.

The scale was significant in every dimension: thousands of content pages, multiple languages, state-specific variations, and a content team spread across government agencies and contractor teams all contributing through the same repository.

## My role

I joined the project as a frontend developer embedded in the engineering team responsible for the Jekyll site. My work sat at the intersection of content, design, and code — translating design specifications into reusable Jekyll includes and Liquid templates, maintaining the CSS architecture, and building the tooling that let content editors work efficiently within the system.

Because Healthcare.gov operated under a strict Open Enrollment calendar, every change had a hard deadline. There was no runway for exploratory refactoring. Work had to be precise, well-tested in the local Jekyll build, and confident before it went into the repository.

## Working with Jekyll at scale

Jekyll's strengths — static output, Liquid templating, straightforward content collections — become genuine engineering challenges at the size Healthcare.gov operated at. Build times were a constant concern. As the site's page count grew, incremental build strategies and careful use of Jekyll's `--incremental` flag became necessary just to keep the local development loop usable.

I contributed to the site's component library of Jekyll includes — reusable partials for things like plan comparison tables, alert banners, enrollment deadline callouts, and state-specific content blocks. Each include was designed to accept front matter-driven parameters so content editors could configure them without touching HTML. Getting that abstraction layer right was important: too rigid and content editors would work around the includes entirely; too flexible and the output became unpredictable and hard to maintain.

## GitHub as the content repository

The entire site — content, templates, assets, and configuration — lived in a GitHub repository. Content editors, designers, developers, and government stakeholders all worked through pull requests. This was the right architecture for auditability and version control, but it created a real workflow challenge: many of the people contributing content were not developers and were not comfortable with Git.

Part of my work involved supporting that content workflow. I helped document the PR process in terms that non-technical contributors could follow, contributed to tooling that reduced the number of steps between editing a Markdown file and opening a pull request, and triaged issues that arose when content edits conflicted with template expectations — a common occurrence when front matter fields were missing or formatted incorrectly.

The GitHub-as-CMS model also meant that code review served double duty: reviewers were checking both technical correctness and content accuracy, which required clear conventions for what a frontend PR should contain versus what belonged in a content PR. I helped establish and maintain those conventions as the contributor base grew.

## Frontend architecture

The site's CSS was organized around a modified BEM methodology layered on top of a base stylesheet shared with other CMS properties. Keeping that base stylesheet synchronized across sites without breaking site-specific customizations was an ongoing challenge, particularly as Healthcare.gov had developed a number of patterns that had diverged from the shared baseline over time.

I worked on a series of refactoring efforts aimed at bringing those divergent patterns back into alignment — replacing one-off overrides with properly scoped component styles and documenting the intended behavior so future contributors wouldn't reintroduce the same overrides. None of this work was visible to end users, but it made the codebase significantly easier to maintain and reduced the frequency of unintended style regressions during content deployments.

## Outcome

Working on Healthcare.gov during Open Enrollment was high-stakes frontend work in the most literal sense — outages or broken pages during enrollment windows have direct consequences for Americans trying to get health coverage. The discipline of working within a large shared repository, respecting build constraints, and writing templates that non-developers could use reliably shaped how I think about frontend engineering in complex content environments. The patterns I developed for scalable Jekyll component systems influenced my subsequent work on federal design systems projects.
