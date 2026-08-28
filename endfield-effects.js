/* ======================================================
   SHIN ENDFIELD - INTERACTIVE EFFECTS
   Tactical UI Interactions & Animations
   ====================================================== */

// ======================================================
// CURSOR CUSTOM
// ======================================================

class TacticalCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.cursorCore = this.cursor.querySelector('.cursor-core');
    this.cursorRing = this.cursor.querySelector('.cursor-ring');
    
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => this.updatePosition(e));
    document.addEventListener('mouseenter', () => this.show());
    document.addEventListener('mouseleave', () => this.hide());
    
    // Interactive elements
    this.setupInteractiveElements();
  }

  updatePosition(e) {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    
    this.x += (this.targetX - this.x) * 0.3;
    this.y += (this.targetY - this.y) * 0.3;
    
    this.cursor.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  show() {
    this.cursor.style.opacity = '1';
  }

  hide() {
    this.cursor.style.opacity = '0';
  }

  setupInteractiveElements() {
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, .tactical-button, .tactical-link'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('cursor-active');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('cursor-active');
      });
    });
  }
}

// ======================================================
// LOADER & BOOT SEQUENCE
// ======================================================

class BootSequence {
  constructor() {
    this.loader = document.getElementById('loader');
    this.skipBtn = document.getElementById('skipIntro');
    this.progressBar = document.querySelector('.loader-progress');
    this.loadingText = document.getElementById('loadingText');
    
    this.messages = [
      'INITIALIZING ENDFIELD_OS...',
      'CONNECTING NEURAL LINK...',
      'LOADING TACTICAL DATABASE...',
      'SCANNING SYSTEM RESOURCES...',
      'ESTABLISHING SECURE CONNECTION...',
      'MOUNTING VIRTUAL ENVIRONMENT...',
      'TACTICAL INTERFACE LOADING...',
      'SYSTEM READY FOR DEPLOYMENT'
    ];

    this.init();
  }

  init() {
    this.skipBtn.addEventListener('click', () => this.skip());
    this.startBoot();
  }

  startBoot() {
    let progress = 0;
    let messageIndex = 0;

    const bootInterval = setInterval(() => {
      progress += Math.random() * 25;
      progress = Math.min(progress, 100);

      this.progressBar.style.width = progress + '%';

      // Update message every 12.5% progress
      if (Math.floor(progress / 12.5) > messageIndex) {
        messageIndex = Math.floor(progress / 12.5);
        if (this.messages[messageIndex]) {
          this.loadingText.textContent = this.messages[messageIndex];
          this.playBootSound();
        }
      }

      if (progress >= 100) {
        clearInterval(bootInterval);
        setTimeout(() => this.complete(), 800);
      }
    }, 300);
  }

  playBootSound() {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio context not available, skip
    }
  }

  complete() {
    this.loader.style.opacity = '0';
    this.loader.style.pointerEvents = 'none';
    document.body.style.overflow = 'auto';
  }

  skip() {
    this.progressBar.style.width = '100%';
    this.loadingText.textContent = 'SYSTEM READY FOR DEPLOYMENT';
    setTimeout(() => this.complete(), 400);
  }
}

// ======================================================
// TACTICAL GLITCH EFFECT
// ======================================================

class GlitchEffect {
  constructor() {
    this.glitchElements = document.querySelectorAll('.glitch');
    this.init();
  }

  init() {
    this.glitchElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.trigger(el));
    });
  }

  trigger(element) {
    if (element.classList.contains('glitching')) return;

    element.classList.add('glitching');

    const originalText = element.textContent;
    const iterations = 8;

    for (let i = 0; i < iterations; i++) {
      setTimeout(() => {
        element.textContent = this.randomizeText(originalText);
      }, i * 50);
    }

    setTimeout(() => {
      element.textContent = originalText;
      element.classList.remove('glitching');
    }, iterations * 50);
  }

  randomizeText(text) {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    return text
      .split('')
      .map(char => (Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : char))
      .join('');
  }
}

// ======================================================
// TACTICAL SCAN EFFECT
// ======================================================

class ScanEffect {
  constructor() {
    this.projectCards = document.querySelectorAll('.tactical-project-card');
    this.init();
  }

  init() {
    this.projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => this.startScan(card));
      card.addEventListener('mouseleave', () => this.stopScan(card));
    });
  }

  startScan(card) {
    const scanline = document.createElement('div');
    scanline.className = 'scan-laser';
    scanline.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom, transparent, #ffc800, transparent);
      box-shadow: 0 0 10px #ffc800;
      animation: scanHorizontal 0.8s ease-in-out;
      z-index: 10;
    `;

    card.style.position = 'relative';
    card.appendChild(scanline);

    setTimeout(() => scanline.remove(), 800);
  }

  stopScan(card) {
    const scanlines = card.querySelectorAll('.scan-laser');
    scanlines.forEach(line => line.remove());
  }
}

// ======================================================
// PARTICLE SYSTEM
// ======================================================

class ParticleSystem {
  constructor() {
    this.container = document.getElementById('particles');
    this.particleCount = 30;
    this.init();
  }

  init() {
    this.createParticles();
    window.addEventListener('resize', () => this.updateParticles());
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 3 + 2;
      const duration = Math.random() * 5 + 8;
      const delay = Math.random() * 2;
      const xPos = Math.random() * 100;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${xPos}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

      this.container.appendChild(particle);
    }
  }

  updateParticles() {
    this.container.innerHTML = '';
    this.createParticles();
  }
}

// ======================================================
// TACTICAL HUD STATUS
// ======================================================

class TacticalHUD {
  constructor() {
    this.header = document.querySelector('.tactical-header');
    this.statusDot = document.querySelector('.status-dot');
    this.init();
  }

  init() {
    this.monitorSections();
    this.setupScrollIndicators();
  }

  monitorSections() {
    const sections = document.querySelectorAll('[id^="home"], [id^="about"], [id^="skills"], [id^="projects"], [id^="contact"]');
    const navLinks = document.querySelectorAll('.main-nav a');

    window.addEventListener('scroll', () => {
      let current = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    });
  }

  setupScrollIndicators() {
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');

    window.addEventListener('scroll', () => {
      scrollIndicators.forEach(indicator => {
        const rect = indicator.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          indicator.style.opacity = Math.max(0, 1 - (window.scrollY / (window.innerHeight * 2)));
        }
      });
    });
  }
}

// ======================================================
// TACTICAL FORM HANDLER
// ====================================================== 

class TacticalFormHandler {
  constructor() {
    this.form = document.getElementById('contactForm');
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupFieldInteractions();
  }

  setupFieldInteractions() {
    const fields = this.form.querySelectorAll('input, textarea');

    fields.forEach(field => {
      field.addEventListener('focus', () => {
        field.parentElement.style.borderColor = '#ffc800';
        field.parentElement.style.boxShadow = '0 0 15px rgba(255, 200, 0, 0.3)';
      });

      field.addEventListener('blur', () => {
        field.parentElement.style.borderColor = 'rgba(255, 200, 0, 0.3)';
        field.parentElement.style.boxShadow = 'none';
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const name = this.form.querySelector('#name').value;
    const email = this.form.querySelector('#email').value;
    const message = this.form.querySelector('#message').value;

    if (!name || !email || !message) {
      alert('[ERROR] ALL FIELDS REQUIRED');
      return;
    }

    // Show success message
    const btn = this.form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = '[TRANSMISSION SENT]';
    btn.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';

    // Reset form
    setTimeout(() => {
      this.form.reset();
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 3000);

    // Here you would typically send the data to a server
    console.log('Form submitted:', { name, email, message });
  }
}

// ======================================================
// SCROLL ANIMATIONS
// ====================================================== 

class ScrollAnimations {
  constructor() {
    this.cards = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    this.cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease-out';
      observer.observe(card);
    });
  }
}

// ======================================================
// TILT EFFECT FOR CARDS
// ====================================================== 

class CardTilt {
  constructor() {
    this.cards = document.querySelectorAll('[data-tilt]');
    this.init();
  }

  init() {
    if (typeof VanillaTilt !== 'undefined') {
      this.cards.forEach(card => {
        VanillaTilt.init(card, {
          max: 5,
          scale: 1.02,
          speed: 400,
          transition: true
        });
      });
    }
  }
}

// ======================================================
// INITIALIZATION
// ====================================================== 

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all systems
  new TacticalCursor();
  new BootSequence();
  new GlitchEffect();
  new ScanEffect();
  new ParticleSystem();
  new TacticalHUD();
  new TacticalFormHandler();
  new ScrollAnimations();
  new CardTilt();

  // Register GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    setupGSAPAnimations();
  }

  console.log('[SHIN ENDFIELD] System initialized. All systems operational.');
});

// ======================================================
// GSAP ANIMATIONS
// ====================================================== 

function setupGSAPAnimations() {
  // Hero section animation
  gsap.from('.hero-content', {
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power2.out'
  });

  gsap.from('.hero-visual', {
    opacity: 0,
    x: 100,
    duration: 1.2,
    delay: 0.2,
    ease: 'power2.out'
  });

  // Section titles animation
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        markers: false
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Card stagger animation
  gsap.utils.toArray('.tactical-skill-card, .tactical-project-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%'
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });

  // Rotate orb
  gsap.to('.hero-orb', {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  });

  // Animate orb rings
  gsap.to('.orb-ring', {
    rotation: -360,
    duration: 15,
    repeat: -1,
    ease: 'none',
    stagger: 0.2
  });
}

// ======================================================
// UTILITY FUNCTIONS
// ====================================================== 

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to focus search/command
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    console.log('[COMMAND] Ready for input');
  }

  // ESC to close any modals
  if (e.key === 'Escape') {
    console.log('[SYSTEM] Closing active modal');
  }
});

// Performance monitoring
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    console.log(`[PERFORMANCE] Page load time: ${loadTime}ms`);
  });
}

// Add to CSS for scan animation
const style = document.createElement('style');
style.textContent = `
  @keyframes scanHorizontal {
    from {
      left: 0;
    }
    to {
      left: 100%;
    }
  }

  @keyframes titleFlow {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 250% center;
    }
  }

  @keyframes heroGradient {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 300% center;
    }
  }

  .cursor-active .cursor-ring {
    width: 70px;
    height: 70px;
    border-color: #ffc800;
    box-shadow: 0 0 20px rgba(255, 200, 0, 0.6);
  }
`;
document.head.appendChild(style);
