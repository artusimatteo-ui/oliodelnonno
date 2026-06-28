export function initCookies() {
  const COOKIE_CONSENT_KEY = 'olive-oil-cookie-consent';
  const COOKIE_BANNER_ID = 'cookie-banner';

  // Check if user has already made a choice
  const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (savedConsent) {
    applyCookieConsent(JSON.parse(savedConsent));
    return;
  }

  // Show banner if no consent saved
  const banner = document.getElementById(COOKIE_BANNER_ID);
  if (banner) {
    banner.style.display = 'flex';
  }

  // Setup button handlers
  const acceptAllBtn = document.getElementById('cookie-accept-all');
  const rejectAllBtn = document.getElementById('cookie-reject-all');
  const essentialOnlyBtn = document.getElementById('cookie-essential-only');

  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', () => {
      const consent = { analytics: true, marketing: true, essential: true };
      saveConsent(consent);
      applyCookieConsent(consent);
      hideBanner();
    });
  }

  if (rejectAllBtn) {
    rejectAllBtn.addEventListener('click', () => {
      const consent = { analytics: false, marketing: false, essential: false };
      saveConsent(consent);
      applyCookieConsent(consent);
      hideBanner();
    });
  }

  if (essentialOnlyBtn) {
    essentialOnlyBtn.addEventListener('click', () => {
      const consent = { analytics: false, marketing: false, essential: true };
      saveConsent(consent);
      applyCookieConsent(consent);
      hideBanner();
    });
  }

  function saveConsent(consent) {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  }

  function applyCookieConsent(consent) {
    // Load Google Fonts only if essential or all cookies are accepted
    if (consent.essential) {
      loadGoogleFonts();
    }

    // Block analytics and marketing cookies if not consented
    if (!consent.analytics) {
      // Block Google Analytics or similar
      window['ga-disable-GA_ID'] = true;
    }

    if (!consent.marketing) {
      // Block marketing pixels/trackers
      console.log('Marketing cookies blocked');
    }

    // Essential cookies are always allowed
    console.log('Cookie consent applied:', consent);
  }

  function loadGoogleFonts() {
    // Check if fonts are already loaded
    if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
      return;
    }

    // Create and inject Google Fonts links
    const preconnectGoogleFonts = document.createElement('link');
    preconnectGoogleFonts.rel = 'preconnect';
    preconnectGoogleFonts.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGoogleFonts);

    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectGstatic);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Manrope:wght@300;400;600&display=swap';
    document.head.appendChild(fontLink);
  }

  function hideBanner() {
    const banner = document.getElementById(COOKIE_BANNER_ID);
    if (banner) {
      banner.style.display = 'none';
    }
  }

  // Expose function to reset consent (for testing)
  window.resetCookieConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    location.reload();
  };
}
