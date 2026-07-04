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
});

// Close when a nav link is clicked (handles same-page anchors)
document.querySelectorAll('#primary-nav a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});
