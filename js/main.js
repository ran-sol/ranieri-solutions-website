// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form -> Web3Forms (static site, no backend needed)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const status = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      status.textContent = 'Please fill in your name, email, and message.';
      status.className = 'form-status show err';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.className = 'form-status';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });
      const result = await res.json();

      if (result.success) {
        status.textContent = "Message sent — we'll be in touch within one business day.";
        status.className = 'form-status show ok';
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      status.textContent = 'Something went wrong sending your message. Please email anthony@ranieri-solutions.com directly.';
      status.className = 'form-status show err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
