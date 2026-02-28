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

## Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pdkaizer/pdk-2026)
