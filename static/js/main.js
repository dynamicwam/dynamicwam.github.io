// Teaser carousel: centered main slide, neighbours peeking on both sides
const track = document.getElementById('carousel-track');
if (track) {
  const slides = Array.from(track.children);
  const dotsBox = document.getElementById('carousel-dots');
  let current = 0;      // slide nearest the centre right now
  let heading = 0;      // slide being animated towards, so fast clicks accumulate

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', 'go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animation = null;

  function centreOf(i) {
    const slide = slides[i];
    return slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
  }

  function goTo(i) {
    const index = Math.max(0, Math.min(slides.length - 1, i));
    heading = index;
    const target = centreOf(index);
    const from = track.scrollLeft;
    const distance = target - from;

    if (animation) cancelAnimationFrame(animation);
    if (reduced || Math.abs(distance) < 1) {
      track.scrollLeft = target;
      track.style.scrollSnapType = '';
      sync();
      return;
    }

    // Longer glide for longer jumps, so a dot two slides away doesn't snap past.
    const duration = Math.min(640, 300 + Math.abs(distance) * 0.28);
    const started = performance.now();
    // Snap is suspended for the duration so it cannot fight the animation.
    track.style.scrollSnapType = 'none';
    const step = now => {
      const p = Math.min(1, (now - started) / duration);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      track.scrollLeft = from + distance * eased;
      if (p < 1) {
        animation = requestAnimationFrame(step);
      } else {
        animation = null;
        track.style.scrollSnapType = '';
      }
    };
    animation = requestAnimationFrame(step);
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
    if (!animation) heading = nearest;   // a swipe or trackpad scroll re-bases the queue
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === nearest));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === nearest));
    prevBtn.setAttribute('aria-disabled', String(heading === 0));
    nextBtn.setAttribute('aria-disabled', String(heading === slides.length - 1));
  }

  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();

  prevBtn.addEventListener('click', () => goTo(heading - 1));
  nextBtn.addEventListener('click', () => goTo(heading + 1));

  // A peeking slide is a target, not just decoration.
  slides.forEach((slide, i) => slide.addEventListener('click', () => {
    if (i !== heading) goTo(i);
  }));

  track.closest('.carousel').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(heading - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(heading + 1); }
  });
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
