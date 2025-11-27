// animations.js - entrance and simple interactions
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-copy');
  if (hero) {
    hero.classList.add('fade-in');
    requestAnimationFrame(()=> hero.classList.add('show'));
  }
});
