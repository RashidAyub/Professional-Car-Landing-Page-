/**
 * ==========================================================================
 * VELOCITY MOTORS — JAVASCRIPT CONTROLLER
 * Author: Senior Frontend Developer & UI/UX Designer
 * Features: Mobile Nav Drawer, Scroll Spy, Fleet Filter, Dynamic Modals,
 *           Performance Count-Up Telemetry, Keyboard Accessibility & Toast
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. VEHICLE SPECIFICATIONS DATABASE (For Dynamic Details Modal)
  // ------------------------------------------------------------------------
  const VEHICLE_DATA = {
    'phantom-gt': {
      model: 'Velocity Phantom GT',
      category: 'Grand Tourer',
      price: '$285,000',
      badge: 'Twin-Turbo V8',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      overview: 'The Velocity Phantom GT redefines high-speed luxury grand touring. Designed for cross-continental sprints with effortless grace, it pairs a hand-built 4.0L twin-turbocharged V8 with a bespoke semi-aniline leather sanctuary.',
      specs: {
        engine: '4.0L Bi-Turbo V8 Handcrafted Engine',
        horsepower: '850 HP @ 7,800 RPM',
        accel: '2.7 seconds (0–60 MPH)',
        topSpeed: '211 MPH (340 km/h)',
        gearbox: '8-Speed Dual-Clutch F1 Paddle Shift',
        weight: '1,620 kg (Carbon-Aluminum Hybrid)'
      }
    },
    'apex-stradale': {
      model: 'Velocity Apex Stradale',
      category: 'Pure Hypercar',
      price: '$365,000',
      badge: 'Flagship V12',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
      overview: 'Velocity\'s uncompromising flagship. Born from wind-tunnel perfection and endurance racing pedigree, the Apex Stradale breathes through a high-revving 6.5L naturally aspirated V12 singing to 9,500 RPM alongside race-derived active aerodynamic foils.',
      specs: {
        engine: '6.5L Naturally Aspirated V12',
        horsepower: '940 HP @ 9,500 RPM',
        accel: '2.4 seconds (0–60 MPH)',
        topSpeed: '224 MPH (360 km/h)',
        gearbox: '7-Speed Ultra-Light Sequential DCT',
        weight: '1,390 kg (Pre-preg Carbon Monocoque)'
      }
    },
    'electra-ev': {
      model: 'Velocity Electra EV',
      category: 'Pure Electric AWD',
      price: '$410,000',
      badge: 'Quad Motor • 800V',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      overview: 'Silent fury unleashed. Four independent axial-flux electric motors with vectoring torque distribution deliver lightning-fast launches with zero tailpipe emissions. Featuring 800V silicon-carbide architecture for 10-80% ultra-fast charge in 14 minutes.',
      specs: {
        engine: 'Quad Independent Axial-Flux Electric Motors',
        horsepower: '1,150 HP & 1,350 Nm Instant Torque',
        accel: '1.95 seconds (0–60 MPH)',
        topSpeed: '225 MPH (362 km/h)',
        gearbox: 'Direct Drive Single-Speed Dual Axle',
        weight: '1,890 kg (Structural Battery Monocell)'
      }
    }
  };

  // ------------------------------------------------------------------------
  // 2. DOM REFERENCES
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');
  const toastContainer = document.getElementById('toast-container');

  // Filter Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const carCards = document.querySelectorAll('.car-card');

  // Modals
  const modalTestDrive = document.getElementById('modal-test-drive');
  const modalCarDetails = document.getElementById('modal-car-details');
  const modalOpenTriggers = document.querySelectorAll('.modal-open-trigger');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const testDriveForm = document.getElementById('test-drive-form');
  const modalSuccessState = document.getElementById('modal-success-state');
  const formModelSelect = document.getElementById('form-model');
  const formDateInput = document.getElementById('form-date');
  const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

  // Newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  // Performance Stat Counters
  const statCounters = document.querySelectorAll('.stat-counter');

  // ------------------------------------------------------------------------
  // 3. AUTO-UPDATE COPYRIGHT YEAR
  // ------------------------------------------------------------------------
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Set minimum date for test drive booking to tomorrow
  if (formDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    formDateInput.min = tomorrow.toISOString().split('T')[0];
    formDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // ------------------------------------------------------------------------
  // 4. NAVBAR SCROLL EFFECT & SCROLL SPY
  // ------------------------------------------------------------------------
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Sticky navbar styling
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Scroll Spy for active navigation links
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ------------------------------------------------------------------------
  // 5. MOBILE DRAWER NAVIGATION
  // ------------------------------------------------------------------------
  const toggleMobileDrawer = (isOpen) => {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer.classList.contains('open');
    if (shouldOpen) {
      mobileDrawer.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileDrawer());
  }

  // Close drawer when clicking mobile nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileDrawer(false));
  });

  // Close drawer if clicking outside drawer
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open') && 
        !mobileDrawer.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      toggleMobileDrawer(false);
    }
  });

  // ------------------------------------------------------------------------
  // 6. FLEET CATEGORY FILTER
  // ------------------------------------------------------------------------
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards
      carCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Fleet links in footer that filter fleet section
  document.querySelectorAll('.fleet-filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetFilter = link.getAttribute('data-filter');
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${targetFilter}"]`);
      if (targetBtn) {
        targetBtn.click();
      }
    });
  });

  // ------------------------------------------------------------------------
  // 7. MODALS CONTROLLER (TEST DRIVE & VEHICLE DETAILS)
  // ------------------------------------------------------------------------
  const openModal = (modalElement) => {
    if (!modalElement) return;
    modalElement.classList.add('open');
    modalElement.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = modalElement.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = (modalElement) => {
    if (!modalElement) return;
    modalElement.classList.remove('open');
    modalElement.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // If closing test drive modal, reset form state after delay
    if (modalElement === modalTestDrive) {
      setTimeout(() => {
        if (testDriveForm) testDriveForm.style.display = 'flex';
        if (modalSuccessState) modalSuccessState.style.display = 'none';
      }, 300);
    }
  };

  // Close triggers
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-backdrop');
      closeModal(parentModal);
    });
  });

  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalElem = document.querySelector('.modal-backdrop.open');
      if (openModalElem) {
        closeModal(openModalElem);
      }
      if (mobileDrawer.classList.contains('open')) {
        toggleMobileDrawer(false);
      }
    }
  });

  // Open triggers
  modalOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const modalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      
      // If clicking test drive from car card, pre-select model
      const carModel = trigger.getAttribute('data-car-model');
      if (carModel && formModelSelect) {
        for (let i = 0; i < formModelSelect.options.length; i++) {
          if (formModelSelect.options[i].text.includes(carModel) || formModelSelect.options[i].value === carModel) {
            formModelSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Close car details modal first if opening test drive from it
      if (modalId === 'modal-test-drive' && modalCarDetails.classList.contains('open')) {
        closeModal(modalCarDetails);
      }

      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  // View Details Buttons Handler (Populate modal dynamically)
  viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const carId = btn.getAttribute('data-car-id');
      const data = VEHICLE_DATA[carId];
      if (!data) return;

      // Populate elements
      document.getElementById('details-modal-img').src = data.image;
      document.getElementById('details-modal-img').alt = data.model;
      document.getElementById('details-modal-badge').textContent = data.badge;
      document.getElementById('details-modal-category').textContent = data.category;
      document.getElementById('details-car-title').textContent = data.model;
      document.getElementById('details-car-price').textContent = `Starting at ${data.price}`;
      document.getElementById('details-car-overview').textContent = data.overview;

      document.getElementById('spec-engine').textContent = data.specs.engine;
      document.getElementById('spec-hp').textContent = data.specs.horsepower;
      document.getElementById('spec-accel').textContent = data.specs.accel;
      document.getElementById('spec-topspeed').textContent = data.specs.topSpeed;
      document.getElementById('spec-gearbox').textContent = data.specs.gearbox;
      document.getElementById('spec-weight').textContent = data.specs.weight;

      // Update test drive trigger button inside details modal
      const detailsBookBtn = document.getElementById('details-book-btn');
      if (detailsBookBtn) {
        detailsBookBtn.setAttribute('data-car-model', data.model);
      }

      openModal(modalCarDetails);
    });
  });

  // Also clicking on car card image opens details modal
  document.querySelectorAll('.car-card-media').forEach(media => {
    media.addEventListener('click', () => {
      const parentCard = media.closest('.car-card');
      const carId = parentCard.getAttribute('data-car-id');
      const detailsBtn = parentCard.querySelector(`.view-details-btn[data-car-id="${carId}"]`);
      if (detailsBtn) {
        detailsBtn.click();
      }
    });
  });

  // Secondary close button inside success state
  const secondaryClose = document.querySelector('.modal-close-btn-secondary');
  if (secondaryClose) {
    secondaryClose.addEventListener('click', () => {
      closeModal(modalTestDrive);
    });
  }

  // ------------------------------------------------------------------------
  // 8. TEST DRIVE FORM SUBMISSION
  // ------------------------------------------------------------------------
  if (testDriveForm) {
    testDriveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('form-name').value;
      const modelVal = document.getElementById('form-model').value;

      // Populate success view
      const clientNameSpan = document.getElementById('success-client-name');
      const carNameSpan = document.getElementById('success-car-name');
      if (clientNameSpan) clientNameSpan.textContent = nameVal;
      if (carNameSpan) carNameSpan.textContent = modelVal;

      testDriveForm.style.display = 'none';
      modalSuccessState.style.display = 'block';

      showToast(`Reservation inquiry registered for ${nameVal}!`);
      testDriveForm.reset();
    });
  }

  // ------------------------------------------------------------------------
  // 9. ANIMATED TELEMETRY NUMBER COUNTER (Intersection Observer)
  // ------------------------------------------------------------------------
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeProgress * target;

      if (decimals > 0) {
        el.textContent = currentVal.toFixed(decimals);
      } else {
        el.textContent = Math.floor(currentVal).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        if (decimals > 0) {
          el.textContent = target.toFixed(decimals);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
    };

    requestAnimationFrame(updateNumber);
  };

  let countersAnimated = false;
  const performanceSection = document.getElementById('performance');

  if (performanceSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          statCounters.forEach(counter => animateCounter(counter));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(performanceSection);
  } else {
    // Fallback if observer not supported
    statCounters.forEach(counter => animateCounter(counter));
  }

  // ------------------------------------------------------------------------
  // 10. NEWSLETTER FORM HANDLER
  // ------------------------------------------------------------------------
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const email = input.value.trim();

      if (email) {
        newsletterFeedback.textContent = 'Invitation registered. Welcome to Velocity Private Dispatch.';
        newsletterFeedback.className = 'newsletter-feedback success';
        input.value = '';
        showToast('Private Dispatch subscription confirmed.');

        setTimeout(() => {
          newsletterFeedback.textContent = '';
        }, 6000);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 11. TOAST NOTIFICATION UTILITY
  // ------------------------------------------------------------------------
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 4000);
  }

});
