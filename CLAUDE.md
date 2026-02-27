This file defines the conventions, architecture, and code generation rules for this project.
Read it fully before generating any code. It is the single source of truth for how this
codebase is structured and how components should be built.

## Project Overview
A personal product design portfolio site built with:

- 11ty (application framework)
- PostCSS with postcss-import and postcss-nesting (CSS processing)
- CSS Cascade Layers (specificity management)
- No Tailwind. No utility-class frameworks. Semantic modern CSS only.

Responsive Design
Use Container Queries as the primary responsive mechanism, not media queries.
Reserve media queries for global layout shifts (e.g., page-level column changes).