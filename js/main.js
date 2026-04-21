/* ============================================================
   TALENT CENTER ALCOBENDAS — Shared JavaScript
   The Creative Marketing Collective
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- MOBILE MENU ---- */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile-menu');
  const mobileClose = document.querySelector('.navbar__mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const isFloat = target % 1 !== 0;
      let startTime = null;

      const step = (ts) => {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const val = easeOut(progress) * target;
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---- TESTIMONIAL CAROUSEL ---- */
  document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const cards = wrapper.querySelectorAll('.testimonial-card');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    const prevBtn = wrapper.querySelector('.carousel-btn--prev');
    const nextBtn = wrapper.querySelector('.carousel-btn--next');

    if (!track || !cards.length) return;

    let current = 0;
    let autoTimer = null;
    let isHovered = false;
    let startX = 0;
    let isDragging = false;

    const getVisible = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const maxIndex = () => Math.max(0, cards.length - getVisible());

    const goTo = (idx) => {
      current = Math.max(0, Math.min(idx, maxIndex()));
      const cardWidth = cards[0].offsetWidth + 24; // gap
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    };

    const buildDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = maxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    };

    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(() => {
        if (!isHovered) goTo(current >= maxIndex() ? 0 : current + 1);
      }, 4000);
    };

    const stopAuto = () => { clearInterval(autoTimer); };

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    wrapper.addEventListener('mouseenter', () => { isHovered = true; });
    wrapper.addEventListener('mouseleave', () => { isHovered = false; });

    // Touch swipe
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAuto();
    }, { passive: true });

    track.addEventListener('touchend', e => {
      if (!isDragging) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
      isDragging = false;
      startAuto();
    });

    buildDots();
    startAuto();
    window.addEventListener('resize', () => { buildDots(); goTo(current); });
  });

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---- BACK TO TOP ---- */
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
