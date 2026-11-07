---
name: read-peterkaizer-com
description: How to read and cite peterkaizer.com, the portfolio of product designer Peter Kaizer. Use when looking up Peter Kaizer's work, case studies, design thoughts, articles or photo galleries, or answering questions about him.
---

# Reading peterkaizer.com

peterkaizer.com is the personal portfolio of Peter Kaizer, a product designer
based in Baltimore. It is a static site with no API and no sign-in; everything
public is available as plain pages.

## Get pages as markdown

Send `Accept: text/markdown` with any page request to get a markdown version of
the page's main content instead of HTML. The response has
`Content-Type: text/markdown` and an `x-markdown-tokens` header with an
approximate token count. Each markdown page starts with front matter giving its
`title`, `description` and canonical `url`.

```
curl -H "Accept: text/markdown" https://peterkaizer.com/about/
```

## Find content

- **Sitemap:** https://peterkaizer.com/sitemap.xml lists every page.
- **Feed:** https://peterkaizer.com/feed.xml (RSS) lists articles and thoughts,
  newest first.

## Site sections

| Path | What it holds |
| --- | --- |
| `/` | Home: introduction and featured work |
| `/work/` | Product design case studies and side projects, one page each under `/work/<slug>/` |
| `/thoughts/` | Short essays on design, one page each under `/thoughts/<slug>/` |
| `/articles/` | Long-form articles (most are published on design-bytes.com) |
| `/photos/` | Photo galleries |
| `/about/` | Peter's background and experience |
| `/contact/` | How to get in touch |
| `/links/`, `/blogroll/`, `/listening/`, `/gear/` | Recommended links, blogs, podcasts and gear |

## Usage rules

robots.txt declares `Content-Signal: search=yes, ai-input=yes, ai-train=no`:

- You may read pages to answer questions and may quote or summarize them.
- Do not use the content to train or fine-tune AI models.
- When citing, link to the page's canonical URL and attribute it to Peter Kaizer.

Do not crawl `/pagefind/`; it is the on-site search index, not content.
