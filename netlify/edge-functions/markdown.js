// Markdown for Agents: when a request prefers `text/markdown`, serve the
// index.md generated at build time (scripts/html-to-markdown.js) instead of
// the HTML page. Browsers never send text/markdown, so they get HTML as usual.

export default async (request, context) => {
  const accept = request.headers.get("accept") ?? "";
  if (!/\btext\/markdown\b/i.test(accept)) return;

  const url = new URL(request.url);
  let pathname = url.pathname;
  if (pathname.endsWith("/index.html")) pathname = pathname.slice(0, -"index.html".length);
  // Only page URLs (no file extension) have a markdown version.
  if (/\.[a-z0-9]+$/i.test(pathname)) return;
  if (!pathname.endsWith("/")) pathname += "/";

  const res = await fetch(new URL(`${pathname}index.md`, url.origin));
  if (!res.ok) return;

  const markdown = await res.text();
  return new Response(markdown, {
    status: 200,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "vary": "Accept",
      // Rough estimate (~4 characters per token).
      "x-markdown-tokens": String(Math.ceil(markdown.length / 4)),
    },
  });
};

export const config = {
  path: "/*",
  excludedPath: ["/assets/*", "/pagefind/*", "/*.xml", "/*.txt"],
};
