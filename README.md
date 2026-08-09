# PDK Portfolio 2026

Personal product design portfolio site.

## Stack

- [11ty](https://www.11ty.dev/) — static site generator
- [PostCSS](https://postcss.org/) with `postcss-import` and `postcss-nesting`
- CSS Cascade Layers for specificity management
- Container Queries for responsive design

## Development

```bash
npm install
npm start
```

Runs 11ty and PostCSS in parallel with live reload.

## Build

```bash
npm run build
```

Outputs to `_site/`.

## Adding content

### New photo gallery

Drop your photos into a folder under `src/assets/images/` (e.g. `src/assets/images/Iceland/`), then run:

```bash
npm run new-gallery
```

or pass the folder name directly:

```bash
npm run new-gallery -- Iceland
```

Answer the prompts (title, description, location, date, optional lat/lng, URL slug, cover photo). The script reads the folder and auto-generates the `photos:` front matter array for you, then writes `src/photo-galleries/<slug>.md`. Preview at `/photos/<slug>/`.

### New thoughts post

```bash
npm run new-thought
```

Answer the prompts (title, category, description, tags, date, URL slug, optional OG image) and it writes `src/thoughts/<slug>.md` with the front matter filled in and a placeholder ready to write in. Preview at `/thoughts/<slug>/`.

Both scripts are interactive — run them in a real terminal and answer each prompt (pressing Enter accepts the default shown in parentheses).

