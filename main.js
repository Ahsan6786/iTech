/* ==========================================================================
   iTech Robotics & Automation - Client Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Header Scroll Behavior
     ========================================================================== */
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Highlighting active section link on scroll
  const handleActiveNavLink = () => {
    let scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset for nav height
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    handleActiveNavLink();
  });
  handleHeaderScroll(); // Initialize on load

  /* ==========================================================================
     2. Mobile Navigation Toggle
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navItems = document.querySelectorAll('.nav-link');

  const toggleMobileNav = () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  mobileToggle.addEventListener('click', toggleMobileNav);

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  const contactMobileBtn = document.getElementById('btn-nav-contact-mobile');
  if (contactMobileBtn) {
    contactMobileBtn.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  }

  // Close mobile nav when clicking outside the navbar
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  /* ==========================================================================
     3. Scroll-Reveal Animations (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once triggered
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     4. Stats Counter Animation
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');

  const startCounters = (statElement) => {
    const target = parseInt(statElement.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;

    const timer = setInterval(() => {
      // Accelerate count for higher numbers
      if (target > 500) {
        current += Math.ceil(target / 100);
      } else {
        current += 1;
      }

      if (current >= target) {
        statElement.textContent = target;
        clearInterval(timer);
      } else {
        statElement.textContent = current;
      }
    }, Math.max(stepTime, 12));
  };

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.stat-number');
        numbers.forEach(num => startCounters(num));
        observer.unobserve(entry.target); // Run count only once
      }
    });
  }, {
    threshold: 0.2
  });

  const achievementsSection = document.querySelector('.achievements-section');
  if (achievementsSection) {
    statObserver.observe(achievementsSection);
  }

  /* ==========================================================================
     5. Interactive Solutions Showcase Tabs
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.showcase-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Update tab button classes
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel view states
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('id') === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });

  /* ==========================================================================
     6. Vision HUD Camera Feed Simulation
     ========================================================================== */
  const statusIndicator = document.getElementById('sim-status-indicator');
  const statusText = statusIndicator ? statusIndicator.querySelector('.indicator-txt') : null;
  const accuracyCounter = document.getElementById('sim-accuracy-counter');
  
  const simulationParts = [
    { id: 'AX-8924', name: 'ENGINE_BLOCK' },
    { id: 'WK-1022', name: 'SIDE_FRAME' },
    { id: 'CH-4190', name: 'BOGIE_JOINT' },
    { id: 'DF-0455', name: 'SUPPORT_BRACKET' }
  ];
  
  let currentPartIndex = 0;

  const runVisionSimulation = () => {
    if (!statusIndicator || !statusText) return;

    // Reset status to ANALYZING
    statusIndicator.className = 'hud-indicator active';
    statusText.textContent = 'ANALYZING';
    
    // Randomize accuracy counter during sweep
    let counterInterval = setInterval(() => {
      const tempAcc = (Math.random() * (99.9 - 95.0) + 95.0).toFixed(1);
      accuracyCounter.textContent = tempAcc;
    }, 150);

    // Conclude inspection after 2.5s
    setTimeout(() => {
      clearInterval(counterInterval);
      
      // Update state to OK/PASS
      statusIndicator.className = 'hud-indicator ok';
      statusText.textContent = 'PASS';
      
      // Set high final inspection confidence
      const finalAcc = (Math.random() * (99.9 - 99.5) + 99.5).toFixed(1);
      accuracyCounter.textContent = finalAcc;

      // Queue next part switch after 3 seconds
      setTimeout(() => {
        currentPartIndex = (currentPartIndex + 1) % simulationParts.length;
        const currentPart = simulationParts[currentPartIndex];
        
        const partHudBox = document.querySelector('.hud-box.bottom-left');
        if (partHudBox) {
          partHudBox.innerHTML = `
            <span>PART: ${currentPart.id}</span>
            <span>TYPE: ${currentPart.name}</span>
          `;
        }
        
        // Loop simulation
        runVisionSimulation();
      }, 3500);

    }, 2500);
  };

  // Start feed cycle when Vision section is visible
  const visionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runVisionSimulation();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const visionSection = document.getElementById('vision');
  if (visionSection) {
    visionObserver.observe(visionSection);
  }

  /* ==========================================================================
     7. Careers Apply Modal
     ========================================================================== */
  const applyModal = document.getElementById('apply-modal');
  const applyButtons = document.querySelectorAll('.btn-apply');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const modalJobTitle = document.getElementById('modal-job-title');
  const applyJobNameInput = document.getElementById('apply-job-name');
  const jobForm = document.getElementById('job-apply-form');
  const applyModalStatus = document.getElementById('apply-modal-status');

  const openApplyModal = (jobTitle) => {
    modalJobTitle.textContent = jobTitle;
    applyJobNameInput.value = jobTitle;
    applyModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeApplyModal = () => {
    applyModal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
    jobForm.reset();
    applyModalStatus.textContent = '';
    applyModalStatus.className = 'form-status-msg';
  };

  applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const job = btn.getAttribute('data-job');
      openApplyModal(job);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeApplyModal);
  }

  // Close modal by clicking outside form box
  if (applyModal) {
    applyModal.addEventListener('click', (e) => {
      if (e.target === applyModal) {
        closeApplyModal();
      }
    });
  }

  // Handle Candidate Application Form
  if (jobForm) {
    jobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      applyModalStatus.className = 'form-status-msg';
      applyModalStatus.textContent = 'Submitting candidate file...';
      
      setTimeout(() => {
        applyModalStatus.className = 'form-status-msg success';
        applyModalStatus.textContent = 'Application submitted successfully. Our HR engineering team will reach out soon.';
        
        // Auto-close modal after delay
        setTimeout(() => {
          closeApplyModal();
        }, 2200);
      }, 1500);
    });
  }

  /* ==========================================================================
     8. Contact Form Integration
     ========================================================================== */
  const contactForm = document.getElementById('project-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      formStatus.className = 'form-status-msg';
      formStatus.textContent = 'Running feasibility model and packaging scope...';
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        formStatus.className = 'form-status-msg success';
        formStatus.textContent = 'Inquiry sent! Thank you, our engineering department will follow up within 24 hours.';
        
        contactForm.reset();
        if (submitBtn) submitBtn.disabled = false;
        
        // Clear message after 6 seconds
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status-msg';
        }, 6000);
      }, 2000);
    });
  }

  /* ==========================================================================
     9. Scroll to Top Button Interaction
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
