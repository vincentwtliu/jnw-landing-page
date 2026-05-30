/**
 * JNW Landing Page — Animations Module
 * Intersection Observer scroll animations with sequential stagger.
 * Respects prefers-reduced-motion user preference.
 */

'use strict';

(function () {
  // Bail out if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    // Make all animated elements visible immediately
    document.querySelectorAll('[data-animate]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  /**
   * Intersection Observer callback.
   * Adds 'is-visible' class with sequential stagger delay for sibling elements.
   */
  function handleIntersection(entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      var el = entry.target;

      // Find sibling animated elements for stagger calculation
      var parent = el.parentElement;
      var siblings = parent ? parent.querySelectorAll('[data-animate]') : [el];
      var index = Array.prototype.indexOf.call(siblings, el);
      var staggerDelay = index * 200; // 200ms stagger between cards

      // Apply animation with stagger delay
      el.style.transitionDelay = staggerDelay + 'ms';
      el.style.transitionProperty = 'opacity, transform';
      el.style.transitionDuration = '600ms';
      el.style.transitionTimingFunction = 'ease-out';

      el.classList.add('is-visible');

      // Stop observing once animated
      observer.unobserve(el);
    });
  }

  // Create a single Intersection Observer instance
  var observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.2,
    rootMargin: '0px'
  });

  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(function (el) {
    observer.observe(el);
  });

  // Handle dynamic preference changes (user toggles reduced motion while page is open)
  prefersReducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      // User enabled reduced motion — show all elements immediately
      document.querySelectorAll('[data-animate]').forEach(function (el) {
        el.style.transitionDelay = '0ms';
        el.style.transitionDuration = '0ms';
        el.classList.add('is-visible');
      });
    }
  });
})();
