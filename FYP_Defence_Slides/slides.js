(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const counter = document.querySelector('.control-counter');
  const progress = document.querySelector('.progress-fill');
  const previousButton = document.querySelector('[data-action="previous"]');
  const nextButton = document.querySelector('[data-action="next"]');
  const fullscreenButton = document.querySelector('[data-action="fullscreen"]');
  const { parseSlideHash } = window.SlideNavigation;
  let currentIndex = 0;

  function clamp(index) {
    return Math.min(Math.max(index, 0), slides.length - 1);
  }

  function showSlide(index, { updateHash = true } = {}) {
    currentIndex = clamp(index);
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    const humanIndex = currentIndex + 1;
    counter.textContent = `${humanIndex} / ${slides.length}`;
    progress.style.width = `${(humanIndex / slides.length) * 100}%`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;

    if (updateHash) history.replaceState(null, '', `#slide-${humanIndex}`);
  }

  function isTypingTarget(target) {
    return target instanceof HTMLElement && (
      target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)
    );
  }

  async function enterFullscreen() {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
  }

  function updateFullscreenControl() {
    const active = Boolean(document.fullscreenElement);
    fullscreenButton.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
    fullscreenButton.setAttribute('aria-pressed', String(active));
  }

  function syncFromHash() {
    const index = parseSlideHash(window.location.hash, slides.length);
    const canonicalHash = `#slide-${index + 1}`;
    showSlide(index, { updateHash: window.location.hash !== canonicalHash });
  }

  document.addEventListener('keydown', (event) => {
    if (isTypingTarget(event.target)) return;
    const key = event.key;
    if (['ArrowRight', 'PageDown', ' '].includes(key)) {
      event.preventDefault();
      showSlide(currentIndex + 1);
    } else if (['ArrowLeft', 'PageUp'].includes(key)) {
      event.preventDefault();
      showSlide(currentIndex - 1);
    } else if (key === 'Home') {
      event.preventDefault();
      showSlide(0);
    } else if (key === 'End') {
      event.preventDefault();
      showSlide(slides.length - 1);
    } else if (key.toLowerCase() === 'f') {
      event.preventDefault();
      enterFullscreen();
    }
  });

  previousButton.addEventListener('click', () => showSlide(currentIndex - 1));
  nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
  fullscreenButton.addEventListener('click', enterFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenControl);
  window.addEventListener('hashchange', syncFromHash);

  updateFullscreenControl();
  syncFromHash();
})();
