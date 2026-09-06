// Keep the footer copyright year current automatically
document.querySelectorAll('.copyright').forEach((el) => {
  el.textContent = el.textContent.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
});

// Top banner slider: framed card with arrow/dot navigation and autoplay
(() => {
  const frame = document.getElementById('top');
  const dots = [...document.querySelectorAll('#bannerDots .dot')];
  const prevBtn = document.getElementById('bannerPrev');
  const nextBtn = document.getElementById('bannerNext');
  if (!frame) return;

  const slides = [...frame.querySelectorAll('.slide')];
  if (slides.length < 2) return;

  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let timer;

  const snapTo = (el, className) => {
    el.style.transition = 'none';
    el.classList.add(className);
    el.offsetHeight; // force reflow so the snap applies before transitioning
    el.style.transition = '';
  };

  const show = (index, direction) => {
    if (index === current) return;
    const fromEl = slides[current];
    const toEl = slides[index];

    fromEl.addEventListener('transitionend', function cleanup() {
      fromEl.style.transition = 'none';
      fromEl.classList.remove('is-prev');
      fromEl.offsetHeight;
      fromEl.style.transition = '';
    }, { once: true });

    if (direction === 'prev') {
      snapTo(toEl, 'is-prev');
    } else {
      fromEl.classList.add('is-prev');
    }
    fromEl.classList.remove('is-active');
    requestAnimationFrame(() => {
      toEl.classList.remove('is-prev');
      toEl.classList.add('is-active');
    });

    dots[current]?.classList.remove('is-active');
    dots[index]?.classList.add('is-active');
    current = index;
  };

  const goNext = () => show((current + 1) % slides.length, 'next');
  const goPrev = () => show((current - 1 + slides.length) % slides.length, 'prev');

  const restartAutoplay = () => {
    clearInterval(timer);
    timer = setInterval(goNext, 4000);
  };

  prevBtn?.addEventListener('click', () => { goPrev(); restartAutoplay(); });
  nextBtn?.addEventListener('click', () => { goNext(); restartAutoplay(); });
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      show(index, index > current ? 'next' : 'prev');
      restartAutoplay();
    });
  });

  restartAutoplay();
})();
