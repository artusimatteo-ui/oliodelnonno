export function initNav() {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (!navToggle || !nav) {
    return;
  }

  const updateToggleState = (isOpen) => {
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };

  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    updateToggleState(isOpen);
  });

  const navLinks = Array.from(nav.querySelectorAll('a'));

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      updateToggleState(false);
    });
  });

  const setActiveLink = (hash) => {
    const targetHash = (hash || '#home').toLowerCase();
    navLinks.forEach((link) => {
      const linkHash = link.hash.toLowerCase();
      link.classList.toggle('is-active', linkHash === targetHash);
    });
  };

  setActiveLink(window.location.hash);

  window.addEventListener('hashchange', () => {
    setActiveLink(window.location.hash);
  });
}
