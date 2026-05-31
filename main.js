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
    // Save CPU: Skip custom cursor positioning if disabled
    if (document.documentElement.classList.contains('custom-cursor-disabled')) {
      return;
    }
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot immediately
    if (cursor) {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }
  });

  // Animate cursor follower with slight delay (smooth interpolation)
  function animateFollower() {
    // Save CPU: Skip animation math & DOM styling updates if disabled
    if (!document.documentElement.classList.contains('custom-cursor-disabled')) {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      if (follower) {
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
      }
    }

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

      // Reset scroll position and sync progress bar after filtering
      const sliderContainer = document.getElementById('skills-slider-container');
      if (sliderContainer) {
        sliderContainer.scrollLeft = 0;
        setTimeout(() => {
          sliderContainer.dispatchEvent(new Event('scroll'));
        }, 100);
      }
    });
  });


  // ==========================================================================
  // 6. DETAILED PROJECT MODAL SYSTEM DATA & RENDERER
  // ==========================================================================
  const projectDatabase = {
    "1": {
      title: "Graphic Design",
      category: "Service Scope",
      image: "assets/ui_ux_design.png",
      deliverables: "Brand Identity, Marketing Materials, Social Media Graphics, Vector Illustrations, Digital Assets",
      client: "Creative Art Collective",
      desc1: "Crafting beautiful, high-impact graphic designs, brand assets, and creative visual communications that define unique brand personalities.",
      desc2: "Our custom graphics focus on balanced grids, professional typography, and vibrant color schemes that resonate with audiences across print and digital media."
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

  // ==========================================================================
  // 6. PREMIUM HORIZONTAL SLIDER INTERACTION SYSTEM
  // ==========================================================================
  const sliderContainer = document.getElementById('skills-slider-container');
  const sliderTrack = document.getElementById('skills-slider-track');
  const prevBtn = document.getElementById('skills-slider-prev');
  const nextBtn = document.getElementById('skills-slider-next');
  const progressFill = document.getElementById('slider-progress-fill');

  if (sliderContainer && sliderTrack) {
    // 1. Navigation Button clicks
    const getCardWidth = () => {
      const card = sliderTrack.querySelector('.portfolio-card');
      return card ? card.offsetWidth + 24 : 384; // Card width + gap
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        sliderContainer.scrollLeft -= getCardWidth();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sliderContainer.scrollLeft += getCardWidth();
      });
    }

    // 2. Desktop Drag-to-Scroll Functionality
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;

    sliderContainer.addEventListener('mousedown', (e) => {
      // Prevent text selection/drag on interactive elements
      if (e.target.closest('a, button, input, textarea, .row-arrow-btn')) return;
      isDown = true;
      isDragging = false;
      sliderContainer.classList.add('active-dragging');
      startX = e.pageX - sliderContainer.offsetLeft;
      scrollLeft = sliderContainer.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        sliderContainer.classList.remove('active-dragging');
        // Briefly delay setting isDragging to false to avoid misfiring click event
        setTimeout(() => { isDragging = false; }, 50);
      }
    });

    sliderContainer.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        sliderContainer.classList.remove('active-dragging');
      }
    });

    sliderContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sliderContainer.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag sensitivity
      sliderContainer.scrollLeft = scrollLeft - walk;
      isDragging = true;
    });

    // 3. Scroll Progress Bar Fill & Center Card Focus Updater
    const updateScrollProgress = () => {
      const scrollableWidth = sliderContainer.scrollWidth - sliderContainer.clientWidth;
      if (scrollableWidth <= 0) {
        if (progressFill) progressFill.style.width = '0%';
      } else {
        const scrollPercent = (sliderContainer.scrollLeft / scrollableWidth) * 100;
        if (progressFill) {
          progressFill.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
        }
      }

      // Automatically identify and highlight center-focused card on scroll/drag/touch
      const cards = sliderTrack.querySelectorAll('.portfolio-card');
      const containerRect = sliderContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      let closestCard = null;
      let minDistance = Infinity;

      cards.forEach(card => {
        if (card.classList.contains('filtered-out')) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });

      cards.forEach(card => {
        if (card === closestCard) {
          card.classList.add('active-card');
        } else {
          card.classList.remove('active-card');
        }
      });
    };

    sliderContainer.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    
    // Initial sync
    setTimeout(updateScrollProgress, 100);
  }

  // Re-run hover effects so all slider elements register interactive cursor reactions
  addHoverEffects();

  // Google Drive URL to high-speed CDN direct link converter functions
  const getDirectDriveImgLink = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const fileId = match[1];
        // 100% reliable, high-speed CDN hotlink served by Google
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
      }
    }
    return url;
  };

  const getDirectDriveVideoLink = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    return url;
  };

  // Helper function to dynamically generate the 12-bento staggered grid of work showcases
  const getBentoGalleryHTML = (projectId, mainImage) => {
    const bentoLayouts = [
      { cls: 'span-col-2 span-row-2', lbl: 'Creative Composition #1', aspect: '1000x1000', useImage: true },
      { cls: '', lbl: 'Draft Frame #2', aspect: '1000x1000' },
      { cls: 'span-row-2', lbl: 'Editorial Concept #3', aspect: '1080x1920', useImage: true },
      { cls: 'span-col-2', lbl: 'Visual Interface #4', aspect: '1920x1080', useImage: true },
      { cls: '', lbl: 'Dynamic Element #5', aspect: '1000x1000' },
      { cls: 'span-row-2', lbl: 'Cinematic Mockup #6', aspect: '1080x1920' },
      { cls: 'span-col-2 span-row-2', lbl: 'Featured Project #7', aspect: '1000x1000', useImage: true },
      { cls: '', lbl: 'Branding Frame #8', aspect: '1000x1000' },
      { cls: 'span-col-2', lbl: 'Interface Layout #9', aspect: '1920x1080' },
      { cls: '', lbl: 'Aesthetic Concept #10', aspect: '1000x1000' },
      { cls: 'span-row-2', lbl: 'Design Spread #11', aspect: '1080x1920' },
      { cls: 'span-col-2', lbl: 'Interactive System #12', aspect: '1920x1080', useImage: true }
    ];

    // Testing list containing all 11 Google Drive images we extracted
    const driveTestImages = [
      "https://drive.google.com/file/d/1yyoLGitlxXyBqfOr3ava89eyvms-3wPQ/view?usp=sharing", // design.png
      "https://drive.google.com/file/d/1_sYjKqFbzZXKMWP_vExm39UUAyhNxAbW/view?usp=sharing", // branding.jpg
      "https://drive.google.com/file/d/1z6jBYZhohMnvzVxPPAprdGlMIyQfY5uI/view?usp=sharing", // wedding shoot.webp
      "https://drive.google.com/file/d/1MGHadaRxwrFlUY02R0H5GnaMLUpepVYR/view?usp=sharing", // invitation.jpg
      "https://drive.google.com/file/d/1dFEaNZZaO1HF9GLHzS3vR20vwfzb-7sZ/view?usp=sharing", // youtube.png
      "https://drive.google.com/file/d/1Q8T9j7VEIZ7KUJxNZoEf67EvGvCGa02O/view?usp=sharing", // instagram.jpg
      "https://drive.google.com/file/d/1J_6HhgubY_vrGN4bOGzw3YkSKWLdXz9R/view?usp=sharing", // web.jpg
      "https://drive.google.com/file/d/1fbVAFVOx7wOkUZBd_ATxhFJiCD3b7Wbj/view?usp=sharing", // primt-media.jpg
      "https://drive.google.com/file/d/1QT0YTToHbMgO1q1y3H9lmsFwOB77yhyK/view?usp=sharing", // ui designer.jpg
      "https://drive.google.com/file/d/1dE8BifajBucHXAwqN3JgvcxhmqeyD9kq/view?usp=sharing", // logo-design.jpg
      "https://drive.google.com/file/d/165-z9cNeStSICOVkVmg3wYUSbP3s0h_M/view?usp=sharing"  // product photography.jpg
    ];

    const isGraphicDesignTest = projectId === "1" || projectId === 1;

    let bentoHTML = '';
    bentoLayouts.forEach((item, index) => {
      let displayImg = '';
      if (isGraphicDesignTest) {
        // Map a different Google Drive test image to every bento card dynamically
        const imgUrl = driveTestImages[index % driveTestImages.length];
        displayImg = getDirectDriveImgLink(imgUrl);
      } else {
        displayImg = item.useImage && mainImage ? mainImage : '';
      }

      if (displayImg) {
        bentoHTML += `
          <div class="detail-bento-card ${item.cls} has-image" style="background-image: url('${displayImg}'); background-size: cover; background-position: center;">
            <div class="bento-image-overlay"></div>
            <div class="detail-bento-card-info">
              <h4>${item.lbl}</h4>
              <p>${item.aspect}</p>
            </div>
          </div>
        `;
      } else {
        bentoHTML += `
          <div class="detail-bento-card ${item.cls}">
            <div class="detail-bento-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </div>
            <div class="detail-bento-card-info">
              <h4>${item.lbl}</h4>
              <p>${item.aspect}</p>
            </div>
          </div>
        `;
      }
    });
    return bentoHTML;
  };

  // ==========================================================================
  // 7. PREMIUM DYNAMIC POP-UP MODAL OVERLAY CONTROLLER
  // ==========================================================================
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalMedia = document.getElementById('modal-project-media');
  const modalCategory = document.getElementById('modal-project-category');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDeliverables = document.getElementById('modal-project-deliverables');
  const modalClient = document.getElementById('modal-project-client');
  const modalDesc1 = document.getElementById('modal-project-desc-1');
  const modalDesc2 = document.getElementById('modal-project-desc-2');
  const modalBentoGrid = document.getElementById('modal-bento-grid');

  if (modalOverlay) {
    const openProjectModal = (projectId) => {
      const data = projectDatabase[projectId];
      if (!data) return;

      const directImgUrl = getDirectDriveImgLink(data.image);

      // Populate media: image/video element
      if (modalMedia) {
        modalMedia.innerHTML = `<img src="${directImgUrl}" alt="${data.title}">`;
      }

      // Populate other metadata text
      if (modalCategory) modalCategory.textContent = data.category || 'Service Scope';
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalDeliverables) modalDeliverables.textContent = data.deliverables;
      if (modalClient) modalClient.textContent = data.client;
      if (modalDesc1) modalDesc1.textContent = data.desc1;
      if (modalDesc2) modalDesc2.textContent = data.desc2;

      // Populate bento work gallery
      if (modalBentoGrid) {
        modalBentoGrid.innerHTML = getBentoGalleryHTML(projectId, directImgUrl);
      }

      // Open Modal smoothly
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Disable background body scroll

      // Refresh custom cursor follower trigger sizes
      setTimeout(addHoverEffects, 100);
    };

    const closeProjectModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scroll

      // Clear contents after transition finishes
      setTimeout(() => {
        if (!modalOverlay.classList.contains('active')) {
          if (modalMedia) modalMedia.innerHTML = '';
          if (modalBentoGrid) modalBentoGrid.innerHTML = '';
        }
      }, 400);
    };

    // 1. Click card to open modal
    portfolioCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent click if we were dragging the slider
        const sliderContainer = document.getElementById('skills-slider-container');
        if (sliderContainer && sliderContainer.classList.contains('active-dragging')) {
          return;
        }
        
        const projectId = card.getAttribute('data-project-id');
        openProjectModal(projectId);
      });
    });

    // 2. Click Close button to close
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeProjectModal();
      });
    }

    // 3. Click outside modal to close
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });

    // 4. Escape key press to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }


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

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    // Get all selected options from the multiple select dropdown
    const selectEl = document.getElementById('form-service');
    const selectedDisciplines = Array.from(selectEl.selectedOptions)
      .map(opt => opt.text)
      .join(', ');

    // Construct professional WhatsApp message
    const waText = `Hi H. Seth,\n\nI'd like to collaborate on a new creative project!\n\n*Name:* ${name}\n*Email:* ${email}\n*Disciplines:* ${selectedDisciplines || 'None Selected'}\n*Note:* ${message}`;

    // Open WhatsApp
    const waUrl = `https://wa.me/919001055339?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');

    // Standard high-end form feedback animation
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span>Opening WhatsApp</span>
      <svg viewBox="0 0 24 24" style="stroke: #10b981; fill: none; width: 16px; height: 16px;">
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
    console.log('Mobile navigation toggled.');
  });

  // ==========================================================================
  // 11. INTERACTIVE HERO 3D FLIP & SOLAR SYSTEM ORBITS CONTROL
  // ==========================================================================
  const heroScene = document.getElementById('hero-3d-scene');
  const heroCard = document.getElementById('hero-interactive-card');
  const centerTriggerFront = document.getElementById('hero-center-trigger-front');
  const centerTriggerBack = document.getElementById('hero-center-trigger-back');
  const servicePlanets = document.querySelectorAll('.service-planet');

  if (heroScene && heroCard) {
    // 1. Entrance staggered load animations
    // Add active scene class to pop center and slide-in other boxes
    setTimeout(() => {
      heroScene.classList.add('scene-active');
    }, 150);

    // After entrance animations finish (1200ms), mark floaters as ready to enable floating animation loops
    setTimeout(() => {
      document.querySelectorAll('.floating-box').forEach(box => {
        box.classList.add('floater-ready');
      });
    }, 1400);

    // 2. Click events to toggle 3D Flip state (always rotating in the same right-to-left direction)
    let currentRotation = 0;

    const performCardFlip = () => {
      currentRotation += 180;
      heroCard.style.setProperty('--card-rotation', `${currentRotation}deg`);
      
      const isFlipped = (currentRotation / 180) % 2 !== 0;
      
      if (isFlipped) {
        // FLIPPING TO ORBIT MODE
        heroScene.classList.add('orbit-mode-active');
        // Temporarily pause floaters to keep transitions smooth
        document.querySelectorAll('.floating-box').forEach(box => {
          box.classList.remove('floater-ready');
        });
      } else {
        // FLIPPING BACK TO STANDARD MODE
        heroScene.classList.remove('orbit-mode-active');
        // Stagger re-enabling float loops after card finishes flipping back (850ms)
        setTimeout(() => {
          document.querySelectorAll('.floating-box').forEach(box => {
            box.classList.add('floater-ready');
          });
        }, 900);
      }
    };

    if (centerTriggerFront) {
      centerTriggerFront.addEventListener('click', (e) => {
        e.stopPropagation();
        performCardFlip();
      });
    }

    if (centerTriggerBack) {
      centerTriggerBack.addEventListener('click', (e) => {
        e.stopPropagation();
        performCardFlip();
      });
    }

    // 3. Option B integration: Clicking planets triggers portfolio detailed modal opening
    servicePlanets.forEach(planet => {
      planet.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = planet.getAttribute('data-project-id');
        
        // Find matching portfolio card in track
        const projectCard = document.querySelector(`.portfolio-card[data-project-id="${projectId}"]`);
        
        if (projectCard) {
          // First, smooth-scroll viewer down to curations section
          const workSection = document.getElementById('work');
          if (workSection) {
            workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          
          // Open popup detailed view modal once viewport matches position
          setTimeout(() => {
            projectCard.click();
          }, 650);
        }
      });
    });
  }

  // ==========================================================================
  // 12. DYNAMIC SMOOTH INFINITE MARQUEE & DRAG-SCROLL & TOUCH DEVICE OVERRIDES
  // ==========================================================================

  // Check and hide custom cursor elements on mobile/touch screens
  const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) {
    const customCursor = document.getElementById('custom-cursor');
    const customFollower = document.getElementById('custom-cursor-follower');
    if (customCursor) customCursor.style.display = 'none';
    if (customFollower) customFollower.style.display = 'none';
    document.body.classList.add('touch-device');
  }

  // Detect mobile device requesting Desktop Site
  const isMobileDesktopSite = isTouchDevice && window.innerWidth >= 980 && window.innerWidth <= 1300;
  if (isMobileDesktopSite) {
    document.body.classList.add('mobile-desktop-site');
  }

  // Setup loop and drag-scroll on marquee containers
  const setupInfiniteMarquee = (rowEl, scrollSpeed = 0.65) => {
    const track = rowEl.querySelector('.software-marquee-track, .client-marquee-track, .clients-marquee-track');
    if (!track) return;

    // Duplicate children to enable seamless looping
    const originalHTML = track.innerHTML;
    track.innerHTML = originalHTML + originalHTML;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isHovered = false;
    let isDragging = false;

    let currentScroll = 0;

    // Smooth auto-scroll RAF loop
    const scrollStep = () => {
      if (!isHovered && !isDown && !isDragging) {
        currentScroll += scrollSpeed;

        const halfWidth = track.scrollWidth / 2;
        if (currentScroll >= halfWidth) {
          currentScroll -= halfWidth;
        }
        rowEl.scrollLeft = currentScroll;
      } else {
        // Sync our javascript fractional scroll position when dragging/swiping manually
        currentScroll = rowEl.scrollLeft;
      }
      requestAnimationFrame(scrollStep);
    };
    requestAnimationFrame(scrollStep);

    // Pause on mouse hover (Desktop)
    rowEl.addEventListener('mouseenter', () => { isHovered = true; });
    rowEl.addEventListener('mouseleave', () => { isHovered = false; });

    // Drag to scroll triggers (Mouse Drag Desktop)
    rowEl.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = true;
      rowEl.classList.add('active-dragging');
      startX = e.pageX - rowEl.offsetLeft;
      scrollLeft = rowEl.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        setTimeout(() => { isDragging = false; }, 200);
        rowEl.classList.remove('active-dragging');
      }
    });

    rowEl.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rowEl.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag scroll sensitivity
      rowEl.scrollLeft = scrollLeft - walk;

      // Infinite loop wrap check while dragging
      const halfWidth = track.scrollWidth / 2;
      if (rowEl.scrollLeft >= halfWidth) {
        rowEl.scrollLeft -= halfWidth;
      } else if (rowEl.scrollLeft <= 0) {
        rowEl.scrollLeft += halfWidth;
      }
    });

    // Touch events (Mobile drag/swipe interactions)
    rowEl.addEventListener('touchstart', () => {
      isDragging = true;
    });
    rowEl.addEventListener('touchend', () => {
      setTimeout(() => { isDragging = false; }, 800);
    });

    // Manual scroll sync check (touch swipe wrap around)
    rowEl.addEventListener('scroll', () => {
      const halfWidth = track.scrollWidth / 2;
      if (rowEl.scrollLeft >= halfWidth) {
        rowEl.scrollLeft -= halfWidth;
      } else if (rowEl.scrollLeft <= 0) {
        rowEl.scrollLeft += halfWidth;
      }
      currentScroll = rowEl.scrollLeft; // Sync fractional position
    });
  };

  // Launch Marquee rows for software stack (3 rows)
  document.querySelectorAll('.software-marquee-row').forEach((row, index) => {
    // Offset speeds slightly for different rows (slower for premium gracefulness)
    const speed = index === 1 ? 0.52 : 0.42;
    setupInfiniteMarquee(row, speed);
  });

  // Launch Marquee row for clients surveys (1 row)
  const clientMarquee = document.getElementById('client-marquee-container');
  if (clientMarquee) {
    setupInfiniteMarquee(clientMarquee, 0.32);
  }

  // Launch Marquee row for clients logos (infinite auto-scroll + drag/swipe scroll)
  const clientsLogoMarquee = document.getElementById('clients-logo-marquee');
  if (clientsLogoMarquee) {
    setupInfiniteMarquee(clientsLogoMarquee, 0.42);
  }

  // Custom Dropdown Checkboxes Interactive Logic
  const dropdownTrigger = document.getElementById('custom-dropdown-trigger');
  const dropdownMenu = document.getElementById('custom-dropdown-menu');
  
  if (dropdownTrigger && dropdownMenu) {
    const triggerText = dropdownTrigger.querySelector('.trigger-text');
    const checkboxes = dropdownMenu.querySelectorAll('input[type="checkbox"]');
    const nativeSelect = document.getElementById('form-service');

    // Toggle dropdown visibility
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownTrigger.classList.toggle('active');
      dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#custom-dropdown-container')) {
        dropdownTrigger.classList.remove('active');
        dropdownMenu.classList.remove('active');
      }
    });

    // Handle checkboxes interaction
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const selectedTexts = [];
        const selectedValues = [];

        checkboxes.forEach(cb => {
          if (cb.checked) {
            selectedTexts.push(cb.getAttribute('data-text'));
            selectedValues.push(cb.value);
          }
        });

        // Update trigger text header
        if (selectedTexts.length > 0) {
          triggerText.textContent = selectedTexts.join(', ');
        } else {
          triggerText.textContent = 'Select / Choose';
        }

        // Sync with hidden native multiple select options
        if (nativeSelect) {
          Array.from(nativeSelect.options).forEach(option => {
            option.selected = selectedValues.includes(option.value);
          });
        }
      });
    });
  }

  // ==========================================================================
  // 13. INTERACTIVE CONSTELLATION PARTICLES BACKGROUND (WITH GYRO SENSORS)
  // ==========================================================================
  const canvas = document.getElementById('hero-particles-canvas');
  const heroSection = document.getElementById('home');

  if (canvas && heroSection) {
    // Check if the viewport is mobile/tablet to completely disable particles & canvas engine
    const isMobile = window.matchMedia('(max-width: 1024px), (pointer: coarse)').matches;
    if (isMobile) {
      canvas.style.display = 'none';
    } else {
      const ctx = canvas.getContext('2d');
      let particlesArray = [];
      const maxParticles = 125; // Rich particle density
      
      // Mouse properties relative to hero section bounds
      let mouse = {
        x: null,
        y: null,
        radius: 155, // Adjusted magnetic radius to exactly 155px as requested
        active: false
      };

      // Gyroscope tilt gravity offsets
      let gravityOffset = {
        x: 0,
        y: 0
      };

      // Resize handler
      function resizeCanvas() {
        const rect = heroSection.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Track mouse coordinates on parent container (for Desktop/Laptop hover)
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });

      heroSection.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
      });

      // Touch support for Mobile/Tablet touchscreens (Finger touch, tap, hold, and glide)
      heroSection.addEventListener('touchstart', (e) => {
        const rect = heroSection.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
          mouse.x = e.touches[0].clientX - rect.left;
          mouse.y = e.touches[0].clientY - rect.top;
          mouse.active = true;
        }
      }, { passive: true });

      heroSection.addEventListener('touchmove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
          mouse.x = e.touches[0].clientX - rect.left;
          mouse.y = e.touches[0].clientY - rect.top;
          mouse.active = true;
        }
      }, { passive: true });

      heroSection.addEventListener('touchend', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
      });

      heroSection.addEventListener('touchcancel', () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
      });

      // Device orientation gyroscope handler (for mobile devices)
      window.addEventListener('deviceorientation', (event) => {
        if (event.gamma !== null && event.beta !== null) {
          gravityOffset.x = Math.max(Math.min(event.gamma * 0.08, 3), -3);
          gravityOffset.y = Math.max(Math.min((event.beta - 45) * 0.08, 3), -3);
        }
      });

      // Particle Object Blueprint
      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.baseX = this.x; // Anchored home X coordinate for instant spring-back
          this.baseY = this.y; // Anchored home Y coordinate for instant spring-back
          this.vx = 0;
          this.vy = 0;
          this.size = Math.random() * 2 + 1.2; // premium delicate particle sizes
        }

        // Update positions, velocity vectors, and gravity influences
        update() {
          // Shift particle velocity by gyroscope tilt gravity (if mobile)
          this.vx += gravityOffset.x * 0.012;
          this.vy += gravityOffset.y * 0.012;

          // Calculate distance to original anchored home position
          const homeDx = this.baseX - this.x;
          const homeDy = this.baseY - this.y;

          // ELASTIC HOME SPRING RESTORATION FORCE:
          // Automatically pulls the particles back to their original home spots instantly.
          // The spring coefficient (0.08) and damping (0.82) create a beautiful subtle bounce.
          this.vx += homeDx * 0.08;
          this.vy += homeDy * 0.08;

          // Friction damping (settles dots exactly at home without infinite oscillation)
          this.vx *= 0.82;
          this.vy *= 0.82;

          // Apply velocity to coordinates
          this.x += this.vx;
          this.y += this.vy;

          // Desktop mouse attraction / gravity pull
          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              
              // MOUSE INFLUENCE (Temporarily distorts the mesh by overriding spring pull):
              // 1. Pull towards the mouse using velocity (42px to 155px)
              // 2. Repel strongly under 42px to prevent overlapping clumps
              if (dist > 42) {
                this.vx += (dx / dist) * force * 1.5;
                this.vy += (dy / dist) * force * 1.5;
              } else {
                const repelForce = (42 - dist) / 42;
                this.vx -= (dx / dist) * repelForce * 2.2;
                this.vy -= (dy / dist) * repelForce * 2.2;
              }
            }
          }
        }

        draw() {
          const isLight = document.documentElement.getAttribute('data-theme') === 'light';
          // ADJUSTED OPACITY FOR PERFECT BALANCE:
          // 1. Light mode: 100% solid, fully opaque white (1.0) so it stands out strongly on the light off-white background
          // 2. Dark mode: tuned to exactly 0.25 for an ultra-subtle, premium starry background as requested
          const particleColor = isLight ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.25)';
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();
        }
      }

      // Populate particles arrays
      function initParticles() {
        particlesArray = [];
        for (let i = 0; i < maxParticles; i++) {
          particlesArray.push(new Particle());
        }
      }
      initParticles();

      // Re-initialize particles on resizing canvas to ensure equal density
      window.addEventListener('resize', () => {
        initParticles();
      });

      // Draw thin elegant connecting line webs between nearby particles
      function connectParticles() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const connectionDist = 80;

        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDist) {
              // WHITE CONNECTING WEBS:
              // 1. Light mode: 100% solid white (1.0)
              // 2. Dark mode: tuned to exactly 0.20 for a whisper-soft delicate mesh as requested
              const baseAlpha = isLight ? 1.0 : 0.20;
              const alpha = (1 - (dist / connectionDist)) * baseAlpha;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.lineWidth = isLight ? 1.5 : 0.85; // Thicker in light mode to stand out beautifully on light background
              ctx.stroke();
            }
          }

          // Draw connections to the mouse cursor (creating attraction visual webs)
          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const mdx = particlesArray[a].x - mouse.x;
            const mdy = particlesArray[a].y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < mouse.radius) {
              // WHITE MOUSE THREADS:
              // 1. Light mode: 100% solid white (1.0)
              // 2. Dark mode: tuned to exactly 0.25 as requested
              const baseMouseAlpha = isLight ? 1.0 : 0.25;
              const malpha = (1 - (mdist / mouse.radius)) * baseMouseAlpha;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${malpha})`;
              ctx.lineWidth = isLight ? 1.8 : 0.95; // Thicker in light mode to be highly visible
              ctx.stroke();
            }
          }
        }
      }

      // Butttery 60FPS animation loop
      function animateParticles() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        
        // PERFORMANCE BOOST: Disable updates and drawing entirely in light theme to save CPU/GPU cycles
        if (isLight) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          requestAnimationFrame(animateParticles);
          return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
          particlesArray[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animateParticles);
      }
      animateParticles();
    }
  }

  // ==========================================================================
  // 14. SCROLLSPY ACTIVE NAVIGATION UNDERLINE EFFECT
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a.nav-link');

  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          // Check if href matches the intersecting section id
          if (link.getAttribute('href') === `#${id}` || (id === 'home' && link.getAttribute('href') === '#') || (id === 'home' && link.getAttribute('href') === '#home')) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px' // Triggers active link when section occupies main viewport space
  });

  sections.forEach(section => scrollspyObserver.observe(section));

  // ==========================================================================
  // 15. FULLSCREEN GALLERY IMAGE LIGHTBOX WITH DRAG/PAN & DOUBLE-TAP ZOOM
  // ==========================================================================
  const bentoGrid = document.getElementById('modal-bento-grid');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeGalleryImages = [];
  let currentImgIndex = 0;

  // Panning/dragging coordinates
  let isPanning = false;
  let startPanX = 0, startPanY = 0;
  let panX = 0, panY = 0;

  if (bentoGrid && lightbox && lightboxImg) {
    bentoGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.detail-bento-card.has-image');
      if (!card) return;

      // Extract all background images in bento grid
      const cardsWithImages = Array.from(bentoGrid.querySelectorAll('.detail-bento-card.has-image'));
      activeGalleryImages = cardsWithImages.map(c => {
        // Extract URL from style background-image e.g. url("...")
        const bg = c.style.backgroundImage;
        return bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      });

      // Find current clicked image index
      const clickedBg = card.style.backgroundImage;
      const clickedUrl = clickedBg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      currentImgIndex = activeGalleryImages.indexOf(clickedUrl);

      // Open Lightbox
      openLightbox(currentImgIndex);
    });

    const openLightbox = (index) => {
      if (index < 0 || index >= activeGalleryImages.length) return;
      currentImgIndex = index;

      // Reset panning
      panX = 0;
      panY = 0;
      lightboxImg.style.transform = '';
      lightboxImg.classList.remove('zoomed'); // Reset zoom state

      lightboxImg.src = activeGalleryImages[currentImgIndex];

      lightbox.classList.add('active');
      
      // Hide arrows if there is only 1 image in bento gallery
      if (activeGalleryImages.length <= 1) {
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
      } else {
        if (lightboxPrev) lightboxPrev.style.display = '';
        if (lightboxNext) lightboxNext.style.display = '';
      }
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      panX = 0;
      panY = 0;
      lightboxImg.style.transform = '';
      setTimeout(() => {
        if (!lightbox.classList.contains('active')) {
          lightboxImg.src = '';
        }
      }, 300);
    };

    const showPrevImage = () => {
      let nextIndex = currentImgIndex - 1;
      if (nextIndex < 0) nextIndex = activeGalleryImages.length - 1; // loop around
      openLightbox(nextIndex);
    };

    const showNextImage = () => {
      let nextIndex = currentImgIndex + 1;
      if (nextIndex >= activeGalleryImages.length) nextIndex = 0; // loop around
      openLightbox(nextIndex);
    };

    // Close button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    }

    // Navigation arrows
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
      });
    }

    // Backdrop click close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-image-container')) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    });

    // 1. Double tap / Double click to Zoom
    let lastTap = 0;
    const handleZoomToggle = (e) => {
      e.preventDefault();
      const isZoomed = lightboxImg.classList.toggle('zoomed');
      panX = 0;
      panY = 0;
      if (isZoomed) {
        lightboxImg.style.transform = 'scale(2) translate(0px, 0px)';
      } else {
        lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
      }
    };

    lightboxImg.addEventListener('dblclick', handleZoomToggle);

    // Double-tap zoom for mobile devices
    lightboxImg.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapDelay = currentTime - lastTap;
      if (tapDelay < 300 && tapDelay > 0) {
        handleZoomToggle(e);
      }
      lastTap = currentTime;
    });

    // 2. Drag & Touch Panning Logic
    lightboxImg.addEventListener('mousedown', (e) => {
      if (!lightboxImg.classList.contains('zoomed')) return;
      e.preventDefault();
      isPanning = true;
      startPanX = e.clientX - panX;
      startPanY = e.clientY - panY;
      lightboxImg.style.cursor = 'grabbing';
      lightboxImg.style.transition = 'none'; // disable transitions while dragging for instant feedback
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      panX = e.clientX - startPanX;
      panY = e.clientY - startPanY;

      // Clamp bounds dynamically based on half image width/height (approximate boundary)
      const maxPanX = Math.max(150, lightboxImg.offsetWidth / 2);
      const maxPanY = Math.max(150, lightboxImg.offsetHeight / 2);
      panX = Math.max(Math.min(panX, maxPanX), -maxPanX);
      panY = Math.max(Math.min(panY, maxPanY), -maxPanY);

      lightboxImg.style.transform = `scale(2) translate(${panX / 2}px, ${panY / 2}px)`; // translate is applied relative to scaling
    });

    window.addEventListener('mouseup', () => {
      if (isPanning) {
        isPanning = false;
        lightboxImg.style.cursor = lightboxImg.classList.contains('zoomed') ? 'zoom-out' : 'zoom-in';
        lightboxImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'; // re-enable transition
      }
    });

    // Touch events for mobile dragging / gliding
    lightboxImg.addEventListener('touchstart', (e) => {
      if (!lightboxImg.classList.contains('zoomed')) return;
      if (e.touches.length === 1) {
        isPanning = true;
        startPanX = e.touches[0].clientX - panX;
        startPanY = e.touches[0].clientY - panY;
        lightboxImg.style.transition = 'none';
      }
    }, { passive: true });

    lightboxImg.addEventListener('touchmove', (e) => {
      if (!isPanning || e.touches.length !== 1) return;
      panX = e.touches[0].clientX - startPanX;
      panY = e.touches[0].clientY - startPanY;

      const maxPanX = Math.max(150, lightboxImg.offsetWidth / 2);
      const maxPanY = Math.max(150, lightboxImg.offsetHeight / 2);
      panX = Math.max(Math.min(panX, maxPanX), -maxPanX);
      panY = Math.max(Math.min(panY, maxPanY), -maxPanY);

      lightboxImg.style.transform = `scale(2) translate(${panX / 2}px, ${panY / 2}px)`;
    }, { passive: true });

    lightboxImg.addEventListener('touchend', () => {
      if (isPanning) {
        isPanning = false;
        lightboxImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  }

  // ==========================================================================
  // 12. FLOATING ACTION CONTROLS: BACK TO TOP & CURSOR TOGGLE
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const cursorToggleBtn = document.getElementById('cursor-toggle-btn');

  // Handle Scroll to show/hide Back to Top button
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  });

  // Smooth Scroll to Top on click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Check initial custom cursor status
  const isCursorDisabled = localStorage.getItem('custom-cursor-disabled') === 'true';
  if (isCursorDisabled) {
    // Note: document.documentElement.classList was already added in the head script,
    // but let's make sure our toggle UI button state matches
    if (cursorToggleBtn) {
      cursorToggleBtn.classList.add('disabled-state');
      const cursorOnIcon = cursorToggleBtn.querySelector('.cursor-icon-on');
      const cursorOffIcon = cursorToggleBtn.querySelector('.cursor-icon-off');
      if (cursorOnIcon) cursorOnIcon.style.display = 'none';
      if (cursorOffIcon) cursorOffIcon.style.display = 'block';
      cursorToggleBtn.setAttribute('title', 'Enable Custom Cursor');
    }
  }

  // Toggle Custom Cursor
  if (cursorToggleBtn) {
    cursorToggleBtn.addEventListener('click', () => {
      const currentlyDisabled = document.documentElement.classList.contains('custom-cursor-disabled');
      const cursorOnIcon = cursorToggleBtn.querySelector('.cursor-icon-on');
      const cursorOffIcon = cursorToggleBtn.querySelector('.cursor-icon-off');

      if (currentlyDisabled) {
        // Enable Custom Cursor
        document.documentElement.classList.remove('custom-cursor-disabled');
        localStorage.setItem('custom-cursor-disabled', 'false');
        cursorToggleBtn.classList.remove('disabled-state');
        if (cursorOnIcon) cursorOnIcon.style.display = 'block';
        if (cursorOffIcon) cursorOffIcon.style.display = 'none';
        
        // Update helper titles
        cursorToggleBtn.setAttribute('title', 'Disable Custom Cursor (Save CPU)');
      } else {
        // Disable Custom Cursor (Go back to default pointer)
        document.documentElement.classList.add('custom-cursor-disabled');
        localStorage.setItem('custom-cursor-disabled', 'true');
        cursorToggleBtn.classList.add('disabled-state');
        if (cursorOnIcon) cursorOnIcon.style.display = 'none';
        if (cursorOffIcon) cursorOffIcon.style.display = 'block';

        // Update helper titles
        cursorToggleBtn.setAttribute('title', 'Enable Custom Cursor');

        // Reset hover classes to ensure clean transition
        document.body.classList.remove('hovering-link', 'hovering-dark');
      }
    });
  }

});
