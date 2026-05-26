/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - MAIN.JS
   Custom Micro-interactions, Modals, Filter systems & Theme Syncs
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. CUSTOM CURSOR & LINK HOVERS
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // Track cursor movement
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot immediately
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Animate cursor follower with slight delay (smooth interpolation)
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Custom Cursor link interactive sizing triggers
  const addHoverEffects = () => {
    const targets = document.querySelectorAll('.hovering-link-target, a, button, .portfolio-card');
    targets.forEach(target => {
      // Avoid duplicate listeners
      target.removeEventListener('mouseenter', onMouseEnter);
      target.removeEventListener('mouseleave', onMouseLeave);

      target.addEventListener('mouseenter', onMouseEnter);
      target.addEventListener('mouseleave', onMouseLeave);
    });
  };

  function onMouseEnter() {
    document.body.classList.add('hovering-link');
  }

  function onMouseLeave() {
    document.body.classList.remove('hovering-link');
  }

  addHoverEffects();


  // ==========================================================================
  // 2. SYSTEM INTEGRATED DARK / LIGHT MODE SYNC
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Check saved theme or browser preference
  const savedTheme = localStorage.getItem('studio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else {
    htmlRoot.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('studio-theme', newTheme);
  });


  // ==========================================================================
  // 3. MAGNETIC BUTTONS ATTRACTION
  // ==========================================================================
  const magneticButtons = document.querySelectorAll('.btn-cta, .theme-toggle, .portfolio-arrow-btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Translate button slightly towards mouse relative coordinates
      btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
      
      // Pull icon inside button if exists
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      // Smoothly snap back to origin
      btn.style.transform = 'translate3d(0, 0, 0)';
      
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  });


  // ==========================================================================
  // 4. BENTO CARD RELATIVE GLOW GRADIENTS
  // ==========================================================================
  const bentoCards = document.querySelectorAll('.bento-stat-card, .software-card');

  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // ==========================================================================
  // 5. PORTFOLIO PINTEREST INTERACTIVE MASONRY FILTERS
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active states on tabs
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('filtered-out');
          card.classList.add('filtered-in');
        } else {
          card.classList.remove('filtered-in');
          card.classList.add('filtered-out');
        }
      });
      
      // Refresh mouse link sizes since list layout reshuffled
      setTimeout(addHoverEffects, 300);
    });
  });


  // ==========================================================================
  // 6. DETAILED PROJECT MODAL SYSTEM DATA & RENDERER
  // ==========================================================================
  const projectDatabase = {
    "1": {
      title: "UI/UX Design",
      category: "Service Scope",
      image: "assets/ui_ux_design.png",
      deliverables: "Mobile Apps, Web Dashboards, Wireframes, Interactive Prototypes, User Journeys, Design Systems",
      client: "Creative Art Collective",
      desc1: "Designing intuitive, pixel-perfect user interfaces and highly engaging web & mobile application experiences structured for modern conversions.",
      desc2: "Structured layouts prioritize dynamic usability grids, glassmorphism panel styling, and consistent components to maximize aesthetic value and product conversions."
    },
    "2": {
      title: "Branding & Packaging",
      category: "Service Scope",
      image: "assets/barnding_packaging.png",
      deliverables: "Logo Guidelines, Packaging Boxes, Geometric Vectors, Color Palettes, Brand Guidelines, Typographic Identity",
      client: "Creative Art Collective",
      desc1: "Building luxury corporate brand systems, memorable vector logos, and tactile packaging designs that tell a unique visual brand story.",
      desc2: "We construct elegant, consistent packaging box layouts, stationery sets, and marketing materials optimized for modern offsets and high-end printing processes."
    },
    "3": {
      title: "Video Shoot & Production",
      category: "Service Scope",
      image: "assets/video_shoot_production.png",
      deliverables: "Camera Operations, Cinematic Wedding Shoots, Lighting Setups, Drone Videography, Color Grading",
      client: "Creative Art Collective",
      desc1: "Capturing professional raw video footages and directing high-production preweddings, commercial shoots, and weddings.",
      desc2: "Meticulous focus is maintained on capturing volumetric lighting angles, warm color profiles, and anamorphic widescreen framing to evoke aesthetic visual emotions."
    },
    "4": {
      title: "Digital Invitations",
      category: "Service Scope",
      image: "assets/digital_wedding_invitation.png",
      deliverables: "Floral E-Invites, Gold Leaf Textures, WhatsApp Wedding Cards, Video Invitations, Interactive RSVPs",
      client: "Creative Art Collective",
      desc1: "Designing premium floral and modern botanical digital e-invitations with customized elegant typography for instant WhatsApp delivery.",
      desc2: "These invite templates are optimized for immediate high-resolution digital sharing on WhatsApp, and feature interactive foliage, gold leaf textures, and customizable grids."
    },
    "5": {
      title: "YouTube Content Production",
      category: "Service Scope",
      image: "assets/youtube.png",
      deliverables: "Visual Storyboards, Creator Retention, Script Breakdowns, Narrative Edits, Creator Thumbnails",
      client: "Creative Art Collective",
      desc1: "Editing long-form documentary and educational YouTube videos structured for maximal viewer retention and high click-through rates.",
      desc2: "Visual edit techniques focus on micro text overlays, sound design integrations, and high-contrast thumbnail layouts designed to capture organic CTR and maximize click-through ratios."
    },
    "6": {
      title: "Instagram Reels & Shorts",
      category: "Service Scope",
      image: "assets/reels_editing_vector.png",
      deliverables: "TikTok Shorts, CapCut Text Overlays, Velocity Transitions, Hook Captions, Sound Design",
      client: "Creative Art Collective",
      desc1: "Producing highly engaging vertical micro-reels and YouTube shorts utilizing visual captions, velocity cuts, and custom sound effects.",
      desc2: "Strategic overlays are configured to catch user attentions in the first 3 seconds, incorporating clean dynamic subtitles, popups, and visual graphics."
    },
    "7": {
      title: "Web & App Development",
      category: "Service Scope",
      image: "assets/seo_website_development.png",
      deliverables: "Fullstack Deployments, Dynamic Dashboards, API Configurations, High-Speed Performance, E-Commerce",
      client: "Creative Art Collective",
      desc1: "Writing clean, modular web application codes and deploying fully responsive web portals built for scalability.",
      desc2: "Every deployment maintains strict standards for clean code styling, structural schema tags, speed, and standard search engine optimization."
    },
    "8": {
      title: "Print Media",
      category: "Service Scope",
      image: "assets/print_media.png",
      deliverables: "Banners, Posters, Unipoles, Business Cards, Brochures, Flyers, Pamphlets, Magazines, Standees, Menu Cards, etc.",
      client: "Creative Art Collective",
      desc1: "Styling premium vector layouts and editorial spreads for high-quality offset printings, billboards, and corporate print materials.",
      desc2: "Prepress alignments, exact color gamuts, and print bleeds are strictly calibrated to deliver clean visual details on offset paper stocks."
    },
    "9": {
      title: "Motion Graphics & Animation",
      category: "Service Scope",
      image: "assets/animation.png",
      deliverables: "Vector Animatics, Particle Effects, Seamless Logo Loops, Glow Intro Sequencers, Graphic Transitions",
      client: "Creative Art Collective",
      desc1: "Creating fluid animated visual assets, seamless corporate logo intros, and dynamic graphical loop sequences.",
      desc2: "Dynamic vector illustrations are animated at smooth 60 FPS frame rates, adding neon highlights and fluid graphic transitions to landing page backgrounds."
    },
    "10": {
      title: "Podcast Shoot & Production",
      category: "Service Scope",
      image: "assets/podcast_shoot.png",
      deliverables: "Multi-camera Setups, Acoustic Mixing, Live Switchers, Sound Masterings, Studio Configurations",
      client: "Creative Art Collective",
      desc1: "Configuring multi-mic and multi-camera studio layouts for high-fidelity digital podcasts and masterclass videos.",
      desc2: "We manage shadow lighting setups, live switcher integrations, and sound levelings to generate visual clips optimized for vertical shares."
    },
    "11": {
      title: "Merchandise Design",
      category: "Service Scope",
      image: "assets/merchandise_design.jpg",
      deliverables: "Corporate Swag, Hoodies Vectors, Stationery Sets, Tumbler Engravings, Premium Apparel Mockups",
      client: "Creative Art Collective",
      desc1: "Creating modern lifestyle corporate merchandise layouts and apparel designs that represent unified company identities.",
      desc2: "Vector structures are fully optimized to guarantee sharp, scalable logo prints under screen printings, embroidery, and laser engravings."
    },
    "12": {
      title: "Studio Product Photoshoot",
      category: "Service Scope",
      image: "assets/product_photoshoot.jpg",
      deliverables: "Lighting Angles, Commercial Shoots, Glass Reflections, Retouching Guidelines, Backdrop Setups",
      client: "Creative Art Collective",
      desc1: "Directing studio table-top product photoshoots utilizing customized directional lights and high-end image retouches.",
      desc2: "Post-production retouches utilize precision color balancing and shadow corrections to deliver crisp commercial layout frames."
    }
  };

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalMedia = document.getElementById('modal-project-media');
  const modalCategory = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc1 = document.getElementById('modal-project-desc-1');
  const modalDesc2 = document.getElementById('modal-project-desc-2');
  const modalDeliverables = document.getElementById('modal-project-deliverables');
  const modalClient = document.getElementById('modal-project-client');

  // Attach click listener on portfolio cards
  portfolioCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const projectId = card.getAttribute('data-project-id');
      const data = projectDatabase[projectId];

      if (data) {
        // Populate modal contents
        modalMedia.innerHTML = `<img src="${data.image}" alt="${data.title}">`;
        modalCategory.textContent = data.category;
        modalTitle.textContent = data.title;
        modalDesc1.textContent = data.desc1;
        modalDesc2.textContent = data.desc2;
        modalDeliverables.textContent = data.deliverables;
        modalClient.textContent = data.client;

        // Populate modal bento showcase grid dynamically with 12 light-gray staggered boxes
        const modalBentoGrid = document.getElementById('modal-bento-grid');
        if (modalBentoGrid) {
          let bentoHTML = '';
          const bentoLayouts = [
            { cls: 'span-col-2 span-row-2', lbl: 'Creative Composition #1', aspect: 'Large Showcase' },
            { cls: '', lbl: 'Draft Frame #2', aspect: 'Square aspect' },
            { cls: 'span-row-2', lbl: 'Editorial Concept #3', aspect: 'Portrait aspect' },
            { cls: 'span-col-2', lbl: 'Visual Interface #4', aspect: 'Landscape aspect' },
            { cls: '', lbl: 'Dynamic Element #5', aspect: 'Square aspect' },
            { cls: 'span-row-2', lbl: 'Cinematic Mockup #6', aspect: 'Portrait aspect' },
            { cls: 'span-col-2 span-row-2', lbl: 'Featured Project #7', aspect: 'Large Showcase' },
            { cls: '', lbl: 'Branding Frame #8', aspect: 'Square aspect' },
            { cls: 'span-col-2', lbl: 'Interface Layout #9', aspect: 'Landscape aspect' },
            { cls: '', lbl: 'Aesthetic Concept #10', aspect: 'Square aspect' },
            { cls: 'span-row-2', lbl: 'Design Spread #11', aspect: 'Portrait aspect' },
            { cls: 'span-col-2', lbl: 'Interactive System #12', aspect: 'Landscape aspect' }
          ];

          bentoLayouts.forEach((item, index) => {
            bentoHTML += `
              <div class="modal-bento-card ${item.cls}">
                <div class="modal-bento-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                </div>
                <div class="modal-bento-card-info">
                  <h4>${item.lbl}</h4>
                  <p>${item.aspect}</p>
                </div>
              </div>
            `;
          });

          modalBentoGrid.innerHTML = bentoHTML;
        }

        // Toggle classes
        modal.classList.add('active');
        document.body.classList.add('scroll-locked');
        
        // Reset modal scroll to top when opened
        modal.querySelector('.modal-container').scrollTop = 0;
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.classList.remove('scroll-locked');
  };

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });


  // ==========================================================================
  // 7. INFOGRAPHICS BENTO STATS ANIMATED COUNTERS & SKILLS PROGRESS
  // ==========================================================================
  const statsElements = document.querySelectorAll('.stat-number');
  const skillFills = document.querySelectorAll('.skill-fill');
  const radarCircle = document.getElementById('radar-progress');

  const countUpStat = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);

      if (el.getAttribute('data-target') === '99') {
        const decimalValue = (progress * 99.5).toFixed(1);
        el.textContent = `${decimalValue}%`;
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (el.getAttribute('data-target') === '120') {
          el.textContent = '120+';
        } else if (el.getAttribute('data-target') === '999') {
          el.textContent = '999+';
        } else if (el.getAttribute('data-target') === '99') {
          el.textContent = '99.5%';
        }
      }
    };

    requestAnimationFrame(animate);
  };

  // IntersectionObserver to launch bento infographic animations
  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Trigger stat numbers counting
        statsElements.forEach(el => countUpStat(el));

        // Animate skill bar widths
        skillFills.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });

        // Animate circular skill radar fill (stroke-dashoffset from 628 to 25)
        if (radarCircle) {
          // Circumference is 2 * PI * r = 2 * 3.1415 * 100 = 628
          const targetPercentage = 96;
          const offset = 628 - (628 * targetPercentage) / 100;
          radarCircle.style.strokeDashoffset = offset;
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const statsSection = document.getElementById('impact');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }


  // ==========================================================================
  // 8. SCROLL REVEAL LAZY ANIMATIONS
  // ==========================================================================
  const scrollElements = document.querySelectorAll('.reveal-item');

  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  scrollElements.forEach(el => {
    elementObserver.observe(el);
  });


  // ==========================================================================
  // 9. COLLABORATE FORM SUBMIT CONFIRMATION ANIMATION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = contactForm.querySelector('.btn-submit');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Standard high-end form feedback animation
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span>Message Dispatched</span>
      <svg viewBox="0 0 24 24" style="stroke: #10b981;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    submitBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.pointerEvents = 'auto';
    }, 3000);
  });


  // ==========================================================================
  // 10. FLOATING NAVBAR ENTRANCE & MOB MENU TOGGLE
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      if (window.scrollY > lastScrollY) {
        // Scrolling down -> hide navbar smoothly
        navbar.style.transform = 'translateX(-50%) translateY(-120px)';
      } else {
        // Scrolling up -> show navbar
        navbar.style.transform = 'translateX(-50%) translateY(0)';
      }
    }
    lastScrollY = window.scrollY;
  });

  // Mobile menu action trigger
  mobileToggle.addEventListener('click', () => {
    // Elegant slide-in overlays can be built, or standard alerts
    alert('This responsive creative layout features high-end Dribbble filters, detail modals, responsive structures, and theme syncs!');
  });

});
