/* ============================================================
   main.js — Portfolio Đỗ Gia Ân
   - Typewriter terminal animation
   - Scroll-based fade-in (IntersectionObserver)
   - Active nav highlight on scroll
   - Navbar scroll shadow
   - Mobile hamburger menu
   ============================================================ */

// ── Typewriter Effect ──
const phrases = [
  'Xây dựng REST API sạch và bảo mật...',
  'Thiết kế database hiệu quả...',
  'Implementing JWT Authentication...',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const terminalEl = document.getElementById('terminalText');

function typeWriter() {
  if (!terminalEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    terminalEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    terminalEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 75;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

// Start typewriter after a short delay
setTimeout(typeWriter, 800);

// ── Fade-in on Scroll (IntersectionObserver) ──
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

fadeEls.forEach((el) => observer.observe(el));

// ── Navbar: scroll shadow ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

// ── Active Nav highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.contact-btn)');

function updateActiveNav() {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ── Mobile Menu Toggle ──
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const isOpen = navLinksEl.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navLinksEl?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
  });
});

// ── Smooth Scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Initial active nav ──
updateActiveNav();

// ── Demo Image Slider ──
const demoStates = {};

function getState(trackId) {
  if (!demoStates[trackId]) demoStates[trackId] = { index: 0 };
  return demoStates[trackId];
}

function updateSlider(trackId, counterId, total) {
  const track = document.getElementById(trackId);
  const state = getState(trackId);
  track.scrollTo({ left: track.clientWidth * state.index, behavior: 'smooth' });
  if (counterId) {
    document.getElementById(counterId).textContent = `${state.index + 1} / ${total}`;
  }
}

function slideNext(trackId, counterId, total) {
  const state = getState(trackId);
  state.index = (state.index + 1) % total;
  updateSlider(trackId, counterId, total);
}

function slidePrev(trackId, counterId, total) {
  const state = getState(trackId);
  state.index = (state.index - 1 + total) % total;
  updateSlider(trackId, counterId, total);
}

// ── Lightbox ──
let _lbImgs = [];
let _lbIdx = 0;

function openLightbox(src) {
  // Lấy tất cả ảnh trong cùng demo-track với ảnh được click
  const allImgs = Array.from(document.querySelectorAll('.demo-img'));
  _lbImgs = allImgs.map(img => img.src);
  _lbIdx = _lbImgs.indexOf(src);
  if (_lbIdx < 0) _lbIdx = 0;
  _showLightboxImg();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _showLightboxImg() {
  document.getElementById('lightboxImg').src = _lbImgs[_lbIdx];
}

function lightboxNav(dir) {
  _lbIdx = (_lbIdx + dir + _lbImgs.length) % _lbImgs.length;
  _showLightboxImg();
}

function handleLightboxClick(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// Arrow keys navigation in lightbox
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
});

// ── Contact Form Handling (EmailJS) ──
const contactForm = document.getElementById('contactForm');
const feedbackEl = document.getElementById('contactFeedback');

// Lưu ý: Đỗ Gia Ân cần thay đổi các ID dưới đây bằng ID từ tài khoản EmailJS (emailjs.com)
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Thay thế bằng Public Key
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Thay thế bằng Service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Thay thế bằng Template ID

if (contactForm && typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    // Trạng thái đang gửi
    btn.disabled = true;
    btnText.textContent = 'Đang gửi...';
    feedbackEl.textContent = '';
    feedbackEl.className = 'form-feedback';

    // Gửi form qua EmailJS
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
      .then(() => {
        feedbackEl.textContent = 'Cảm ơn! Tin nhắn của bạn đã được gửi thành công.';
        feedbackEl.classList.add('success');
        contactForm.reset();
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        feedbackEl.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau hoặc gửi trực tiếp đến dogiaan611@gmail.com';
        feedbackEl.classList.add('error');
      })
      .finally(() => {
        btn.disabled = false;
        btnText.textContent = originalText;
        
        // Ẩn thông báo sau 5 giây
        setTimeout(() => {
          feedbackEl.style.opacity = '0';
          setTimeout(() => {
            feedbackEl.textContent = '';
            feedbackEl.className = 'form-feedback';
            feedbackEl.style.opacity = '1';
          }, 500);
        }, 5000);
      });
  });
}
