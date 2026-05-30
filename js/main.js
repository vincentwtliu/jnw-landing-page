/**
 * JNW Landing Page — Main Entry Point
 * Initializes all modules after DOM is ready.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation module self-initializes via IIFE (loaded before main.js)
  // Animations module self-initializes via IIFE (loaded before main.js)
  // Language module will be added in Task 8

  // Handle hero background image load state
  const heroImg = document.querySelector('.hero__bg img');
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', () => {
        heroImg.classList.add('loaded');
      });
      // If image fails to load, keep the CSS gradient placeholder visible
      heroImg.addEventListener('error', () => {
        heroImg.style.display = 'none';
      });
    }
  }

  // Handle product image load states (fallback placeholder)
  const productImages = document.querySelectorAll('.product-card__image img');
  productImages.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
      img.addEventListener('error', () => {
        // Hide broken image, placeholder div remains visible
        img.style.display = 'none';
      });
    }
  });

  console.log('JNW Landing Page initialized');
});
