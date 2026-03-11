/* ============================================================
   RYX AI — Application JavaScript
   ============================================================ */

/* ── INITIALIZE GSAP ANIMATIONS ── */
// Ensure content is visible first
document.body.style.opacity = '1';

document.addEventListener('DOMContentLoaded', function () {

  // Check if GSAP is loaded with error handling
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded - animations will be disabled');
    return;
  }

  try {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
  } catch (error) {
    console.warn('Failed to register GSAP plugins:', error);
    return;
  }

  /* ── PARALLAX BACKGROUND GRID ── */
  gsap.to('.hero-grid', {
    y: 200,
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  /* ── GSAP SCROLL REVEAL ANIMATIONS ── */
  // Ensure all reveal elements are visible by default
  gsap.set('.reveal, .reveal-up, .reveal-feature, .reveal-left, .reveal-right', {
    opacity: 1,
    x: 0,
    y: 0
  });

  const revealElements = gsap.utils.toArray('.reveal, .reveal-up, .reveal-feature, .reveal-left, .reveal-right');

  revealElements.forEach((element) => {
    const direction = element.classList.contains('reveal-left') ? -40 :
      element.classList.contains('reveal-right') ? 40 : 0;

    gsap.from(element, {
      opacity: 0,
      y: direction === 0 ? 40 : 0,
      x: direction,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* ── STAGGERED ANIMATIONS FOR GROUPS ── */
  // Platform features - ensure visibility first
  if (document.querySelector('.features-list')) {
    gsap.set('.feature-item', { opacity: 1, y: 0 });

    gsap.from('.feature-item', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.features-list',
        start: 'top 80%'
      }
    });
  }

  // Stats row - ensure visibility first
  if (document.querySelector('.trust-badges')) {
    gsap.set('.trust-badge', { opacity: 1, scale: 1 });

    gsap.from('.trust-badge', {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.trust-badges',
        start: 'top 85%'
      }
    });
  }

  /* ── HOW IT WORKS: TIMELINE ANIMATION ── */
  const howLineFill = document.getElementById('howLineFill');
  const howTimelineDot = document.getElementById('howTimelineDot');
  const howSteps = gsap.utils.toArray('.how-step-row');
  const timelineNodes = gsap.utils.toArray('.how-timeline-node');

  if (howLineFill && howSteps.length > 0) {
    // Ensure timeline elements are visible by default
    gsap.set('.how-step-content', { opacity: 1, x: 0 });
    gsap.set('.how-step-number-bg', { opacity: 1, scale: 1 });

    // Smooth timeline animation using requestAnimationFrame
    let ticking = false;

    ScrollTrigger.create({
      trigger: '.how-steps-wrap',
      start: 'top center',
      end: 'bottom center',
      scrub: 0.3,
      onUpdate: (self) => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const progress = self.progress;
            const wrapElement = document.querySelector('.how-steps-wrap');
            const wrapHeight = wrapElement.offsetHeight;
            const wrapTop = wrapElement.offsetTop;
            // Adjust fill height based on viewport
            let offset = 0;
            if (window.innerWidth <= 768) offset = 144; // Approx 9rem padding offset manually defined in CSS

            const fillHeight = progress * (wrapHeight - offset);
            // Update line fill height smoothly
            howLineFill.style.height = fillHeight + 'px';

            // Update dot position smoothly
            if (howTimelineDot) {
              howTimelineDot.style.top = fillHeight + 'px';
            }

            // Activate nodes when progress line reaches them
            timelineNodes.forEach((node, index) => {
              const stepElement = howSteps[index];
              const stepCenter = stepElement.offsetTop + (stepElement.offsetHeight / 2);
              const stepCenterRelative = stepCenter - wrapTop;

              // Activate node when progress line is within 30px of the node center, OR if it's the last node and we are at the very bottom
              if (fillHeight >= stepCenterRelative - 30 || (index === timelineNodes.length - 1 && progress > 0.95)) {
                node.classList.add('active');
              } else {
                node.classList.remove('active');
              }
            });

            ticking = false;
          });

          ticking = true;
        }
      }
    });

    // Animate each step as it comes into view
    howSteps.forEach((step, index) => {
      const content = step.querySelector('.how-step-content');
      const number = step.querySelector('.how-step-number-standalone');

      // Step content animation
      if (content) {
        gsap.from(content, {
          opacity: 0,
          x: index % 2 === 0 ? 50 : -50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });
      }

      // Number animation
      if (number) {
        gsap.from(number, {
          opacity: 0,
          scale: 0.5,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: step,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
  }

  /* ── SOLUTIONS TABS ANIMATION ── */
  if (document.querySelector('.solutions-card')) {
    gsap.set('.sol-tab', { opacity: 1, x: 0 });

    gsap.from('.sol-tab', {
      opacity: 0,
      x: -30,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.solutions-card',
        start: 'top 80%'
      }
    });
  }

  /* ── ORCHESTRATION DIAGRAM ANIMATION (ENHANCED) ── */
  if (document.querySelector('.orchestration-diagram-box')) {
    const orchItems = gsap.utils.toArray('.orch-item, .orch-platform-card, .orch-bottom-item, .orch-avatar');
    gsap.set(orchItems, { opacity: 1, y: 0 });

    // Create timeline for orchestrated sequence
    const orchTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.orchestration-diagram-box',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Main container entrance with scale
    orchTimeline.from('.orchestration-diagram-box', {
      opacity: 0,
      scale: 0.95,
      y: 60,
      duration: 1.2,
      ease: 'power3.out'
    });

    // Title animation
    orchTimeline.from('.orch-column-title', {
      opacity: 0,
      y: -20,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    }, '-=0.6');

    // Left column items - cascade from top
    orchTimeline.from('.orch-left .orch-item', {
      opacity: 0,
      x: -50,
      rotationY: -15,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    }, '-=0.4');

    // Center platform cards - dramatic entrance with glow
    orchTimeline.from('.orch-platform-title', {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      ease: 'back.out(2)'
    }, '-=0.3');

    orchTimeline.from('.orch-platform-card', {
      opacity: 0,
      scale: 0.7,
      y: 40,
      rotationX: 20,
      duration: 1,
      stagger: 0.2,
      ease: 'elastic.out(1, 0.6)',
      onComplete: function () {
        // Add continuous pulse to platform cards
        gsap.to('.orch-platform-card', {
          boxShadow: '0 12px 40px rgba(79, 142, 247, 0.5), 0 0 80px rgba(124, 92, 252, 0.4)',
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: 0.3
        });
      }
    }, '-=0.5');

    // Right column items - cascade from top
    orchTimeline.from('.orch-right .orch-item', {
      opacity: 0,
      x: 50,
      rotationY: 15,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=1.2');

    // Connection lines - sequential flow animation
    orchTimeline.from('.orch-line', {
      strokeDashoffset: 200,
      opacity: 0,
      duration: 1.8,
      stagger: {
        each: 0.15,
        from: 'start'
      },
      ease: 'power2.inOut'
    }, '-=1');

    // Bottom section
    orchTimeline.from('.orch-bottom', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.8');

    // Add floating animation to platform cards
    gsap.to('.orch-platform-card', {
      y: -8,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: 0.4
    });

    // Add subtle rotation animation to icons
    gsap.to('.orch-card-icon', {
      rotation: 5,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: 0.5
    });

    // Hover interactions for items
    document.querySelectorAll('.orch-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          x: 8,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

    // Enhanced hover for platform cards
    document.querySelectorAll('.orch-platform-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.08,
          y: -12,
          boxShadow: '0 20px 60px rgba(79, 142, 247, 0.6), 0 0 100px rgba(124, 92, 252, 0.5)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          boxShadow: '0 4px 20px rgba(79, 142, 247, 0.25), 0 0 30px rgba(124, 92, 252, 0.15)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  }

  /* ── USE CASES ANIMATION ── */
  if (document.querySelector('.uc-tabs-horizontal')) {
    gsap.set('.uc-tab-h', { opacity: 1, y: 0 });

    gsap.from('.uc-tab-h', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.uc-tabs-horizontal',
        start: 'top 80%'
      }
    });
  }

  /* ── PRICING SECTION ANIMATION ── */
  if (document.querySelector('.pricing-section')) {
    const pricingCards = gsap.utils.toArray('.pricing-card');
    gsap.set(pricingCards, { opacity: 1, y: 0 });

    gsap.from(pricingCards, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.pricing-cards',
        start: 'top 80%'
      }
    });

    // Animate CTA block
    if (document.querySelector('.pricing-cta-block')) {
      gsap.set('.pricing-cta-block', { opacity: 1, y: 0 });

      gsap.from('.pricing-cta-block', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.pricing-cta-block',
          start: 'top 80%'
        }
      });
    }
  }

  /* ── TESTIMONIALS ANIMATION ── */
  if (document.querySelector('.testimonial-card-new')) {
    const card = document.querySelector('.testimonial-card-new');
    const quoteIcon = document.querySelector('.testimonial-quote-icon');
    const text = document.querySelector('.testimonial-text');
    const footer = document.querySelector('.testimonial-footer');

    gsap.set([card, quoteIcon, text, footer], { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    tl.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: 'power2.out'
    })
      .from(quoteIcon, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.3')
      .from(text, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.2')
      .from(footer, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3');
  }

  /* ── HERO SECTION ANIMATION ── */
  if (document.querySelector('.hero-content')) {
    const heroContent = document.querySelector('.hero-content');
    const badge = document.querySelector('.badge');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta-group');

    // Set initial state
    gsap.set([heroContent, badge, heroTitle, heroSubtitle, heroCta], { opacity: 1 });

    // Animate from current position
    gsap.from(heroContent, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
      delay: 0.3
    });

    gsap.from(badge, {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.5
    });

    gsap.from(heroTitle, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.7
    });

    gsap.from(heroSubtitle, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.9
    });

    gsap.from(heroCta, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      delay: 1.1
    });
  }

  /* ── INITIALIZE NEW TESTIMONIALS ── */
  if (document.getElementById('testimonialCardNew')) {
    buildTestimonialDotsNew();
    renderTestimonialNew(0);

    // Add hover listeners to pause/resume autoplay
    const card = document.getElementById('testimonialCardNew');
    card.addEventListener('mouseenter', () => {
      isHoveringTestimonial = true;
      stopAutoplayNew();
    });

    card.addEventListener('mouseleave', () => {
      isHoveringTestimonial = false;
      startAutoplayNew();
    });

    // Start autoplay
    startAutoplayNew();
  }

  /* ── BAR CHART ANIMATION ── */
  const bars = document.querySelectorAll('.obs-bar');
  if (bars.length > 0) {
    // Start cycling animation
    setTimeout(() => {
      startBarCycling();
    }, 1000);
  }

}); // End window load

/* ── DESKTOP STATS ANIMATION (INDEPENDENT) ── */
document.addEventListener('DOMContentLoaded', function () {
  // Desktop stats animation function
  function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const isDecimal = target % 1 !== 0;

    console.log('Animating counter:', element, 'target:', target);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      const displayValue = isDecimal ? current.toFixed(2) : Math.floor(current);
      element.textContent = prefix + displayValue + suffix;
    }, duration / steps);
  }

  // Check if it's desktop and stats section exists
  if (window.innerWidth > 768) {
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');

    console.log('Desktop stats init:', { statsSection, statNumbers: statNumbers.length });

    if (statsSection && statNumbers.length > 0) {
      // Simple intersection observer for desktop
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            console.log('Stats section visible, starting animations');
            statNumbers.forEach((stat, index) => {
              setTimeout(() => {
                animateCounter(stat);
              }, index * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(statsSection);
    }
  }
});

/* ── NAVBAR SCROLL EFFECT (OPTIMIZED) ── */
const navbar = document.getElementById('navbar');
let scrollTimeout;
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Only update if scroll position changed significantly
  if (Math.abs(currentScrollY - lastScrollY) > 5) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      navbar.classList.toggle('scrolled', currentScrollY > 20);
      lastScrollY = currentScrollY;
    }, 10);
  }
}, { passive: true });

/* ── TESTIMONIALS (NEW CAROUSEL) ── */
const testimonialsNew = [
  {
    quote: 'RYX AI replaced three separate vendors and an internal microservice team. We now handle 40M messages a day through a single, predictable system.',
    name: 'Marcus Chen',
    title: 'VP of Engineering',
    company: 'Apex Financial',
    initials: 'MC',
    color: '#4f8ef7',
  },
  {
    quote: 'The safety layer is what sold us. We can deploy AI-generated responses to patients knowing every message has been validated before it goes out.',
    name: 'Dr. Priya Nair',
    title: 'Chief Digital Officer',
    company: 'MedCore Health',
    initials: 'PN',
    color: '#7c5cfc',
  },
  {
    quote: "Finally, infrastructure that can keep up with us. Black Friday, Prime Day — it doesn't matter. RYX AI doesn't flinch.",
    name: 'Jordan Kim',
    title: 'CTO',
    company: 'ShopStream',
    initials: 'JK',
    color: '#4f8ef7',
  },
  {
    quote: 'We cut communication failure incidents by 94% in the first month. The observability tooling alone was worth the switch.',
    name: 'Amara Osei',
    title: 'Head of Platform',
    company: 'TransitGov',
    initials: 'AO',
    color: '#7c5cfc',
  },
];

let currentTestimonialNew = 0;
let testimonialTimerNew = null;
let isHoveringTestimonial = false;

function renderTestimonialNew(index) {
  const t = testimonialsNew[index];
  const card = document.getElementById('testimonialCardNew');
  const text = document.getElementById('testimonialText');
  const avatar = document.getElementById('testimonialAvatar');
  const name = document.getElementById('testimonialName');
  const role = document.getElementById('testimonialRole');
  const company = document.getElementById('testimonialCompany');

  // Fade out
  card.classList.add('fade-out');

  setTimeout(() => {
    // Update content
    text.textContent = t.quote;
    avatar.textContent = t.initials;
    avatar.style.background = `linear-gradient(135deg, ${t.color}, ${t.color === '#4f8ef7' ? '#7c5cfc' : '#4f8ef7'})`;
    name.textContent = t.name;
    role.textContent = `${t.title} · ${t.company}`;
    company.textContent = t.company;

    // Update dots
    document.querySelectorAll('.testimonial-dot-new').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Fade in
    card.classList.remove('fade-out');
    card.classList.add('fade-in');
  }, 250);
}

function buildTestimonialDotsNew() {
  const dotsContainer = document.getElementById('testimonialDotsNew');
  if (!dotsContainer) return;

  dotsContainer.innerHTML = testimonialsNew.map((_, i) => `
    <button class="testimonial-dot-new ${i === 0 ? 'active' : ''}" 
            onclick="goToTestimonialNew(${i})" 
            aria-label="Testimonial ${i + 1}"></button>
  `).join('');
}

function goToTestimonialNew(index) {
  currentTestimonialNew = index;
  renderTestimonialNew(index);
  resetTimerNew();
}

function nextTestimonialNew() {
  currentTestimonialNew = (currentTestimonialNew + 1) % testimonialsNew.length;
  renderTestimonialNew(currentTestimonialNew);
  resetTimerNew();
}

function prevTestimonialNew() {
  currentTestimonialNew = (currentTestimonialNew - 1 + testimonialsNew.length) % testimonialsNew.length;
  renderTestimonialNew(currentTestimonialNew);
  resetTimerNew();
}

function resetTimerNew() {
  if (testimonialTimerNew) clearInterval(testimonialTimerNew);
  if (!isHoveringTestimonial) {
    testimonialTimerNew = setInterval(nextTestimonialNew, 5000);
  }
}

function startAutoplayNew() {
  if (!isHoveringTestimonial) {
    testimonialTimerNew = setInterval(nextTestimonialNew, 5000);
  }
}

function stopAutoplayNew() {
  if (testimonialTimerNew) {
    clearInterval(testimonialTimerNew);
    testimonialTimerNew = null;
  }
}

/* ── OLD TESTIMONIALS (LEGACY) ── */
const testimonials = [
  {
    quote: 'RYX AI replaced three separate vendors and an internal microservice team. We now handle 40M messages a day through a single, predictable system.',
    name: 'Marcus Chen', title: 'VP of Engineering', company: 'Apex Financial', initials: 'MC', color: '#4f8ef7',
  },
  {
    quote: 'The safety layer is what sold us. We can deploy AI-generated responses to patients knowing every message has been validated before it goes out.',
    name: 'Dr. Priya Nair', title: 'Chief Digital Officer', company: 'MedCore Health', initials: 'PN', color: '#7c5cfc',
  },
  {
    quote: "Finally, infrastructure that can keep up with us. Black Friday, Prime Day — it doesn't matter. RYX AI doesn't flinch.",
    name: 'Jordan Kim', title: 'CTO', company: 'ShopStream', initials: 'JK', color: '#4f8ef7',
  },
  {
    quote: 'We cut communication failure incidents by 94% in the first month. The observability tooling alone was worth the switch.',
    name: 'Amara Osei', title: 'Head of Platform', company: 'TransitGov', initials: 'AO', color: '#7c5cfc',
  },
];

let currentTestimonial = 0;
let testimonialTimer = null;

function renderTestimonial(index, direction = 1) {
  const body = document.getElementById('testimonialBody');
  if (!body) return;

  const t = testimonials[index];
  const glow = document.getElementById('testimonialGlow');
  const qm = document.getElementById('tQuoteMark');

  body.innerHTML = `
    <p class="testimonial-quote">"${t.quote}"</p>
    <div class="testimonial-author">
      <div class="author-avatar" style="background:linear-gradient(135deg,${t.color},${t.color === '#4f8ef7' ? '#7c5cfc' : '#4f8ef7'});">${t.initials}</div>
      <div>
        <div class="author-name">${t.name}</div>
        <div class="author-title">${t.title} · ${t.company}</div>
      </div>
    </div>
  `;
  body.classList.remove('anim');
  void body.offsetWidth;
  body.classList.add('anim');

  if (glow) glow.style.background = `radial-gradient(ellipse, ${t.color} 0%, transparent 65%)`;
  if (qm) qm.style.color = t.color;

  document.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function buildTestimonialDots() {
  const dots = document.getElementById('testimonialDots');
  if (!dots) return;

  dots.innerHTML = testimonials.map((_, i) => `
    <button class="dot ${i === 0 ? 'active' : ''}" onclick="goToTestimonial(${i})" aria-label="Testimonial ${i + 1}"></button>
  `).join('');
}

function goToTestimonial(index) {
  currentTestimonial = index;
  renderTestimonial(index);
  resetTimer();
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  renderTestimonial(currentTestimonial, 1);
  resetTimer();
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  renderTestimonial(currentTestimonial, -1);
  resetTimer();
}

function resetTimer() {
  if (testimonialTimer) clearInterval(testimonialTimer);
  testimonialTimer = setInterval(nextTestimonial, 6000);
}

if (document.getElementById('testimonialDots')) {
  buildTestimonialDots();
  renderTestimonial(0);
  resetTimer();
}

/* ── CONTACT FORM ── */
function handleFormSubmit(event) {
  event.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  const success = document.getElementById('contactSuccess');
  success.style.display = 'flex';
}

/* -- USE CASES TABS (HORIZONTAL) -- */
document.querySelectorAll('.uc-tab-h').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.uc-tab-h').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.uc-panel-h').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('panel-' + tab.dataset.panel);
    if (panel) panel.classList.add('active');
  });
});

/* ═══════════════════════════════════════════
   PREMIUM ANIMATION ENGINE v2
═══════════════════════════════════════════ */

/* ── SAFETY PILLS: burst → reset → repeat ── */
(function safetyPills() {
  const pills = document.querySelectorAll('.safety-pill');
  if (!pills.length) return;
  let i = 0;
  function step() {
    pills.forEach((p, idx) => {
      p.classList.toggle('lit', idx <= i);
    });
    if (i < pills.length - 1) {
      i++;
      setTimeout(step, 550);
    } else {
      // All lit: hold then reset
      setTimeout(() => {
        pills.forEach(p => p.classList.remove('lit'));
        i = 0;
        setTimeout(step, 600);
      }, 1400);
    }
  }
  step();
})();

/* ── WORKFLOW STEPS: sweep down → hold → reset ── */
(function workflowSteps() {
  const steps = document.querySelectorAll('.wf-step');
  const connectors = document.querySelectorAll('.wf-connector');
  if (!steps.length) return;
  let active = 0;
  function step() {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === active);
      s.classList.toggle('done', i < active);
    });
    connectors.forEach((c, i) => {
      c.style.background = i < active
        ? 'linear-gradient(to bottom, rgba(79,142,247,0.5), rgba(79,142,247,0.5))'
        : 'rgba(255,255,255,0.07)';
    });
    if (active < steps.length - 1) {
      active++;
      setTimeout(step, 750);
    } else {
      setTimeout(() => {
        active = 0;
        steps.forEach(s => { s.classList.remove('active', 'done'); });
        connectors.forEach(c => { c.style.background = ''; });
        setTimeout(step, 500);
      }, 1600);
    }
  }
  step();
})();

/* ── BAR CHART: cycle through random height patterns ── */
function startBarCycling() {
  const bars = document.querySelectorAll('.obs-bar:not(.obs-bar-active)');
  if (!bars.length) return;

  const patterns = [
    [55, 75, 45, 90, 72],
    [80, 40, 95, 55, 70],
    [60, 85, 50, 70, 55],
    [45, 70, 88, 52, 68],
  ];
  let p = 0;

  function pulse() {
    const pat = patterns[p % patterns.length];
    bars.forEach((b, i) => {
      b.style.transition = 'height 0.9s cubic-bezier(0.4,0,0.2,1)';
      b.style.height = (pat[i % pat.length]) + '%';
    });
    p++;
    setTimeout(pulse, 2200);
  }

  pulse();
}

/* ── ROUTING DIAGRAM: animate particles along lines ── */
(function routingLines() {
  const svg = document.querySelector('.route-lines');
  if (!svg) return;
  const lines = svg.querySelectorAll('line');
  lines.forEach((line, idx) => {
    line.style.strokeDasharray = '6 4';
    line.style.animation = `dashFlowEnhanced ${2 + idx * 0.2}s linear infinite`;
  });
})();

/* ── ORCHESTRATION + SECURITY: animate SVG dashed lines ── */
(function orchSecLines() {
  document.querySelectorAll('.orch-lines line, .sec-lines line').forEach((line, idx) => {
    line.style.strokeDasharray = '5 5';
    line.style.animation = `dashFlow ${1.5 + idx * 0.2}s linear infinite`;
    if (idx % 2 === 1) line.style.animationDirection = 'reverse';
  });
})();

/* ── STAGGERED SCROLL REVEAL for children ── */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('[data-stagger]');
      children.forEach((child, i) => {
        setTimeout(() => {
          child.classList.add('visible');
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, i * 120);
      });
      entry.target.classList.add('visible');
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.arch-diagram, .stats-row').forEach(el => {
  staggerObserver.observe(el);
  el.querySelectorAll('.arch-node, .arch-platform-node').forEach(child => {
    child.setAttribute('data-stagger', '');
    child.style.opacity = '0';
    child.style.transform = 'translateY(10px)';
    child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
});

/* ── ARCH SECTION: wave left → center → right ── */
(function archWave() {
  const inputs = document.querySelectorAll('.arch-col:first-child .arch-node');
  const platforms = document.querySelectorAll('.arch-platform-node');
  const outputs = document.querySelectorAll('.arch-col:last-child .arch-node');
  if (!inputs.length) return;
  function wave() {
    // Light inputs sequentially
    inputs.forEach((n, i) => setTimeout(() => {
      inputs.forEach(x => x.style.borderColor = '');
      n.style.borderColor = 'rgba(79,142,247,0.5)';
      n.style.boxShadow = '0 0 8px rgba(79,142,247,0.2)';
      setTimeout(() => { n.style.borderColor = ''; n.style.boxShadow = ''; }, 500);
    }, i * 200));
    // Then platform center
    setTimeout(() => {
      platforms.forEach((p, i) => setTimeout(() => {
        p.style.boxShadow = '0 0 18px rgba(79,142,247,0.45)';
        p.style.borderColor = 'rgba(79,142,247,0.6)';
        setTimeout(() => { p.style.boxShadow = ''; p.style.borderColor = ''; }, 600);
      }, i * 200));
    }, inputs.length * 200 + 200);
    // Then outputs
    setTimeout(() => {
      outputs.forEach((n, i) => setTimeout(() => {
        n.style.borderColor = 'rgba(79,142,247,0.5)';
        n.style.boxShadow = '0 0 8px rgba(79,142,247,0.2)';
        setTimeout(() => { n.style.borderColor = ''; n.style.boxShadow = ''; }, 500);
      }, i * 180));
    }, inputs.length * 200 + platforms.length * 200 + 400);
    // Repeat
    const total = (inputs.length + platforms.length + outputs.length) * 220 + 1200;
    setTimeout(wave, total);
  }
  setTimeout(wave, 800);
})();

/* ── ROUTE NODES: CSS animations handle the glow effect ── */
/* Removed JavaScript pulse - now handled by CSS @keyframes nodePulseGlow */

/* ── ORCH AGENTS: sequential highlight ── */
(function orchAgentPulse() {
  const agents = document.querySelectorAll('.orch-agent');
  if (!agents.length) return;
  let i = 0;
  function pulse() {
    agents.forEach(a => { a.style.boxShadow = ''; a.style.borderColor = ''; });
    agents[i].style.boxShadow = '0 0 18px rgba(124,92,252,0.5)';
    agents[i].style.borderColor = 'rgba(124,92,252,0.7)';
    i = (i + 1) % agents.length;
    setTimeout(pulse, 800);
  }
  pulse();
})();

/* ── SECURITY NODES: sequential highlight ── */
(function secNodePulse() {
  const nodes = document.querySelectorAll('.sec-node');
  if (!nodes.length) return;
  let i = 0;
  function pulse() {
    nodes.forEach(n => { n.style.boxShadow = ''; n.style.borderColor = ''; });
    nodes[i].style.boxShadow = '0 0 18px rgba(124,92,252,0.5)';
    nodes[i].style.borderColor = 'rgba(124,92,252,0.7)';
    i = (i + 1) % nodes.length;
    setTimeout(pulse, 900);
  }
  pulse();
})();

/* ── HERO: subtle float effect ── */
(function heroFloat() {
  const content = document.querySelector('.hero-content');
  if (!content) return;
  content.style.animation = 'heroFloat 6s ease-in-out infinite';
})();


/* ============================================================
   BOOK MEETING MODAL LOGIC
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('bookMeetingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('bookMeetingForm');

  // Find all buttons that should open the modal
  const openButtons = document.querySelectorAll('[data-modal-trigger="book-meeting"]');

  // Open Modal
  const openModal = (e) => {
    e.preventDefault();
    if (modal) {
      modal.classList.add('modal-open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      document.documentElement.style.overflow = 'hidden'; // Ensure HTML tag is locked too
    }
  };

  // Close Modal
  const closeModal = () => {
    if (modal) {
      modal.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      // Optionally reset form on close
      // if (form) form.reset();
    }
  };

  // Attach event listeners to all trigger buttons
  openButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  // Close on X button click
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close on click outside the inner container
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.modal-submit-btn');
      const originalText = submitBtn.innerHTML;

      // Change button state
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      // Extract form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // -------------------------------------------------------------
      // ?? UPDATE THIS URL to your Google Apps Script / Make.com Webhook 
      // -------------------------------------------------------------
      const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzeX4n5N0BttcQcE2oYwVl_4Dno12Qlo6QO7xhMU6KaU5lgw4Q5S4_H-sFW6O69nXas/exec';

      try {
        console.log("Submitting lead data:", data);

        // Actual network request to Google Apps Script Webhook
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // Required for Google Scripts to avoid CORS block
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        // Success State
        submitBtn.innerHTML = '<span>Request Sent!</span><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
        submitBtn.style.background = '#10b981'; // Success green

        // Close modal after success
        setTimeout(() => {
          closeModal();
          form.reset();

          // Reset button to original state
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 300);

        }, 2000);

      } catch (error) {
        console.error('Error submitting form:', error);
        submitBtn.innerHTML = '<span>Error! Try Again</span>';
        submitBtn.style.background = '#ef4444'; // Error red

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }
});

