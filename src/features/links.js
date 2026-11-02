// CV download links and click-to-copy buttons.
import { profile } from '../content/profile.js';

// `?url` makes Vite bundle the PDF and hand back its final (hashed) URL
import cvUrl from '../assets/CV/Prithul_Biswas_Dip_CV.pdf?url';

// Every `[data-cv]` link gets the CV, with a readable download name
export function initCv() {
  document.querySelectorAll('[data-cv]').forEach((a) => {
    a.href = cvUrl;
    a.download = profile.cv.downloadName;
  });
}

// `[data-copy]` copies its value and briefly shows "Copied!" in `.copy-label`
export function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('.copy-label') || btn;
    const original = label.textContent;
    let resetTimer = null;

    btn.addEventListener('click', async () => {
      let ok = true;
      try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { ok = false; }
      // If the browser blocks the clipboard, say so; the name is still on screen to copy by hand
      btn.classList.toggle('copied', ok);
      label.textContent = ok ? 'Copied!' : "Couldn't copy";
      btn.blur();
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        label.textContent = original;
        btn.classList.remove('copied');
      }, 1400);
    });
  });
}
