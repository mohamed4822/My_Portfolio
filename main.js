/**
 * portfolio/main.js
 * Handles: nav scroll, mobile menu, theme toggle, scroll reveal, form
 */

/* ── DOM refs ──────────────────────────────────────────────────── */
const nav          = document.getElementById('nav');
const burger       = document.getElementById('burger');
const drawer       = document.getElementById('drawer');
const themeToggle  = document.getElementById('themeToggle');
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const drawerLinks  = document.querySelectorAll('.drawer-link');
const revealEls    = document.querySelectorAll('.reveal');

/* ── 1. NAV — scroll class ──────────────────────────────────────── */
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ── 2. MOBILE MENU ─────────────────────────────────────────────── */
burger.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  nav.classList.toggle('nav--open', open);
  burger.setAttribute('aria-expanded', String(open));
});

// Close drawer when a link is clicked
drawerLinks.forEach(link => {
  link.addEventListener('click', () => {
    drawer.classList.remove('open');
    nav.classList.remove('nav--open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    nav.classList.remove('nav--open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ── 3. THEME TOGGLE ────────────────────────────────────────────── */
const THEME_KEY = 'portfolio-theme';
const iconEl    = themeToggle.querySelector('.theme-toggle__icon');

// Restore saved preference
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  iconEl.textContent = theme === 'dark' ? '☀' : '☾';
}

/* ── 4. SCROLL REVEAL (IntersectionObserver) ────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── 5. CONTACT FORM (no server) ─────────────────────────── */
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('[type="submit"]');
  const origContent = btn.innerHTML;

  btn.innerHTML = '<span>Sending…</span>';
  btn.disabled = true;

  const formData = new FormData(contactForm);

  try {
    const response = await fetch('https://formspree.io/f/xzdklrrr', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      contactForm.reset();
      formSuccess.hidden = false;
    } else {
      alert('Something went wrong!');
    }

  } catch (error) {
    alert('Network error!');
  }

  btn.innerHTML = origContent;
  btn.disabled = false;

  setTimeout(() => {
    formSuccess.hidden = true;
  }, 5000);
});

/* ── 6. SMOOTH ACTIVE NAV LINK (highlight on scroll) ────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── 7. PARALLAX — hero orbs follow mouse (subtle) ──────────────── */
const orbs = document.querySelectorAll('.hero__orb');
let mouseX = 0, mouseY = 0;
let rafId = null;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth  - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;

  if (!rafId) {
    rafId = requestAnimationFrame(moveOrbs);
  }
});

function moveOrbs() {
  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 18;
    orb.style.transform = `translate(${mouseX * depth}px, ${mouseY * depth}px)`;
  });
  rafId = null;
}

/* ── 8. PHONE MOCKUP 3D TILT on hover ──────────────────────────── */
const phoneWrapper = document.querySelector('.hero__phone');
const phoneFrame   = document.querySelector('.phone-mockup__frame');

if (phoneWrapper && phoneFrame) {
  phoneWrapper.addEventListener('mousemove', (e) => {
    const rect = phoneWrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -15;
    phoneFrame.style.transform = `rotateY(${-8 + x}deg) rotateX(${4 + y}deg)`;
  });

  phoneWrapper.addEventListener('mouseleave', () => {
    phoneFrame.style.transform = '';
  });
}

/* ── 9. TYPED TAGLINE (optional subtle effect) ───────────────────── */
// No library needed — pure CSS animation via the existing reveal system.
// The hero content fades in via the .reveal + .in-view mechanism.
