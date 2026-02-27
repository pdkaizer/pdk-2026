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

// Nav toggle (mobile hamburger)
const navToggle = document.getElementById('nav-toggle');
const siteHeader = document.getElementById('site-header');

function openMenu() {
  siteHeader.setAttribute('data-menu-open', '');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation');
}

function closeMenu() {
  siteHeader.removeAttribute('data-menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
}

navToggle.addEventListener('click', () => {
  siteHeader.hasAttribute('data-menu-open') ? closeMenu() : openMenu();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && siteHeader.hasAttribute('data-menu-open')) closeMenu();
});

// Close on click outside
document.addEventListener('click', (e) => {
  if (siteHeader.hasAttribute('data-menu-open') && !siteHeader.contains(e.target)) closeMenu();
});

// Close when a nav link is clicked (handles same-page anchors)
document.querySelectorAll('#primary-nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});
