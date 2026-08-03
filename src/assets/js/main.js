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
