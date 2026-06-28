export function initBackToTop() {
  const button = document.querySelector('[data-to-top]');

  if (!button) {
    return;
  }

  let ticking = false;

  const updateVisibility = () => {
    const shouldShow = window.scrollY > 600;
    button.classList.toggle('is-visible', shouldShow);
    ticking = false;
  };

  updateVisibility();

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    },
    { passive: true }
  );
}
