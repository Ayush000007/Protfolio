/**
 * LIQUID CHROME - CUSTOM INTERACTION CURSOR & MAGNETIC PHYSICS
 * Portfolio of Ayush Pratap Singh
 */

export function initCustomCursor() {
  // Check if touch device
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  // Immediate dot placement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      ringX = mouseX;
      ringY = mouseY;
    }

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  // Smooth trailing physics loop for outer chrome ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hide when cursor leaves browser window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
    isVisible = true;
  });

  // Hover states on interactive elements
  const interactiveTargets = document.querySelectorAll('a, button, input, textarea, .skill-pill, .project-item');

  interactiveTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovered');
    });

    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hovered');
    });
  });

  // Subtle Magnetic Pull on Primary Buttons
  const magneticButtons = document.querySelectorAll('.btn-chrome, .brand-monogram');

  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}
