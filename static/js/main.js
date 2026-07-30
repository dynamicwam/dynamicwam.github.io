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
