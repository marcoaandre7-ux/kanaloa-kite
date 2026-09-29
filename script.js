const intro = document.getElementById('intro');
const skipIntro = document.getElementById('skipIntro');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dismissIntro = () => {
  if (!intro || intro.classList.contains('intro--done')) return;
  intro.classList.add('intro--done');
  window.setTimeout(() => intro.remove(), 550);
};
if (reduceMotion) {
  intro?.remove();
} else {
  window.setTimeout(dismissIntro, 3200);
  skipIntro?.addEventListener('click', dismissIntro);
}

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mainNav?.classList.toggle('main-nav--open', open);
});
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
  mainNav.classList.remove('main-nav--open');
}));
document.getElementById('year').textContent = new Date().getFullYear();
