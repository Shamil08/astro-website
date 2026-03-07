/* ============================================================
   RYXAI — Application JavaScript
   ============================================================ */

/* ── INITIALIZE GSAP ANIMATIONS ── */
// Ensure content is visible first
document.body.style.opacity = '1';

window.addEventListener('load', function() {
  
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

  /* ── STATS COUNTER ANIMATION ── */
  function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const isDecimal = target % 1 !== 0;

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

  // Trigger stats animation on scroll
  if (document.querySelector('.stats-section')) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Set initial state for stat items
    gsap.set('.stat-item', { opacity: 0, y: 40 });
    
    ScrollTrigger.create({
      trigger: '.stats-section',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        statNumbers.forEach((stat, index) => {
          setTimeout(() => {
            animateCounter(stat);
          }, index * 100); // Stagger each stat by 100ms
        });
      }
    });

    // Animate the stat items rising from bottom
    gsap.to('.stat-item', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%'
      }
    });
  }

  /* ── HOW IT WORKS: TIMELINE ANIMATION ── */
  const howLineFill = document.getElementById('howLineFill');
  const howSteps = gsap.utils.toArray('.how-step-row');
  const timelineNodes = gsap.utils.toArray('.how-timeline-node');

  if (howLineFill && howSteps.length > 0) {
    // Ensure timeline elements are visible by default
    gsap.set('.how-step-content', { opacity: 1, x: 0 });
    gsap.set('.how-step-number', { opacity: 1, scale: 1 });
    
    // Animate timeline line fill on scroll
    gsap.to(howLineFill, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.how-steps-wrap',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    });

    // Animate each step as it comes into view
    howSteps.forEach((step, index) => {
      const node = timelineNodes[index];
      const content = step.querySelector('.how-step-content');
      const number = step.querySelector('.how-step-number');

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

      // Node activation
      if (node) {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => node.classList.add('active'),
          onLeave: () => node.classList.remove('active'),
          onEnterBack: () => node.classList.add('active'),
          onLeaveBack: () => node.classList.remove('active')
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

  /* ── ORCHESTRATION DIAGRAM ANIMATION ── */
  if (document.querySelector('.orchestration-diagram-box')) {
    const orchItems = gsap.utils.toArray('.orch-item, .orch-platform-card, .orch-bottom-item, .orch-avatar');
    gsap.set(orchItems, { opacity: 1, y: 0 });
    
    gsap.from('.orchestration-diagram-box', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.orchestration-diagram-box',
        start: 'top 80%'
      }
    });
    
    gsap.from('.orch-platform-card', {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.orch-platform-cards',
        start: 'top 80%'
      }
    });
    
    gsap.from('.orch-item', {
      opacity: 0,
      x: -20,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.orch-grid',
        start: 'top 75%'
      }
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

}); // End window load

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

/* ── MOBILE MENU ── */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');

mobileMenuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuIcon.innerHTML = isOpen
    ? '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
    : '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>';
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  menuIcon.innerHTML = '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>';
}
document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(el => {
  el.addEventListener('click', closeMobileMenu);
});

/* ── SOLUTIONS TABS ── */
const solutions = [
  {
    color: '#4f8ef7',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
    industry: 'Financial Services',
    headline: 'Compliant outreach at any scale.',
    body: 'Automate client notifications, fraud alerts, and account communications across millions of customers — with full audit trails and regulatory compliance baked in.',
    stat: '40M+', statLabel: 'messages/day per client',
    keywords: ['SOC 2', 'Audit Logs', 'Fraud Alerts', 'Regulatory'],
  },
  {
    color: '#7c5cfc',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
    industry: 'Healthcare',
    headline: 'Patient-safe communications, zero exceptions.',
    body: 'Deliver appointment reminders, lab results, and care plan updates with HIPAA-compliant guardrails on every outbound message.',
    stat: '5ms', statLabel: 'safety policy enforcement',
    keywords: ['HIPAA', 'Appointment Reminders', 'Lab Results', 'PII Safe'],
  },
  {
    color: '#4f8ef7',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    industry: 'E-Commerce',
    headline: 'From cart to delivery — every touchpoint covered.',
    body: 'Automate order confirmations, shipping updates, and post-purchase flows that handle Black Friday traffic without a single failure.',
    stat: '10B+', statLabel: 'messages handled monthly',
    keywords: ['Order Updates', 'Shipping', 'Post-Purchase', 'Scale'],
  },
  {
    color: '#7c5cfc',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    industry: 'Government',
    headline: 'Public-scale alerts with zero tolerance for failure.',
    body: 'Deliver public notifications, emergency alerts, and citizen service responses at municipal or national scale.',
    stat: '<80ms', statLabel: 'emergency alert latency',
    keywords: ['Emergency Alerts', 'Multi-Channel', 'Accessibility', 'Audit'],
  },
  {
    color: '#4f8ef7',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    industry: 'Travel & Logistics',
    headline: 'Proactive status intelligence.',
    body: 'Push flight changes, delivery exceptions, and route updates in real time — before your customers need to ask.',
    stat: '200ms', statLabel: 'avg. proactive alert speed',
    keywords: ['Flight Updates', 'Delivery Exceptions', 'Real-Time', 'Proactive'],
  },
  {
    color: '#7c5cfc',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`,
    industry: 'Education',
    headline: 'Personalized learner journeys.',
    body: 'Automate enrollment flows, progress nudges, and institutional communications across thousands of students simultaneously.',
    stat: '85%', statLabel: 'course completion lift',
    keywords: ['Enrollment', 'Progress Nudges', 'Personalization', 'Bulk Send'],
  },
];

let currentSolution = 0;

function buildSolutionTabs() {
  const tabs = document.getElementById('solutionsTabs');
  tabs.innerHTML = solutions.map((s, i) => `
    <button type="button" class="sol-tab ${i === 0 ? 'active' : ''}" onclick="selectSolution(${i})" aria-selected="${i === 0}" aria-label="Select ${s.industry}">
      <div class="sol-tab-indicator"></div>
      <div class="sol-tab-icon">${s.icon}</div>
      <span class="sol-tab-label">${s.industry}</span>
    </button>
  `).join('');
}

function renderSolutionContent(index) {
  const s = solutions[index];
  const content = document.getElementById('solutionsContent');
  content.innerHTML = `
    <div class="sol-industry" style="color:${s.color};">${s.icon}<span>${s.industry.toUpperCase()}</span></div>
    <h3 class="sol-headline">${s.headline}</h3>
    <p class="sol-body">${s.body}</p>
    <div class="sol-stats-row">
      <div class="sol-stat-box">
        <div class="sol-stat-value" style="color:${s.color};">${s.stat}</div>
        <div class="sol-stat-label">${s.statLabel}</div>
      </div>
      <div class="sol-keywords">
        ${s.keywords.map(k => `<span class="sol-keyword">${k}</span>`).join('')}
      </div>
    </div>
    <a href="#contact" class="sol-cta">
      See how it works for ${s.industry.toLowerCase()}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    </a>
  `;
  content.classList.remove('sol-fade-in');
  void content.offsetWidth;
  content.classList.add('sol-fade-in');
}

function selectSolution(index) {
  currentSolution = index;
  document.querySelectorAll('.sol-tab').forEach((t, i) => {
    t.classList.toggle('active', i === index);
    t.setAttribute('aria-selected', i === index);
  });
  renderSolutionContent(index);
}

buildSolutionTabs();
renderSolutionContent(0);

/* ── TESTIMONIALS (NEW CAROUSEL) ── */
const testimonialsNew = [
  {
    quote: 'RyxAI replaced three separate vendors and an internal microservice team. We now handle 40M messages a day through a single, predictable system.',
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
    quote: "Finally, infrastructure that can keep up with us. Black Friday, Prime Day — it doesn't matter. RyxAI doesn't flinch.",
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
    quote: 'RyxAI replaced three separate vendors and an internal microservice team. We now handle 40M messages a day through a single, predictable system.',
    name: 'Marcus Chen', title: 'VP of Engineering', company: 'Apex Financial', initials: 'MC', color: '#4f8ef7',
  },
  {
    quote: 'The safety layer is what sold us. We can deploy AI-generated responses to patients knowing every message has been validated before it goes out.',
    name: 'Dr. Priya Nair', title: 'Chief Digital Officer', company: 'MedCore Health', initials: 'PN', color: '#7c5cfc',
  },
  {
    quote: "Finally, infrastructure that can keep up with us. Black Friday, Prime Day — it doesn't matter. RyxAI doesn't flinch.",
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
(function barChart() {
  const bars = document.querySelectorAll('.obs-bar:not(.obs-bar-active)');
  if (!bars.length) return;
  const patterns = [
    [55,75,45,90,62,80,70,58,72],
    [80,40,95,55,75,45,85,65,70],
    [60,85,50,70,40,88,65,78,55],
    [45,70,88,52,76,60,90,48,68],
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
})();

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
