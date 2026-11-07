// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  document.dispatchEvent(new CustomEvent('themechange', { detail: { isDark: !isDark } }));
});

// Nav toggle (hamburger flyout)
const navToggle = document.getElementById('nav-toggle');
const navBackdrop = document.getElementById('nav-backdrop');
const siteHeader = document.getElementById('site-header');

function openMenu() {
  closeSearch();
  siteHeader.setAttribute('data-menu-open', '');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation');
  document.documentElement.style.overflow = 'hidden';
}

function closeMenu() {
  siteHeader.removeAttribute('data-menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
  document.documentElement.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  siteHeader.hasAttribute('data-menu-open') ? closeMenu() : openMenu();
});

// Close on backdrop click
navBackdrop.addEventListener('click', closeMenu);

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && siteHeader.hasAttribute('data-menu-open')) closeMenu();
  if (e.key === 'Escape' && siteHeader.hasAttribute('data-search-open')) closeSearch();
});

// Close when a nav link is clicked (handles same-page anchors)
document.querySelectorAll('#primary-nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Search toggle (full-screen overlay, backed by Pagefind)
const searchToggle = document.getElementById('search-toggle');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchForm = document.querySelector('.search-overlay__form');

let pagefind;
let pagefindLoadFailed = false;

async function loadPagefind() {
  if (pagefind || pagefindLoadFailed) return pagefind;
  try {
    pagefind = await import('/pagefind/pagefind.js');
    await pagefind.init();
  } catch (err) {
    pagefindLoadFailed = true;
    console.warn('[search] Pagefind index unavailable:', err.message);
  }
  return pagefind;
}

function renderSearchResults(items) {
  if (!items.length) {
    searchResults.innerHTML = '<p class="search-results__empty">No results.</p>';
    return;
  }
  searchResults.innerHTML = items
    .map(
      (item) => `
        <a class="search-results__item" href="${item.url}">
          <span class="search-results__title">${item.meta?.title || item.url}</span>
          <p class="search-results__excerpt">${item.excerpt}</p>
        </a>
      `
    )
    .join('');
}

let searchDebounce;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  const term = searchInput.value.trim();
  if (!term) {
    searchResults.innerHTML = '';
    return;
  }
  searchDebounce = setTimeout(async () => {
    const pf = await loadPagefind();
    if (!pf) {
      searchResults.innerHTML = '<p class="search-results__empty">Search is unavailable right now.</p>';
      return;
    }
    const { results } = await pf.search(term);
    const items = await Promise.all(results.slice(0, 20).map((r) => r.data()));
    renderSearchResults(items);
  }, 150);
});

searchForm.addEventListener('submit', (e) => e.preventDefault());

function openSearch() {
  closeMenu();
  siteHeader.setAttribute('data-search-open', '');
  searchToggle.setAttribute('aria-expanded', 'true');
  searchToggle.setAttribute('aria-label', 'Close search');
  document.documentElement.style.overflow = 'hidden';
  loadPagefind();
  searchInput.focus();
}

function closeSearch() {
  siteHeader.removeAttribute('data-search-open');
  searchToggle.setAttribute('aria-expanded', 'false');
  searchToggle.setAttribute('aria-label', 'Search');
  document.documentElement.style.overflow = '';
}

searchToggle.addEventListener('click', () => {
  siteHeader.hasAttribute('data-search-open') ? closeSearch() : openSearch();
});

// WebMCP: expose site search as a tool for in-browser AI agents
// (https://webmachinelearning.github.io/webmcp/). Only runs in browsers that
// implement the API; older Chrome builds put it on navigator.
const modelContext = document.modelContext || navigator.modelContext;

if (modelContext?.registerTool) {
  const stripTags = (html) => html.replace(/<[^>]*>/g, '');

  Promise.resolve(
    modelContext.registerTool({
      name: 'search_site',
      title: 'Search peterkaizer.com',
      description:
        "Full-text search of Peter Kaizer's portfolio site: product design case studies, design thoughts, articles, photo galleries and about pages. Returns matching pages with title, URL and an excerpt. Request a URL with 'Accept: text/markdown' to read a page as markdown.",
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Words to search for, e.g. "design systems".' },
          limit: { type: 'integer', minimum: 1, maximum: 20, default: 5, description: 'Maximum number of results.' },
        },
        required: ['query'],
      },
      annotations: { readOnlyHint: true },
      async execute({ query, limit = 5 }) {
        const term = String(query ?? '').trim();
        if (!term) return { error: 'query is required', results: [] };
        const pf = await loadPagefind();
        if (!pf) return { error: 'Search is unavailable right now.', results: [] };
        const { results } = await pf.search(term);
        const count = Math.min(Math.max(Number(limit) || 5, 1), 20);
        const items = await Promise.all(results.slice(0, count).map((r) => r.data()));
        return {
          query: term,
          total: results.length,
          results: items.map((item) => ({
            title: item.meta?.title || item.url,
            url: new URL(item.url, location.origin).href,
            excerpt: stripTags(item.excerpt),
          })),
        };
      },
    })
  ).catch((err) => console.warn('[webmcp] Could not register search_site:', err));
}

// Lightbox (photo galleries)
const lightbox = document.getElementById('lightbox');

if (lightbox) {
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  let lightboxTrigger = null;

  function openLightbox(trigger) {
    lightboxTrigger = trigger;
    lightboxImage.src = trigger.dataset.src;
    lightboxImage.alt = trigger.dataset.alt || '';
    lightboxCaption.textContent = trigger.dataset.caption || '';
    lightbox.removeAttribute('inert');
    lightbox.setAttribute('data-open', '');
    document.documentElement.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('inert', '');
    lightbox.removeAttribute('data-open');
    document.documentElement.style.overflow = '';
    lightboxImage.src = '';
    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
  }

  document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.hasAttribute('data-open')) closeLightbox();
  });
}

// Mastodon share (federated — ask for the reader's instance once, then remember it)
document.querySelectorAll('[data-mastodon-share]').forEach((button) => {
  button.addEventListener('click', () => {
    let instance = localStorage.getItem('mastodonInstance');
    if (!instance) {
      const input = prompt('Enter your Mastodon instance domain (e.g. mastodon.social):');
      if (!input) return;
      instance = input.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      localStorage.setItem('mastodonInstance', instance);
    }
    const text = `${button.dataset.shareText} ${button.dataset.shareUrl}`;
    window.open(`https://${instance}/share?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });
});
