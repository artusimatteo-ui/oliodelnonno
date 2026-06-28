const DEFAULT_INTERVAL = 5000;

function setupCarousel() {
  const carousels = document.querySelectorAll('[data-bs-ride="carousel"]');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.carousel-item'));
    const indicators = Array.from(carousel.querySelectorAll('.carousel-indicators button'));
    const prevButton = carousel.querySelector('[data-bs-slide="prev"]');
    const nextButton = carousel.querySelector('[data-bs-slide="next"]');
    const interval = Number(carousel.dataset.bsInterval) || DEFAULT_INTERVAL;

    if (!slides.length) return;

    let currentIndex = slides.findIndex((slide) => slide.classList.contains('active'));
    if (currentIndex < 0) currentIndex = 0;
    let timer = null;

    function setActive(index) {
      if (index < 0) {
        index = slides.length - 1;
      } else if (index >= slides.length) {
        index = 0;
      }

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === index);
      });

      indicators.forEach((indicator, indicatorIndex) => {
        indicator.classList.toggle('active', indicatorIndex === index);
        indicator.setAttribute('aria-current', indicatorIndex === index ? 'true' : 'false');
      });

      currentIndex = index;
    }

    function stopTimer() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(() => setActive(currentIndex + 1), interval);
    }

    if (prevButton) {
      prevButton.addEventListener('click', (event) => {
        event.preventDefault();
        setActive(currentIndex - 1);
        startTimer();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', (event) => {
        event.preventDefault();
        setActive(currentIndex + 1);
        startTimer();
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (event) => {
        event.preventDefault();
        setActive(index);
        startTimer();
      });
    });

    carousel.addEventListener('mouseenter', stopTimer);
    carousel.addEventListener('mouseleave', startTimer);

    startTimer();
    setActive(currentIndex);
  });
}

export function initCarousel() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCarousel);
  } else {
    setupCarousel();
  }
}
