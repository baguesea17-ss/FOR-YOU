document.body.classList.add('js-enabled');

const opening = document.getElementById('opening');
const openLetterBtn = document.getElementById('openLetterBtn');
const letter = document.getElementById('letter');
const progressBar = document.getElementById('scrollProgress');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const psstToggle = document.getElementById('psstToggle');
const psstNote = document.getElementById('psstNote');

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function revealParagraphs() {
  const revealTargets = document.querySelectorAll('.reveal, .signature, .thanks, .psst, .psst-note');

  if (prefersReducedMotion) {
    revealTargets.forEach((element) => {
      element.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  revealTargets.forEach((element) => observer.observe(element));
}

function openLetter() {
  document.body.classList.add('is-letter-open');

  if (!prefersReducedMotion) {
    setTimeout(() => {
      letter.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 180);
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

openLetterBtn.addEventListener('click', openLetter);
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('load', updateScrollProgress);

revealParagraphs();
updateScrollProgress();

if (psstToggle && psstNote) {
  psstToggle.addEventListener('click', () => {
    const isVisible = psstNote.classList.toggle('visible');
    psstToggle.setAttribute('aria-expanded', String(isVisible));
  });

  psstToggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      psstToggle.click();
    }
  });
}

if (opening) {
  opening.setAttribute('aria-hidden', 'false');
}

if (letter) {
  letter.setAttribute('aria-hidden', 'true');
}
