// Teaser carousel
const track = document.getElementById('carousel-track');
if (track) {
  const slides = Array.from(track.children);
  const dotsBox = document.getElementById('carousel-dots');
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'go to slide ' + (i + 1));
    dot.addEventListener('click', () =>
      track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }));
    dotsBox.appendChild(dot);
    return dot;
  });
  const setActive = () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
  };
  track.addEventListener('scroll', () => requestAnimationFrame(setActive), { passive: true });
  document.querySelector('.carousel-btn.prev').addEventListener('click', () =>
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }));
  document.querySelector('.carousel-btn.next').addEventListener('click', () =>
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }));
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
