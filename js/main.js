/**
 * LIQUID CHROME - MAIN APPLICATION ENTRY POINT
 * Portfolio of Ayush Pratap Singh | Full-Stack Web Developer
 */

import { initChromeScene } from './scene.js';
import { initCustomCursor } from './cursor.js';
import { initScrollReveals } from './reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Preloader Simulation & Page Entry
  // --------------------------------------------------------------------------
  const preloader = document.querySelector('.preloader');
  const progressBar = document.querySelector('.preloader-bar');
  const progressCount = document.querySelector('.preloader-count');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 10;
    if (progress > 100) progress = 100;

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressCount) progressCount.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(loadInterval);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
        }
      }, 350);
    }
  }, 45);

  // --------------------------------------------------------------------------
  // 2. Initialize Subsystems
  // --------------------------------------------------------------------------
  initChromeScene();
  initCustomCursor();
  initScrollReveals();

  // --------------------------------------------------------------------------
  // 3. Navigation Header Scroll Effect
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Dynamic Lucknow Local Time Clock
  // --------------------------------------------------------------------------
  const clockElement = document.getElementById('live-clock');
  function updateLucknowTime() {
    if (!clockElement) return;
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat([], options);
      clockElement.textContent = `${formatter.format(new Date())} IST`;
    } catch {
      clockElement.textContent = 'UTC+05:30';
    }
  }
  updateLucknowTime();
  setInterval(updateLucknowTime, 1000);

  // --------------------------------------------------------------------------
  // 6. Working Contact Form Submission (PHP + Mailto Fallback)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#name')?.value.trim();
      const email = contactForm.querySelector('#email')?.value.trim();
      const subject = contactForm.querySelector('#subject')?.value.trim() || 'Portfolio Inquiry';
      const message = contactForm.querySelector('#message')?.value.trim();

      // Basic client-side validation
      if (!name || !email || !message) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      showStatus('Dispatching transmission...', 'success');

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('contact.php', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json().catch(() => null);
          if (result && result.status === 'success') {
            showStatus(result.message || 'Message sent successfully! I will reply shortly.', 'success');
            contactForm.reset();
            return;
          }
        }
        
        // If PHP endpoint is not running on a server or returns error, trigger mailto fallback gracefully
        fallbackToMailto(name, email, subject, message);
      } catch {
        // Network / environment without PHP server
        fallbackToMailto(name, email, subject, message);
      }
    });

    function showStatus(text, type) {
      formStatus.textContent = text;
      formStatus.className = `form-status ${type}`;
    }

    function fallbackToMailto(name, email, subject, message) {
      const recipient = 'ayushpratapsinghgzp@gmail.com';
      const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;

      showStatus('Opening email client to send message directly to Ayush...', 'success');
      window.location.href = mailtoUrl;
    }
  }
});
