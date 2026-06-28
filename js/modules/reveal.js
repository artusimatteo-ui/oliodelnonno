export function initReveal() {
  const revealSelectors = [
    '.page-hero',
    '.section-title',
    '.split-content',
    '.split-media',
    '.product-detail',
    '.contact-card',
    '.contact-form',
    '.timeline-item',
    '.hero-content',
    '.hero-media',
    '.card',
    '.product-card',
    '.cta-inner',
    '.footer-inner'
  ];

  const revealItems = document.querySelectorAll(revealSelectors.join(','));

  revealItems.forEach((item) => item.classList.add('reveal'));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}
