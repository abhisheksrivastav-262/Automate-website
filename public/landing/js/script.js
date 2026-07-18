/* ===============================
   Auto Ads Solution — Site Script
   =============================== */

(function () {
  'use strict';

  // ---- Sticky navbar ----
  const header = document.getElementById('siteHeader');
  const navLinks = [...document.querySelectorAll('#mainNav ul a')];
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const bt = document.getElementById('backTop');
    if (window.scrollY > 400) bt.classList.add('show');
    else bt.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Highlight the section currently being viewed ----
  const navSectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.2] });
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) navSectionObserver.observe(section);
  });

  // ---- Mobile nav toggle ----
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
  });
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });

  // ---- Reveal on scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- Counter animation ----
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + (target === 98 ? '%' : '+');
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

  // ---- FAQ accordion ----
  document.querySelectorAll('.acc-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ---- Infinite slider (duplicate slides) ----
  const track = document.querySelector('#resultsSlider .slider-track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  // ---- Video modal ----
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');
  const closeVid = document.getElementById('videoClose');
  document.querySelectorAll('.video-thumb').forEach(t => {
    t.addEventListener('click', () => {
      const src = t.dataset.video;
      player.src = src;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      player.play().catch(() => {});
    });
  });
  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    player.pause();
    player.src = '';
  };
  closeVid.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // ---- Image lightbox ----
  const imgModal = document.getElementById('imageModal');
  const imgViewer = document.getElementById('imageViewer');
  const imgClose = document.getElementById('imageClose');
  const openImage = (src) => {
    if (!src) return;
    imgViewer.src = src;
    imgViewer.classList.remove('zoomed');
    imgModal.classList.add('show');
    imgModal.setAttribute('aria-hidden', 'false');
  };
  const closeImage = () => {
    imgModal.classList.remove('show');
    imgModal.setAttribute('aria-hidden', 'true');
    imgViewer.classList.remove('zoomed');
    setTimeout(() => { imgViewer.src = ''; }, 250);
  };
  document.querySelectorAll('.slide-img-wrap img, .cert-preview img').forEach(img => {
    img.addEventListener('click', () => openImage(img.dataset.full || img.src));
  });
  const certBtn = document.getElementById('viewCertBtn');
  if (certBtn) {
    certBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openImage(certBtn.dataset.full);
    });
  }
  imgClose.addEventListener('click', closeImage);
  imgModal.addEventListener('click', (e) => { if (e.target === imgModal) closeImage(); });
  imgViewer.addEventListener('click', (e) => {
    e.stopPropagation();
    imgViewer.classList.toggle('zoomed');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeImage(); }
  });

  // ---- Enquiry form → WhatsApp ----
  const form = document.getElementById('enquiryForm');
  const successPopup = document.getElementById('successPopup');
  const successClose = document.getElementById('successClose');
  const WA_NUMBER = '917997761733'; // WhatsApp number with country code

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const fields = ['fullName', 'mobile', 'state'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    });
    const mobile = document.getElementById('mobile');
    const normalizedMobile = mobile.value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (mobile.value && !/^\d{10}$/.test(normalizedMobile)) {
      mobile.classList.add('error'); valid = false;
    }
    if (!valid) return;

    // Build WhatsApp message with all form data
    const name  = document.getElementById('fullName').value.trim();
    const phone = normalizedMobile;
    const state = document.getElementById('state').value.trim();
    const desc  = document.getElementById('desc').value.trim();

    const message =
      `🌟 *New Enquiry — Auto Ads Solution*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Mobile:* +91 ${phone}\n` +
      `📍 *State:* ${state}\n` +
      (desc ? `📝 *Description:* ${desc}\n` : '') +
      `\n_Sent from autoadsolution.com_`;

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    // This runs directly from the submit event, so browsers treat it as a user action.
    // Avoiding the "noopener" feature string prevents false popup-blocker fallbacks.
    const whatsappWindow = window.open(waUrl, '_blank');
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      successPopup.classList.add('show');
      successPopup.setAttribute('aria-hidden', 'false');
    } else {
      window.location.assign(waUrl);
    }

    form.reset();
  });

  successClose.addEventListener('click', () => {
    successPopup.classList.remove('show');
    successPopup.setAttribute('aria-hidden', 'true');
  });
  successPopup.addEventListener('click', (e) => {
    if (e.target === successPopup) {
      successPopup.classList.remove('show');
      successPopup.setAttribute('aria-hidden', 'true');
    }
  });

  // ---- Back to top ----
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Smooth scroll offset for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
