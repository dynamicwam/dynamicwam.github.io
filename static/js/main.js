// Teaser carousel: centered main slide, neighbours peeking on both sides
const track = document.getElementById('carousel-track');
if (track) {
  const slides = Array.from(track.children);
  const dotsBox = document.getElementById('carousel-dots');
  let current = 0;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', 'go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function centreOf(i) {
    const slide = slides[i];
    return slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
  }

  function goTo(i) {
    const index = Math.max(0, Math.min(slides.length - 1, i));
    const target = centreOf(index);
    const from = track.scrollLeft;
    const distance = target - from;
    if (reduced || !distance) {
      track.scrollLeft = target;
      return;
    }
    // Snap is suspended for the duration so it cannot fight the animation.
    const duration = 380;
    const started = performance.now();
    track.style.scrollSnapType = 'none';
    const step = now => {
      const p = Math.min(1, (now - started) / duration);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      track.scrollLeft = from + distance * eased;
      if (p < 1) requestAnimationFrame(step);
      else track.style.scrollSnapType = '';
    };
    requestAnimationFrame(step);
  }

  function sync() {
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let smallest = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      if (distance < smallest) { smallest = distance; nearest = i; }
    });
    current = nearest;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === nearest));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === nearest));
  }

  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();

  document.querySelector('.carousel-btn.prev').addEventListener('click', () => goTo(current - 1));
  document.querySelector('.carousel-btn.next').addEventListener('click', () => goTo(current + 1));
}

// BibTeX copy
const copyBtn = document.getElementById('bib-copy');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const text = document.getElementById('bib-text').textContent;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'copied';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = 'copy';
        copyBtn.classList.remove('copied');
      }, 1800);
    } catch {
      copyBtn.textContent = 'select & copy';
    }
  });
}
