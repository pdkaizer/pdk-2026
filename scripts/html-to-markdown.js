// Post-build step: write an index.md next to every built index.html so the
// markdown edge function (netlify/edge-functions/markdown.js) can serve it to
// agents that send `Accept: text/markdown`. Only the <main> content is
// converted — header, nav, footer and scripts are left out.

const fs = require("node:fs");
const path = require("node:path");
const TurndownService = require("turndown");
const site = require("../src/_data/site.js");

const OUT_DIR = path.join(__dirname, "..", "_site");
const SKIP_DIRS = new Set(["assets", "pagefind"]);

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.remove(["script", "style", "noscript", "svg", "button", "form", "iframe"]);

// Cards wrap a whole block (image, heading, summary) in one <a>. Render the
// block as-is and follow it with a plain link named after the heading.
turndown.addRule("blockLink", {
  filter: (node) =>
    node.nodeName === "A" &&
    node.getAttribute("href") &&
    node.querySelector("h1, h2, h3, h4, h5, h6, p, div, img"),
  replacement: (content, node) => {
    const heading = node.querySelector("h1, h2, h3, h4, h5, h6");
    const label = (heading?.textContent || node.getAttribute("href")).trim();
    return `\n\n${content.trim()}\n\n[${label}](${node.getAttribute("href")})\n\n`;
  },
});

const decode = (str) =>
  str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function findPages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return dir === OUT_DIR && SKIP_DIRS.has(entry.name) ? [] : findPages(full);
    }
    return entry.name === "index.html" ? [full] : [];
  });
}

function toMarkdown(html, url) {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  if (!main) return null;

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim() ?? "");
  const description = decode(
    html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? ""
  );

  const body = turndown
    .turndown(main[1])
    // Make site-relative links and images absolute so they work out of context.
    .replace(/\]\(\//g, `](${site.url}/`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const frontMatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    description && `description: ${JSON.stringify(description)}`,
    `url: ${site.url}${url}`,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  return `${frontMatter}\n\n${body}\n`;
}

let count = 0;
for (const file of findPages(OUT_DIR)) {
  const rel = path.relative(OUT_DIR, path.dirname(file));
  const url = rel ? `/${rel.split(path.sep).join("/")}/` : "/";
  const markdown = toMarkdown(fs.readFileSync(file, "utf8"), url);
  if (!markdown) continue;
  fs.writeFileSync(path.join(path.dirname(file), "index.md"), markdown);
  count++;
}
console.log(`[markdown] Wrote ${count} markdown pages`);
