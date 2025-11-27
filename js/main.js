document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  
  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      nav.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('active'));
    });
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});