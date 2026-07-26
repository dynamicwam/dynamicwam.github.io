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

// Scroll reveal (skipped under reduced motion via CSS)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll(
    '.prose, .desc-grid, .spec-strip, .ladder, .evidence-row, .table-scroll, .task-cards, .video-grid'
  );
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  targets.forEach(t => {
    t.classList.add('reveal');
    io.observe(t);
  });
}
