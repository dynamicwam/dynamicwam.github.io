// Demo video: try autoplaying with sound on; browsers that block unmuted
// autoplay fall back to muted playback (the viewer can unmute via controls).
const demo = document.querySelector('.demo-video');
if (demo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  demo.muted = false;
  demo.play().catch(() => {
    demo.muted = true;
    demo.play().catch(() => {});
  });
}

// Simulation renders are slow in real time; play them back at 2.5x.
document.querySelectorAll('.sim-grid video').forEach(v => {
  v.defaultPlaybackRate = 2.5;
  v.playbackRate = 2.5;
});

// Video clips: play while visible, pause off-screen; no autoplay under reduced motion.
const clips = document.querySelectorAll('.rw-video');
if (clips.length) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    clips.forEach(v => { v.controls = true; });
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.play().catch(() => {});
        else e.target.pause();
      });
    }, { threshold: 0.25 });
    clips.forEach(v => io.observe(v));
  }
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
