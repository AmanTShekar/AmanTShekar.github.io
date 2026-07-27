/**
 * PORTFOLIO v5.0 | INTERACTION ENGINE
 * Optimized GSAP Engine for Performance & Immersion
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize GSAP & ScrollTrigger safely if loaded
  const hasGsap = typeof gsap !== 'undefined';

  // Custom Retro Scramble Engine
  function scrambleText(element, finalString, duration = 800) {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let start = Date.now();
    function update() {
      let now = Date.now();
      let progress = Math.min((now - start) / duration, 1);
      let result = '';
      for (let i = 0; i < finalString.length; i++) {
        if (finalString[i] === ' ') { result += ' '; continue; }
        if (Math.random() < progress) {
          result += finalString[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.textContent = result;
      if (progress < 1) requestAnimationFrame(update);
      else element.textContent = finalString;
    }
    requestAnimationFrame(update);
  }

  // True Pixel-to-Solid Reveal Engine
  function pixelReveal(card) {
    if (card.dataset.pixelRevealed) return;
    card.dataset.pixelRevealed = "true";
    
    // Make sure card can contain absolute overlay
    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    
    // Figure out the dark mode background vs light mode
    const isDark = card.closest('.experience-section') || card.closest('.testimonials-section');
    const bgColor = isDark ? '#000000' : '#fff0e6';

    const overlay = document.createElement('div');
    overlay.className = 'pixel-reveal-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '-5px';
    overlay.style.left = '-5px';
    overlay.style.right = '-5px';
    overlay.style.bottom = '-5px';
    overlay.style.display = 'grid';
    overlay.style.gridTemplateColumns = 'repeat(12, 1fr)';
    overlay.style.gridTemplateRows = 'repeat(10, 1fr)';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';

    // Fill grid with solid blocks
    for (let i = 0; i < 120; i++) {
      const block = document.createElement('div');
      block.style.background = bgColor;
      overlay.appendChild(block);
    }
    card.appendChild(overlay);

    // Fade out blocks randomly
    gsap.to(overlay.children, {
      opacity: 0,
      duration: 0.05,
      stagger: {
        amount: 0.6,
        from: "random"
      },
      ease: "steps(1)",
      onComplete: () => overlay.remove()
    });
  }

  if (hasGsap) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    
// Pac-Man mouth chomp — real pie-arc opens/closes like classic Pac-Man
function startPacManChomp(pathId) {
  const path = document.getElementById(pathId);
  if (!path) return null;
  let raf;
  let running = true;
  const cx = 20, cy = 20, r = 20;
  const MAX_ANGLE = 38; // max half-angle of mouth opening (degrees)
  const SPEED = 7;      // chomps per second

  function buildArc(angleDeg) {
    if (angleDeg < 0.5) angleDeg = 0.5;
    const a = angleDeg * Math.PI / 180;
    // Top lip of mouth (above horizontal center line)
    const x1 = +(cx + r * Math.cos(-a)).toFixed(3);
    const y1 = +(cy + r * Math.sin(-a)).toFixed(3);
    // Bottom lip of mouth (below horizontal center line)
    const x2 = +(cx + r * Math.cos(a)).toFixed(3);
    const y2 = +(cy + r * Math.sin(a)).toFixed(3);
    // Arc: from top lip, counter-clockwise (sweep=0) the LONG way (large-arc=1) to bottom lip
    // This draws the body of Pac-Man, leaving a pie-wedge gap (the mouth) on the right
    return 'M '+cx+','+cy+' L '+x1+','+y1+' A '+r+','+r+' 0 1,0 '+x2+','+y2+' Z';
  }

  function animate(now) {
    if (!running) return;
    // abs(sin) oscillates 0→1→0 repeatedly at SPEED chomps/sec
    const phase = Math.abs(Math.sin(now * 0.001 * Math.PI * SPEED));
    const angleDeg = 2 + phase * MAX_ANGLE;
    path.setAttribute('d', buildArc(angleDeg));
    raf = requestAnimationFrame(animate);
  }

  raf = requestAnimationFrame(animate);
  return function stop() { running = false; cancelAnimationFrame(raf); };
}

    // 2. Retro Boot Sequence — Real Pac-Man end-to-end
    const retroLoader = document.getElementById('retroLoader');
    const loaderBar   = document.getElementById('loaderBar');
    const loaderText  = document.getElementById('loaderText');

    if (retroLoader) {
    // Use a one-shot flag — set only during internal page transitions
    const skipOnce = sessionStorage.getItem('skipLoader');
    if (skipOnce) sessionStorage.removeItem('skipLoader'); // consume immediately

      const runHeroReveal = () => {
        const heroTl = gsap.timeline({ defaults: { ease: 'none', duration: 0.15 } });
        heroTl
          .from('.nav-container', { y: -20, opacity: 0 }, skipOnce ? '+=0.05' : '+=0.4')
          .add(() => {
            document.querySelectorAll('.brutal-hero-box, .brutal-description-box, .image-frame, .hero-tagline, .nav-container').forEach(el => pixelReveal(el));
          })
          .from('.brutal-hero-box', { x: -20, opacity: 0 })
          .from('.hero-title .line', { x: -20, opacity: 0, stagger: 0.1 })
          .from('.brutal-description-box', { y: 20, opacity: 0 })
          .from('.hero-actions', { y: 20, opacity: 0 })
          .from('.exp-badge', { scale: 0.8, opacity: 0 });
      };

      if (skipOnce) {
        retroLoader.classList.add('loader-hidden');
        runHeroReveal();
      } else {
        document.body.style.overflow = 'hidden';

        // Build dot track
        const dotsRow = document.getElementById('pmDotsRow');
        const pmChar  = document.getElementById('pmChar');
        const pmGhost = document.getElementById('pmGhost');
        const NUM_DOTS = 20;
        const dots = [];

        const stopPmChomp = startPacManChomp('pmPath');
        if (dotsRow) {
          dotsRow.innerHTML = ''; // Clear any existing dots
          for (let i = 0; i < NUM_DOTS; i++) {
            const d = document.createElement('span');
            d.className = (i === 4 || i === NUM_DOTS - 2) ? 'pm-dot power' : 'pm-dot';
            dotsRow.appendChild(d);
            dots.push(d);
          }
        }

        const TOTAL_MS = 1800;
        let ghostFleeing = false;
        let rafId;
        let finished = false;
        const phases = [
          { pct: 25,  msg: 'Loading modules...' },
          { pct: 55,  msg: 'Crunching assets...' },
          { pct: 80,  msg: 'Connecting systems...' },
          { pct: 100, msg: 'SYSTEM ONLINE.' }
        ];
        let phaseIdx = 0;

        const updateBar = (pct) => {
          if (!loaderBar) return;
          const n = Math.min(Math.floor(pct / 10), 10);
          loaderBar.textContent = '[' + '|'.repeat(n) + ' '.repeat(10 - n) + '] ' + Math.floor(pct) + '%';
        };

        const closeLoader = () => {
          if (finished) return;
          finished = true;
          if (stopPmChomp) stopPmChomp();
          cancelAnimationFrame(rafId);
          updateBar(100);
          if (loaderText) loaderText.textContent = 'SYSTEM ONLINE.';
          gsap.to(retroLoader, {
            y: '-100%',
            duration: 0.5,
            ease: 'steps(12)',
            delay: 0.3,
            onComplete: () => {
              retroLoader.classList.add('loader-hidden');
              document.body.style.overflow = '';
            }
          });
          runHeroReveal();
        };

        // Hard failsafe — always close after 5s no matter what
        const failsafe = setTimeout(closeLoader, 5000);

        // Wait one frame so layout is painted, then measure & start
        requestAnimationFrame(() => {
          // Use window.innerWidth as the reliable full-screen track width
          const trackW = Math.max(window.innerWidth - 130, 200);
          const t0 = performance.now();

          const tick = (now) => {
            if (finished) return;
            const t = Math.min((now - t0) / TOTAL_MS, 1);
            const pct = t * 100;

            // Move Pac-Man across the full track
            if (pmChar) pmChar.style.transform = 'translateX(' + Math.round(t * trackW) + 'px)';

            // Eat dots proportionally
            if (dots.length) {
              const spacing = trackW / (NUM_DOTS - 1);
              dots.forEach((d, i) => {
                if (t * trackW + 25 > i * spacing) {
                  d.classList.add('eaten');
                  if ((i === 4 || i === NUM_DOTS - 2) && !ghostFleeing) {
                    ghostFleeing = true;
                    if (pmGhost) {
                      const gs = pmGhost.querySelector('svg');
                      if (gs) gs.style.filter = 'hue-rotate(195deg) brightness(0.55)';
                    }
                  }
                }
              });
            }

            updateBar(pct);
            if (phaseIdx < phases.length && pct >= phases[phaseIdx].pct) {
              if (loaderText) loaderText.textContent = phases[phaseIdx].msg;
              phaseIdx++;
            }

            if (t < 1) {
              rafId = requestAnimationFrame(tick);
            } else {
              clearTimeout(failsafe);
              closeLoader();
            }
          };

          rafId = requestAnimationFrame(tick);
        });
      }
    }
  }



  // 3. Collab Section — Real Pac-Man track animation (ScrollTrigger activated, loops)
  const collabWrapper = document.getElementById('collabPmWrapper');
  const collabChar    = document.getElementById('collabPmChar');
  const collabDots    = document.getElementById('collabPmDots');
  const collabGhost   = document.getElementById('collabPmGhost');

  if (collabWrapper && collabChar && collabDots) {
    const COLLAB_DOTS  = 22;
    const COLLAB_MS    = 2400; // one left-to-right run
    const cDots        = [];
    let collabRaf;
    let collabStarted  = false;
    let collabGhostFlee = false;

    // Inject dots
    for (let i = 0; i < COLLAB_DOTS; i++) {
      const d = document.createElement('span');
      d.className = (i === 5 || i === COLLAB_DOTS - 2) ? 'cpm-dot power' : 'cpm-dot';
      collabDots.appendChild(d);
      cDots.push(d);
    }

    let stopCollabChomp = null;
    const resetCollab = () => {
      collabGhostFlee = false;
      cDots.forEach(d => d.classList.remove('eaten'));
      if (collabChar) collabChar.style.transform = 'translateX(0px)';
      if (collabGhost) {
        const gs = collabGhost.querySelector('svg');
        if (gs) gs.style.filter = '';
      }
    };

    const runCollabOnce = () => {
      resetCollab();
      const trackW = Math.max(window.innerWidth - 130, 200);
      const t0 = performance.now();

      const tick = (now) => {
        const t = Math.min((now - t0) / COLLAB_MS, 1);

        if (collabChar) collabChar.style.transform = 'translateX(' + Math.round(t * trackW) + 'px)';

        if (cDots.length) {
          const spacing = trackW / (COLLAB_DOTS - 1);
          cDots.forEach((d, i) => {
            if (t * trackW + 30 > i * spacing) {
              d.classList.add('eaten');
              if ((i === 5 || i === COLLAB_DOTS - 2) && !collabGhostFlee) {
                collabGhostFlee = true;
                if (collabGhost) {
                  const gs = collabGhost.querySelector('svg');
                  if (gs) gs.style.filter = 'hue-rotate(195deg) brightness(0.55)';
                }
              }
            }
          });
        }

        if (t < 1) {
          collabRaf = requestAnimationFrame(tick);
        } else {
          // Pause at end, then loop back
          setTimeout(() => {
            collabGhostFlee = false;
            runCollabOnce();
          }, 800);
        }
      };

      collabRaf = requestAnimationFrame(tick);
    };

    // Trigger when contact section scrolls into view
    if (hasGsap && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 80%',
        once: false,
        onEnter: () => {
          if (!collabStarted) {
            collabStarted = true;
            requestAnimationFrame(() => runCollabOnce());
          }
        }
      });
    } else {
      // Fallback: start immediately
      requestAnimationFrame(() => runCollabOnce());
    }
  }

  // 4. Hero Tagline Animation (Replaces the native implementation)

  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const text = tagline.textContent.trim();
    tagline.innerHTML = '';
    text.split(' ').forEach((word) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.display = 'inline-block';
      tagline.appendChild(span);
    });
    
    if (hasGsap) {
      gsap.from('.hero-tagline span', {
        y: 10,
        opacity: 0,
        stagger: 0.1,
        duration: 0.15,
        ease: 'none',
        delay: 0.3
      });
    }
  }

  // 4. Staggered Bento Grid & Section Headers
  if (hasGsap && typeof ScrollTrigger !== 'undefined') {
    const sections = gsap.utils.toArray('section');
    sections.forEach(section => {
      const title = section.querySelector('.section-title');
      const label = section.querySelector('.section-label');
      
      if (title) {
        const originalText = title.textContent.trim();
        title.textContent = "";
        ScrollTrigger.create({
          trigger: section,
          start: 'top 85%',
          onEnter: () => {
            pixelReveal(title);
            scrambleText(title, originalText, Math.max(originalText.length * 50, 600));
          },
          once: true
        });
      }
      
      if (label) {
        gsap.from(label, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
          opacity: 0,
          duration: 0.1,
          ease: 'none'
        });
      }

      // Bento Items Reveal
      const items = section.querySelectorAll('.bento-item');
      if (items.length > 0) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            toggleActions: 'play none none none',
            onEnter: () => {
              items.forEach(item => {
                pixelReveal(item);
                const bentoTitle = item.querySelector('h3, .tech-name, .contact-title');
                if (bentoTitle && !bentoTitle.dataset.scrambled) {
                  bentoTitle.dataset.scrambled = "true";
                  const orig = bentoTitle.textContent.trim();
                  bentoTitle.textContent = "";
                  scrambleText(bentoTitle, orig, 600);
                }
              });
            }
          },
          y: 40,
          duration: 0.3,
          stagger: 0.05,
          ease: 'steps(4)',
          clearProps: 'all'
        });
      }
    });
  }

  // 5. Bento Item Hover Parallax (REMOVED FOR RETRO THEME)
  // 3D Tilt conflicts with flat 2D blocky aesthetics.

  // 6. Generic GSAP Scroll Reveals (Replacing native IntersectionObserver)
  if (hasGsap && typeof ScrollTrigger !== 'undefined') {
    const revealSelectors = ['.project-card', '.work-card', '.testimonial-card', '.service-card', '.tech-item', '.contact-item', '.roadmap-item', '.footer', '.section-header', '.hero-section', '.reveal', '.contact-content', '.collab-pm-wrapper', '.bento-item'];
    revealSelectors.forEach(selector => {
      gsap.utils.toArray(selector).forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            onEnter: () => {
              pixelReveal(el);
              const cardTitle = el.querySelector('h2, h3, .project-title, .service-title, .roadmap-company, .roadmap-role, .author-name, .work-name, .tech-name, .section-label');
              if (cardTitle && !cardTitle.dataset.scrambled) {
                cardTitle.dataset.scrambled = "true";
                const orig = cardTitle.textContent.trim();
                cardTitle.textContent = "";
                scrambleText(cardTitle, orig, 600);
              }
            }
          },
          y: 40,
          duration: 0.3,
          delay: (i % 3) * 0.1, // Slight stagger for grid items
          ease: 'steps(4)',
          clearProps: 'all'
        });
      });
    });
  }

  // 7. Cursor Gradient Effect (Re-implemented for performance)
  let rafId;
  const gradientItems = document.querySelectorAll('.tech-item, .service-card, .project-card, .bento-item');
  gradientItems.forEach(item => {
    const moveHandler = e => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        item.style.setProperty('--x', `${x}%`);
        item.style.setProperty('--y', `${y}%`);
      });
    };

    item.addEventListener('mousemove', moveHandler, { passive: true });
    item.addEventListener('mouseleave', () => {
      item.style.setProperty('--x', '50%');
      item.style.setProperty('--y', '50%');
    });
  });

  // 8. Mobile Menu Logic & Smooth Scroll
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  const closeMenu = () => {
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        if (window.innerWidth <= 768) closeMenu();
        const offset = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // 9. Consolidated Scroll Handler (Navbar State & Active Links)
  const navContainer = document.querySelector('.nav-container');
  const sectionIds = document.querySelectorAll("section[id]");
  const navLinksAll = document.querySelectorAll(".nav-links a");

  let isScrolling = false;

  const handleScroll = () => {
    // Navbar visual state
    if (window.scrollY > 20) {
      if (navContainer) navContainer.classList.add('scrolled');
    } else {
      if (navContainer) navContainer.classList.remove('scrolled');
    }

    // Active nav link
    let current = "";
    sectionIds.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      const sectionHeight = section.offsetHeight;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove("active-link");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active-link");
      }
    });
    
    isScrolling = false;
  };

  // Throttle scroll using requestAnimationFrame
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(handleScroll);
      isScrolling = true;
    }
  }, { passive: true });
  
  handleScroll(); // Initial check

  // 10. Serverless Contact Form Submission (Web3Forms API for GitHub Pages)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const originalBtnText = submitBtn.innerHTML;
      
      // Update UI state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Sending...';
      if (formStatus) {
        formStatus.className = 'form-status-banner status-loading';
        formStatus.style.display = 'block';
        formStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Sending your message...';
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          if (formStatus) {
            formStatus.className = 'form-status-banner status-success';
            formStatus.innerHTML = '<div style="font-weight: 600; font-size: 1.05rem; margin-bottom: 4px;"><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> Message Sent Successfully!</div><div style="opacity: 0.9; font-size: 0.9rem;">Thank you for reaching out! Aman has received your message and will reply to you shortly.</div>';
          }
          contactForm.reset();
        } else {
          // Fallback to mailto if access key is not set or API error occurs
          throw new Error(data.message || 'API key configuration needed');
        }
      } catch (err) {
        console.warn('Web3Forms Notice (Falling back to Mailto):', err);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const message = formData.get('message') || '';
        const mailtoUrl = `mailto:aman.tshekar@gmail.com?subject=Portfolio%20Contact%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        window.location.href = mailtoUrl;
        
        if (formStatus) {
          formStatus.className = 'form-status-banner status-error';
          formStatus.innerHTML = '<div style="font-weight: 600; font-size: 1.05rem; margin-bottom: 4px;"><i class="fa-solid fa-envelope" style="margin-right: 8px;"></i> Opening Email App...</div><div style="opacity: 0.9; font-size: 0.9rem;">Opening your default email client to send your message directly to aman.tshekar@gmail.com</div>';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // 9. Universal Smooth Retro Page Transitions (all pages to all pages)
  if (hasGsap) {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;

      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('http') && !href.includes(location.hostname)) return;
      if (href.startsWith('#')) return;

      e.preventDefault();

      const wipe = document.createElement('div');
      Object.assign(wipe.style, {
        position: 'fixed', top: '0', left: '0', right: '0',
        width: '100%', height: '100vh',
        background: '#000',
        zIndex: '999999',
        transform: 'translateY(101%)',
        pointerEvents: 'all'
      });
      document.body.appendChild(wipe);

      // Set skip flag so the destination page knows this was an internal navigation
      sessionStorage.setItem('skipLoader', '1');
      gsap.to(wipe, {
        y: '0%',
        duration: 0.38,
        ease: 'steps(9)',
        onComplete: () => { window.location.href = href; }
      });
    });
  }




  // Easter Egg: Experience Badge Click
  const expBadge = document.getElementById('xpBadge');
  if (expBadge) {
    let clickCount = 0;
    expBadge.addEventListener('click', (e) => {
      clickCount++;
      const popup = document.createElement('div');
      popup.textContent = clickCount >= 5 ? 'MAX LEVEL!' : '+1 XP!';
      popup.style.position = 'fixed';
      popup.style.left = (e.clientX + 10) + 'px';
      popup.style.top = (e.clientY - 20) + 'px';
      popup.style.color = '#FFD700';
      popup.style.fontWeight = 'bold';
      popup.style.fontSize = '1.5rem';
      popup.style.textShadow = '2px 2px 0 #000';
      popup.style.pointerEvents = 'none';
      popup.style.zIndex = '9999';
      popup.style.fontFamily = "'Courier New', Courier, monospace";
      document.body.appendChild(popup);
      
      gsap.to(popup, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power1.out',
        onComplete: () => popup.remove()
      });
      
      // Little shake animation on the badge
      gsap.fromTo(expBadge, 
        { rotation: -5 }, 
        { rotation: 5, yoyo: true, repeat: 3, duration: 0.05, onComplete: () => gsap.set(expBadge, {rotation: 0}) }
      );
    });
  }

});

// =========================================
// PROJECT CARDS: FLIP SCRAMBLE EFFECT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  const flipCards = document.querySelectorAll('.project-card.flip-enabled');
  
  const chars = '!<>-_/[]{}�=+*^?#________';
  
  function scrambleText(element) {
    const finalStr = element.getAttribute('data-final');
    if (!finalStr) return;
    
    let iterations = 0;
    const maxIterations = 20;
    
    const interval = setInterval(() => {
      element.innerText = finalStr.split('').map((char, index) => {
        if (index < iterations / 2) {
          return finalStr[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        element.innerText = finalStr;
      }
      iterations++;
    }, 40);
  }

  flipCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return;
      
      const isFlipped = this.classList.contains('flipped');
      this.classList.toggle('flipped');
      
      if (!isFlipped) {
        const scrambleElements = this.querySelectorAll('.scramble-text');
        setTimeout(() => {
          scrambleElements.forEach(el => scrambleText(el));
        }, 300); 
      }
    });
  });
});



