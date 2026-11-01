/**
 * LIQUID CHROME - SCROLL REVEALS & ACTIVE SECTION SPY
 * Portfolio of Ayush Pratap Singh
 */

export function initScrollReveals() {
  // If reduced motion is preferred, reveal everything immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-fade, .reveal-slide-right').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal, .reveal-fade, .reveal-slide-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Unobserve once revealed
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Navigation Active Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(sec => navObserver.observe(sec));
}
