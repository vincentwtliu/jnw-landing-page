/**
 * JNW Landing Page — Navigation Module
 * Handles sticky nav, hamburger menu, smooth scroll, focus trap, and ARIA.
 */

'use strict';

(function () {
  // ---- DOM References ----
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');
  const hero = document.getElementById('hero');

  if (!nav || !navLinks || !navToggle || !hero) return;

  // ---- Intersection Observer: Toggle .nav--scrolled ----
  const observerOptions = {
    root: null,
    threshold: 0,
    rootMargin: '0px'
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Hero is visible — nav is transparent
        nav.classList.remove('nav--scrolled');
      } else {
        // Hero is out of view — nav gets dark background
        nav.classList.add('nav--scrolled');
      }
    });
  }, observerOptions);

  heroObserver.observe(hero);

  // ---- Smooth Scroll for Navigation Links ----
  function handleSmoothScroll(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();
    targetElement.scrollIntoView({ behavior: 'smooth' });

    // Close mobile menu if open
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    }
  }

  navLinks.addEventListener('click', handleSmoothScroll);

  // Also handle the hero CTA button smooth scroll
  document.addEventListener('click', (e) => {
    const ctaLink = e.target.closest('.hero__cta');
    if (!ctaLink) return;

    const targetId = ctaLink.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });

  // ---- Hamburger Menu Toggle ----
  function isMobileMenuOpen() {
    return navToggle.getAttribute('aria-expanded') === 'true';
  }

  function openMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', '关闭菜单');
    navLinks.classList.add('nav__links--mobile-open');
    navLinks.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus the first link in the menu
    const firstLink = navLinks.querySelector('a');
    if (firstLink) {
      firstLink.focus();
    }
  }

  function closeMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '打开菜单');
    navLinks.classList.remove('nav__links--mobile-open');
    navLinks.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to the toggle button
    navToggle.focus();
  }

  navToggle.addEventListener('click', () => {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // ---- Close on Escape Key ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen()) {
      closeMobileMenu();
    }
  });

  // ---- Focus Trap within Mobile Menu Overlay ----
  navLinks.addEventListener('keydown', (e) => {
    if (!isMobileMenuOpen()) return;
    if (e.key !== 'Tab') return;

    const focusableElements = navLinks.querySelectorAll('a[href]');
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Include the toggle button in the focus trap
    if (e.shiftKey) {
      // Shift+Tab: if on first link, move focus to toggle button
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        navToggle.focus();
      }
    } else {
      // Tab: if on last link, move focus to toggle button
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        navToggle.focus();
      }
    }
  });

  // Focus trap on the toggle button itself (when menu is open)
  navToggle.addEventListener('keydown', (e) => {
    if (!isMobileMenuOpen()) return;
    if (e.key !== 'Tab') return;

    const focusableElements = navLinks.querySelectorAll('a[href]');
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift+Tab from toggle: go to last link
      e.preventDefault();
      lastFocusable.focus();
    } else {
      // Tab from toggle: go to first link
      e.preventDefault();
      firstFocusable.focus();
    }
  });

  // ---- Update aria-hidden based on viewport ----
  // On desktop, nav links should always be visible (aria-hidden=false)
  function updateAriaForViewport() {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      navLinks.setAttribute('aria-hidden', 'false');
      // Ensure mobile menu is closed if resizing from mobile to desktop
      if (isMobileMenuOpen()) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', '打开菜单');
        navLinks.classList.remove('nav__links--mobile-open');
        document.body.style.overflow = '';
      }
    } else {
      // On mobile, aria-hidden depends on menu state
      if (!isMobileMenuOpen()) {
        navLinks.setAttribute('aria-hidden', 'true');
      }
    }
  }

  // Run on load and on resize
  updateAriaForViewport();
  window.addEventListener('resize', updateAriaForViewport);
})();
