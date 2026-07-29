// Ultimate Scroll Reset (Handles hashes, GSAP, and browser cache)
if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
window.onbeforeunload = function () { window.scrollTo(0, 0); };
window.onload = function() {
  setTimeout(function() {
    window.scrollTo(0, 0);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, 100);
};
/**
 * PORTFOLIO v5.0 | INTERACTION ENGINE
 * Optimized GSAP Engine for Performance & Immersion
 */

// =========================================
// RETRO SFX ENGINE — Web Audio API (synthesized 8-bit)
// Hoisted to module scope so multiple DOMContentLoaded blocks can share it.
// Off by default. Persists to localStorage 'portfolioAudio'.
// =========================================
const AudioFX = (() => {
  const KEY = 'portfolioAudio';
  let ctx = null;
  let master = null;
  let enabled = false;

  function ensureCtx() {
    if (ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.18; // calm 18% master volume
      master.connect(ctx.destination);
    } catch (e) {
      ctx = null; // no audio available — silently no-op
    }
  }

// Pac-Man sound intentionally disabled — the loaders and collab Pac-Man run silently.
// (sampleCache / loadSample / playSample scaffolding removed)

  function isEnabled() { return enabled; }

  function setEnabled(v) {
    enabled = !!v;
    try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch (e) {}
    const btn = document.getElementById('audioToggle');
    const icon = document.getElementById('audioIcon');
    if (btn) {
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      btn.setAttribute('title', enabled ? 'Sound: On' : 'Sound: Off');
      if (icon) icon.className = enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    }
    if (enabled) {
      ensureCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
      playBeep(660, 0.06); // confirm click SFX
    }
  }

  function load() {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === null) return false; // off by default
      return stored === '1';
    } catch (e) { return false; }
  }

  function playTone(freq, durationMS, type = 'square', gain = 0.4, when = 0) {
    ensureCtx();
    if (!ctx || !enabled) return;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + durationMS / 1000);
    osc.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + durationMS / 1000 + 0.02);
  }

  function playBeep(freq, durationMS, type = 'square', gain = 0.4) {
    playTone(freq, durationMS, type, gain);
  }

  function playSweep(fromHz, toHz, durationMS, type = 'square', gain = 0.4) {
    ensureCtx();
    if (!ctx || !enabled) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(fromHz, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(toHz, 20), t0 + durationMS / 1000);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + durationMS / 1000);
    osc.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + durationMS / 1000 + 0.02);
  }

  function playNoise(durationMS, gain = 0.25) {
    ensureCtx();
    if (!ctx || !enabled) return;
    const t0 = ctx.currentTime;
    const len = Math.floor((durationMS / 1000) * ctx.sampleRate);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    g.gain.value = gain;
    src.buffer = buffer;
    src.connect(g).connect(master);
    src.start(t0);
  }

  const sfx = {
    hover: () => playBeep(440, 30, 'square', 0.15),
    click: () => { playBeep(660, 50, 'square', 0.4); playBeep(880, 30, 'square', 0.2, 0.05); },
    // Pac-Man is intentionally silent — no chomp/eatDot/powerDot SFX.
    chomp: () => playBeep(330, 40, 'triangle', 0.15),
    eatDot: () => playTone(880, 20, 'sine', 0.1),
    powerDot: () => playSweep(440, 880, 100, 'square', 0.2),
    jump: () => playSweep(330, 740, 180, 'square', 0.35),
    land: () => playBeep(160, 50, 'sawtooth', 0.18),
    hit:  () => { playNoise(180, 0.2); playSweep(400, 80, 250, 'sawtooth', 0.3); },
    flip: (unflip) => playSweep(unflip ? 740 : 330, unflip ? 330 : 740, 180, 'square', 0.35),
    levelUp: () => {
      const notes = [523, 659, 784, 1047]; // C E G C
      notes.forEach((f, i) => playBeep(f, 110, 'square', 0.4, i * 0.09));
    },
        konami: () => {
      const mel = [392, 523, 659, 784, 659, 784];
      mel.forEach((f, i) => playBeep(f, 130, 'square', 0.4, i * 0.11));
    },
    select: () => playBeep(784, 40, 'square', 0.2),
    success: () => { 
      playTone(523, 100, 'square', 0.2, 0); 
      playTone(659, 100, 'square', 0.2, 0.1); 
      playTone(1047, 300, 'square', 0.2, 0.2); 
    },
    error: () => playSweep(200, 50, 300, 'sawtooth', 0.3),
  };

// Initialize from storage
  enabled = load();

  return { isEnabled, setEnabled, sfx };
})();

// True Pixel-to-Solid Reveal Engine — hoisted to module scope for shared use.
function pixelReveal(card) {
  if (card.dataset.pixelRevealed) return;
  card.dataset.pixelRevealed = "true";
  if (getComputedStyle(card).position === 'static') {
    card.style.position = 'relative';
  }
  const isDark = card.closest('.experience-section') || card.closest('.testimonials-section');
  const bgColor = isDark ? '#000000' : '#fff0e6';
  const overlay = document.createElement('div');
  overlay.className = 'pixel-reveal-overlay';
  Object.assign(overlay.style, {
    position: 'absolute', top: '-5px', left: '-5px', right: '-5px', bottom: '-5px',
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridTemplateRows: 'repeat(10, 1fr)',
    zIndex: '9999', pointerEvents: 'none'
  });
  for (let i = 0; i < 120; i++) {
    const block = document.createElement('div');
    block.style.background = bgColor;
    overlay.appendChild(block);
  }
  card.appendChild(overlay);
  if (typeof gsap !== 'undefined') {
    gsap.to(overlay.children, {
      opacity: 0,
      duration: 0.05,
      stagger: { amount: 0.6, from: "random" },
      ease: "steps(1)",
      onComplete: () => overlay.remove()
    });
  } else {
    overlay.style.transition = 'opacity 0.6s steps(10)';
    requestAnimationFrame(() => { overlay.style.opacity = '0'; });
    setTimeout(() => overlay.remove(), 800);
  }
}

// Pac-Man sound intentionally disabled — the loaders and collab Pac-Man run silently.

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

  // True Pixel-to-Solid Reveal Engine — defined at module scope (top of file).

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
        document.body.style.overflow = '';  // safety clear
        runHeroReveal();
      } else {
        document.body.style.overflow = 'hidden';
        // Hard‑safety: clear overflow regardless after 6s in case the loader
        // never finishes (e.g. Pac‑Man SVG missing → no percent close).
        setTimeout(() => { document.body.style.overflow = ''; }, 6000);

        // Build dot stream — dots appear and flow into Pac-Man's mouth
        const dotsContainer = document.getElementById('loaderDots');
        const NUM_DOTS = 16;
        const dots = [];

        const stopPmChomp = startPacManChomp('pmPath');
        if (dotsContainer) {
          dotsContainer.innerHTML = '';
          for (let i = 0; i < NUM_DOTS; i++) {
            const d = document.createElement('span');
            d.className = 'loader-dot';
            dotsContainer.appendChild(d);
            dots.push(d);
          }
        }

        const TOTAL_MS = 1800;
        let rafId;
        let finished = false;
        const phases = [
          { pct: 25,  msg: 'LOADING MODULES...' },
          { pct: 55,  msg: 'CRUNCHING ASSETS...' },
          { pct: 80,  msg: 'CONNECTING SYSTEMS...' },
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

        const failsafe = setTimeout(closeLoader, 5000);

        requestAnimationFrame(() => {
          const t0 = performance.now();
          let dotPtr = 0;

          const tick = (now) => {
            if (finished) return;
            const t = Math.min((now - t0) / TOTAL_MS, 1);
            const pct = t * 100;

            // Show dots progressively as they appear then get eaten
            const showCount = Math.floor(t * NUM_DOTS);
            for (let i = 0; i < showCount && i < NUM_DOTS; i++) {
              if (!dots[i].classList.contains('show')) dots[i].classList.add('show');
            }
            // Eat dots that have been visible for a beat
            const eatCount = Math.max(0, showCount - 2);
            for (let i = 0; i < eatCount && i < NUM_DOTS; i++) {
              if (!dots[i].classList.contains('eaten')) dots[i].classList.add('eaten');
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
      if (typeof gsap !== 'undefined' && collabChar) {
        gsap.set(collabChar, { x: 0, yPercent: -50 });
      } else if (collabChar) {
        collabChar.style.transform = 'translate(0px, -50%)';
      }
      if (collabGhost) {
        const gs = collabGhost.querySelector('svg');
        if (gs) gs.style.filter = '';
      }
    };

    const runCollabOnce = () => {
      if (!stopCollabChomp) { stopCollabChomp = startPacManChomp('collabPmPath'); }
      resetCollab();
      const trackW = window.innerWidth <= 480 ? 180 : Math.max(window.innerWidth - 130, 200);

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          onComplete: () => {
            setTimeout(() => runCollabOnce(), 800);
          }
        });
        tl.to(collabChar, {
          x: trackW,
          yPercent: -50,
          duration: COLLAB_MS / 1000,
          ease: 'none',
          onUpdate: function () {
            const p = this.progress();
            if (cDots.length) {
              const spacing = trackW / (COLLAB_DOTS - 1);
              cDots.forEach((d, i) => {
                if (p * trackW + 30 > i * spacing) {
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
          }
        });
        return;
      }

      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min((now - t0) / COLLAB_MS, 1);
        if (collabChar) collabChar.style.transform = 'translate(' + Math.round(t * trackW) + 'px, -50%)';
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
          if (AudioFX && AudioFX.sfx && typeof AudioFX.sfx.success === 'function') AudioFX.sfx.success();
          if (formStatus) {
            formStatus.className = 'form-status-banner status-success';
            formStatus.innerHTML = '<div style="font-weight: 600; font-size: 1.05rem; margin-bottom: 4px;"><i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> Message Sent Successfully!</div><div style="opacity: 0.9; font-size: 0.9rem;">Thank you for reaching out! Aman has received your message and will reply to you shortly.</div>';
          }
          contactForm.reset();
        } else {
          // Fallback to mailto if access key is not set or API error occurs
          if (AudioFX && AudioFX.sfx && typeof AudioFX.sfx.error === 'function') AudioFX.sfx.error();
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

  // =========================================
  // RETRO SFX ENGINE — defined at module scope (top of file).
  // AudioFX is shared between both DOMContentLoaded blocks.
  // =========================================
  // (duplicate AudioFX declaration removed — see top of script.js)

  // Apply initial UI state without playing the confirm sound
  (function initAudioUI() {
    const btn = document.getElementById('audioToggle');
    const icon = document.getElementById('audioIcon');
    if (!btn || !icon) return;
    const enabled = AudioFX.isEnabled();
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    btn.setAttribute('title', enabled ? 'Sound: On' : 'Sound: Off');
    icon.className = enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    btn.addEventListener('click', () => {
      AudioFX.setEnabled(!AudioFX.isEnabled());
    });
  })();

  // =========================================
  // HOOK SFX INTO EXISTING INTERACTIONS
  // =========================================
  // Nav links + nav CTA
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('mouseenter', () => AudioFX.sfx.hover());
    a.addEventListener('click', () => AudioFX.sfx.select());
  });

  // Buttons (primary, brutal CTA, social nodes, contact-link, blog cards, filter pills)
  document.querySelectorAll('.btn, .social-node, .contact-link, .overlay-btn, .work-card, .nav-logo, .blog-card, .filter-pill').forEach(el => {
    el.addEventListener('mouseenter', () => AudioFX.sfx.hover());
  });
  document.querySelectorAll('.btn, .social-node, .contact-link, .overlay-btn, .blog-card').forEach(el => {
    el.addEventListener('click', () => AudioFX.sfx.click());
  });

  // Bento items + service / suite cards = low key hover
  document.querySelectorAll('.bento-item, .service-card, .tech-item').forEach(el => {
    el.addEventListener('mouseenter', () => AudioFX.sfx.hover());
  });

// Pac-Man loaders: chomp on each dot eaten — only when the track is visible in the viewport.
  // We observe both the dot container's class mutations AND an IntersectionObserver on the
  // parent track wrapper so sound only fires while the user can actually see it.
  (function patchChompSFX() {
    const observed = document.querySelectorAll('.collab-pm-dots');
    if (!observed.length) return;
    function findTrackWrapper(container) {
      let el = container;
      while (el && !el.classList.contains('collab-pm-wrapper') && !el.classList.contains('loader-box')) {
        el = el.parentElement;
      }
      return el || container;
    }
    const visibilityMap = new WeakMap();
    observed.forEach(container => {
      const wrapper = findTrackWrapper(container);
      visibilityMap.set(container, false);
      if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            visibilityMap.set(container, entry.isIntersecting);
          }
        }, { rootMargin: '50px', threshold: 0 });
        io.observe(wrapper);
      } else {
        visibilityMap.set(container, true);
      }
    });

    observed.forEach(container => {
      let lastPlay = 0;
      const obs = new MutationObserver((muts) => {
        if (!AudioFX.isEnabled()) return;
        if (!visibilityMap.get(container)) return;
        const now = performance.now();
        if (now - lastPlay < 35) return;
        for (const m of muts) {
          if (m.attributeName === 'class' && m.target.classList.contains('eaten')) {
            if (m.target.classList.contains('power')) AudioFX.sfx.powerDot();
            else AudioFX.sfx.eatDot();
            lastPlay = now;
            break;
          }
        }
      });
      obs.observe(container, { subtree: true, attributes: true, attributeFilter: ['class'] });
    });
  })();

  // =========================================
  // INTERACTIVE HERO DINO GAME
  // Press Space or click the dino strip → jump. Avoid multiple cacti.
  // Click the strip after death → restart. Space is gated to fire only when
  // the hero section is actually in the viewport.
  // =========================================
  (function dinoGame() {
    const game   = document.getElementById('dinoGame');
    const dino   = document.getElementById('dinoCharacter');
    const hint   = document.getElementById('dinoHint');
    if (!game || !dino) return;

    const cactusEls = Array.from(game.querySelectorAll('[data-cactus]'));
    if (!cactusEls.length) return;

    let jumping = false;
    let dead = false;
    let started = false;
    let score = 0;
    let scoreEl = null;
    let scoreRaf = null;
    let slideRaf = null;
    let visible = false;

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && started && !dead) {
          startScoreClock();
          startSlideLoop();
        }
      }, { threshold: 0, rootMargin: '200px' });
      io.observe(game);
    } else {
      visible = true;
    }

    function showScore() {
      if (!scoreEl) {
        scoreEl = document.createElement('div');
        scoreEl.className = 'dino-score';
        scoreEl.innerHTML = 'HI <span id="dinoHi">0</span> · NOW <span id="dinoNow">0</span>';
        game.appendChild(scoreEl);
      }
      document.getElementById('dinoNow').textContent = String(score).padStart(4, '0');
      const hi = parseInt(localStorage.getItem('dinoHi') || '0', 10);
      document.getElementById('dinoHi').textContent = String(Math.max(hi, score)).padStart(4, '0');
    }

    function startScoreClock() {
      showScore();
      if (scoreRaf) return;
      let last = performance.now();
      const tick = (now) => {
        if (dead) { scoreRaf = null; return; }
        if (!visible) { scoreRaf = null; return; }
        const dt = (now - last) / 1000;
        last = now;
        score += Math.floor(dt * 50); // ~50 pts/sec while alive
        showScore();
        scoreRaf = requestAnimationFrame(tick);
      };
      scoreRaf = requestAnimationFrame(tick);
    }

    function resetCacti() {
      // Spread cacti out across off-screen right with random gaps.
      let x = window.innerWidth + 80;
      cactusEls.forEach((c, i) => {
        c.style.animation = 'none';
        c.style.right = 'auto';
        c.style.left  = 'auto';
        c.style.transform = `translateX(${x}px)`;
        c.dataset.passed = '';
        // Each cactus gets a slightly larger gap so they're staggered.
        x += 220 + Math.random() * 280;
      });
      // Pause the CSS-only ambient animation; we drive positions via JS.
      const ground = game.querySelector('.dino-ground');
      if (ground) ground.classList.add('paused');
    }

    function takeControl() {
      if (dino.dataset.controlled) return;
      dino.dataset.controlled = '1';
      dino.classList.add('player-controlled');
      if (hint) hint.classList.remove('hidden');
    }

    function start() {
      if (started) return;
      started = true;
      takeControl();
      resetCacti();
      if (hint) hint.classList.add('hidden');
      startScoreClock();
      startSlideLoop();
    }

    function restart() {
      dead = false;
      score = 0;
      jumping = false;
      dino.classList.remove('hit');
      gsap.set(dino, { y: 0 });
      if (hint) {
        hint.textContent = 'PRESS SPACE';
        hint.classList.add('hidden'); // hide hint on restart — already in play
      }
      resetCacti();
      startScoreClock();
      startSlideLoop();
    }

    function jump() {
      if (dead) return;          // click handles restart instead
      if (!started) start();
      if (jumping) return;
      if (hint) hint.classList.add('hidden');
      jumping = true;
      AudioFX.sfx.jump();
      gsap.to(dino, {
        y: -70,
        duration: 0.22,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(dino, {
            y: 0,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: () => {
              jumping = false;
              AudioFX.sfx.land();
            }
          });
        }
      });
    }

    function die() {
      if (dead) return;
      dead = true;
      started = false;
      AudioFX.sfx.hit();
      dino.classList.add('hit');
      const hi = parseInt(localStorage.getItem('dinoHi') || '0', 10);
      if (score > hi) localStorage.setItem('dinoHi', String(score));
      showScore();
      if (hint) {
        hint.textContent = 'CLICK TO RESTART';
        hint.classList.remove('hidden');
      }
      if (scoreRaf) { cancelAnimationFrame(scoreRaf); scoreRaf = null; }
      if (slideRaf) { cancelAnimationFrame(slideRaf); slideRaf = null; }
    }

    // One rAF loop drives every cactus + collision detection.
    function startSlideLoop() {
      if (slideRaf) return;
      let last = performance.now();
      const baseSpeed = 4.5;          // px per frame at 60fps
      const gap = 520;                // min horizontal gap between spawns
      function tick(now) {
        const dt = (now - last) / 16.67;
        last = now;
        if (dead) { slideRaf = null; return; }
        if (!visible) { slideRaf = null; return; }
        const speed = baseSpeed + Math.min(score / 1000, 3.5);
        const dinoRect = dino.getBoundingClientRect();
        let furthest = -Infinity;
        cactusEls.forEach((c) => {
          const m = c.style.transform.match(/translateX\(([-\d.]+)px\)/);
          let x = m ? parseFloat(m[1]) : window.innerWidth;
          x -= speed * dt;
          c.style.transform = `translateX(${x}px)`;
          furthest = Math.max(furthest, x);
          // Score + pass SFX
          const cRect = c.getBoundingClientRect();
          if (!c.dataset.passed && cRect.right < dinoRect.left) {
            c.dataset.passed = '1';
            score += 100;
            showScore();
            if (score % 500 === 0) AudioFX.sfx.levelUp();
          }
          // AABB collision — tightened boxes for fairness
          const hit = !(
            dinoRect.right - 6 < cRect.left + 4 ||
            dinoRect.left + 6 > cRect.right - 4 ||
            dinoRect.bottom - 4 < cRect.top + 4 ||
            dinoRect.top + 4 > cRect.bottom - 4
          );
          if (hit && !jumping) die();
          // Respawn when fully off-screen left, with a guaranteed minimum gap
          // from the rightmost cactus to avoid stacked obstacles.
          if (x < -60) {
            const spawnX = Math.max(furthest + gap, window.innerWidth + 40);
            c.style.transform = `translateX(${spawnX}px)`;
            c.dataset.passed = '';
            x = spawnX;
          }
          furthest = Math.max(furthest, x);
        });
        slideRaf = requestAnimationFrame(tick);
      }
      slideRaf = requestAnimationFrame(tick);
    }

    // ---- input handlers ----
    // Spacebar — only triggers when hero is actually in the viewport, so
    // page scrolling still works outside the hero.
    window.addEventListener('keydown', (e) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      const hero = document.querySelector('.hero-section');
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const inView = r.bottom > 0 && r.top < window.innerHeight;
      if (!inView) return;
      e.preventDefault();
      if (dead) restart();
      else jump();
    });

    // Click / tap on the dino strip → jump while alive, restart while dead.
    game.addEventListener('click', () => { if (dead) restart(); else jump(); });
    game.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.key === ' ') { e.preventDefault(); if (dead) restart(); else jump(); }
    });
  })();

  // =========================================
  // PAUSE INFINITE CSS ANIMATIONS OFF-SCREEN
  // =========================================
  (function pauseOffscreenAnimations() {
    const animatedEls = document.querySelectorAll(
      '.red-dead, .space-fighter, .super-mario, .pixel-arrow'
    );
    if (!animatedEls.length) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0, rootMargin: '100px' });
    animatedEls.forEach(el => io.observe(el));
  })();

  // =========================================
  // KONAMI CODE EASTER EGG
  // ↑ ↑ ↓ ↓ ← → ← → B A — triggers CRT scanline flash + chime (only SFX gated by audio toggle)
  // =========================================
  (function konami() {
    const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    let flashEl = null;
    let toastEl = null;
    let activeUntil = 0;

    function ensureEls() {
      if (!flashEl) {
        flashEl = document.createElement('div');
        flashEl.className = 'konami-flash';
        document.body.appendChild(flashEl);
      }
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'konami-toast';
        toastEl.textContent = 'CHEAT ACTIVATED · 1UP';
        document.body.appendChild(toastEl);
      }
    }

    function trigger() {
      const now = Date.now();
      if (now < activeUntil) return; // debounce
      activeUntil = now + 2000;
      ensureEls();
      // restart animations by toggling class
      flashEl.classList.remove('active');
      toastEl.classList.remove('active');
      // force reflow
      void flashEl.offsetWidth;
      void toastEl.offsetWidth;
      flashEl.classList.add('active');
      toastEl.classList.add('active');
      // chime (only audible if audio toggle is on, but always visible)
      AudioFX.sfx.konami();
    }

    window.addEventListener('keydown', (e) => {
      const k = e.key;
      // Match case-insensitively for b/a
      const key = k.length === 1 ? k.toLowerCase() : k;
      if (key === SEQ[idx]) {
        idx++;
        if (idx === SEQ.length) {
          idx = 0;
          trigger();
        }
      } else if (key === SEQ[0]) {
        idx = 1;
      } else {
        idx = 0;
      }
    });
  })();

  // =========================================
  // HIDDEN ALIENS — FIND-ALL SCAVENGER HUNT
  //
  // 6 aliens are scattered across the page (each carries `data-alien`).
  // Click one to collect it. After the first find:
  //   • a hunt HUD appears top-right showing "ALIENS  X / 6"
  //   • progress persists to localStorage 'huntFound'
  // When all 6 are found:
  //   • a victory banner + confetti burst
  //   • a final chime cascade (gated by audio toggle)
  //   • the save persists so it won't re-fire until cleared
  // =========================================
  (function alienHunt() {
    const aliens = Array.from(document.querySelectorAll('[data-alien]'));
    if (!aliens.length) return;

    const TOTAL = aliens.length;
    const KEY = 'huntFound';
    const bannerShownKey = 'huntBannerSeen';
    const completedKey = 'huntCompleted';
    let found = new Set();
    let bannerEl = null;
    let progressEl = null;
    let victoryEl = null;
    let confettiHost = null;

    // Restore previously found aliens (so reload doesn't reset progress)
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(saved)) saved.forEach(id => found.add(id));
    } catch (e) {}

    function persist() {
      try { localStorage.setItem(KEY, JSON.stringify(Array.from(found))); } catch (e) {}
    }

    function shake(el) {
      if (typeof gsap === 'undefined') return;
      gsap.fromTo(el,
        { rotation: -8 },
        { rotation: 8, yoyo: true, repeat: 3, duration: 0.05,
          onComplete: () => gsap.set(el, { rotation: 0 }) }
      );
    }

    function spawnPopup(text, x, y, color, big) {
      const popup = document.createElement('div');
      popup.textContent = text;
      popup.style.position = 'fixed';
      popup.style.left = (x + 12) + 'px';
      popup.style.top = (y - 18) + 'px';
      popup.style.color = color || '#FFD700';
      popup.style.fontWeight = 'bold';
      popup.style.fontSize = big ? '1.4rem' : '0.9rem';
      popup.style.textShadow = '2px 2px 0 #000';
      popup.style.pointerEvents = 'none';
      popup.style.zIndex = '99999';
      popup.style.fontFamily = "'Press Start 2P', monospace";
      popup.style.letterSpacing = '1px';
      document.body.appendChild(popup);
      if (typeof gsap !== 'undefined') {
        gsap.to(popup, {
          y: big ? -42 : -30, opacity: 0,
          duration: big ? 1.2 : 0.8, ease: 'power1.out',
          onComplete: () => popup.remove()
        });
      } else { setTimeout(() => popup.remove(), 1200); }
    }

    // ---- HUD ----
    function ensureHUD() {
      if (bannerEl) return bannerEl;
      bannerEl = document.createElement('div');
      bannerEl.className = 'hunt-hud';
      bannerEl.innerHTML =
        '<span class="hunt-label">ALIENS</span>' +
        '<span class="hunt-progress"><span id="huntCount">0</span> / ' + TOTAL + '</span>' +
        '<div class="hunt-meter"><div class="hunt-meter-fill" id="huntMeterFill"></div></div>' +
        '<button class="hunt-close" id="huntClose" aria-label="Hide hunt HUD">×</button>';
      document.body.appendChild(bannerEl);
      progressEl = bannerEl.querySelector('#huntCount');
      // Allow user to hide the HUD (it'll come back next time they find one)
      const closeBtn = bannerEl.querySelector('#huntClose');
      if (closeBtn) closeBtn.addEventListener('click', () => {
        bannerEl.classList.remove('visible');
        try { localStorage.setItem(bannerShownKey, '0'); } catch (e) {}
      });
      // slide in
      requestAnimationFrame(() => bannerEl.classList.add('visible'));
      updateHUD();
      return bannerEl;
    }

    function updateHUD() {
      if (!bannerEl) return;
      if (progressEl) progressEl.textContent = String(found.size);
      const fill = bannerEl.querySelector('#huntMeterFill');
      if (fill) fill.style.width = ((found.size / TOTAL) * 100) + '%';
    }

    // ---- Victory banner + confetti ----
    function spawnConfetti() {
      confettiHost = document.createElement('div');
      confettiHost.className = 'confetti-host';
      document.body.appendChild(confettiHost);
      const colors = ['#FFD700', '#ffb89e', '#ff4d2d', '#2d241e', '#fffff0'];
      const N = 60;
      for (let i = 0; i < N; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.background = colors[i % colors.length];
        c.style.animationDelay = (Math.random() * 0.6) + 's';
        c.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
        c.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        confettiHost.appendChild(c);
      }
      setTimeout(() => { if (confettiHost) { confettiHost.remove(); confettiHost = null; } }, 4500);
    }

    function ensureVictory() {
      if (victoryEl) return victoryEl;
      victoryEl = document.createElement('div');
      victoryEl.className = 'hunt-victory';
      victoryEl.innerHTML =
        '<span class="hv-icon">🏆</span>' +
        '<span class="hv-title">ALL ALIENS FOUND</span>' +
        '<span class="hv-desc">You tracked down all ' + TOTAL + ' hidden invaders. The galaxy is safe.</span>' +
        '<button class="hv-close" id="hvClose">CONTINUE</button>';
      document.body.appendChild(victoryEl);
      const closeBtn = victoryEl.querySelector('#hvClose');
      if (closeBtn) closeBtn.addEventListener('click', () => victoryEl.classList.remove('active'));
      return victoryEl;
    }

    function triggerVictory() {
      let alreadyCompleted = false;
      try { alreadyCompleted = localStorage.getItem(completedKey) === '1'; } catch (e) {}
      // Always mark as completed so reload won't re-fire confetti.
      try { localStorage.setItem(completedKey, '1'); } catch (e) {}
      // First-time only: full victory fanfare (confetti + cascade chime).
      // Returning users just see the HUD + nothing else.
      if (alreadyCompleted) return;
      ensureVictory();
      victoryEl.classList.remove('active');
      void victoryEl.offsetWidth;
      victoryEl.classList.add('active');
      spawnConfetti();
      // Victory chime cascade — gated by audio toggle
      const climb = [523, 659, 784, 1047, 1319];
      climb.forEach((f, i) => {
        setTimeout(() => AudioFX.sfx.levelUp(), i * 150);
      });
    }

    // ---- Click handler ----
    function handle(alien, e) {
      if (e) e.preventDefault();
      const id = alien.getAttribute('data-alien-id') || ('a' + aliens.indexOf(alien));
      const x = (e && (e.clientX || 0)) || 0;
      const y = (e && (e.clientY || 0)) || 0;
      if (found.has(id)) {
        // Already collected — just a small feedback
        spawnPopup('FOUND', x, y, '#999', false);
        return;
      }
      found.add(id);
      persist();
      // Mark visually (fades out + adds a "collected" stamp)
      alien.classList.add('collected');
      spawnPopup('+' + found.size + '/' + TOTAL, x, y, '#FFD700', false);
      AudioFX.sfx.levelUp();
      shake(alien);
      ensureHUD();
      updateHUD();
      if (found.size === TOTAL) {
        // Hold the popup briefly then trigger the victory
        setTimeout(triggerVictory, 500);
      }
    }

    // Wire up each alien
    aliens.forEach(alien => {
      const id = alien.getAttribute('data-alien-id') || ('a' + aliens.indexOf(alien));
      if (found.has(id)) alien.classList.add('collected');
      alien.addEventListener('click', (e) => handle(alien, e));
      alien.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handle(alien, e); }
      });
      alien.addEventListener('mouseenter', () => {
        alien.classList.add('invader-hover');
        AudioFX.sfx.hover();
      });
      alien.addEventListener('mouseleave', () => alien.classList.remove('invader-hover'));
    });

    // If the user already finished, show the victory overlay (not confetti) on return
    let alreadyCompleted = false;
    try { alreadyCompleted = localStorage.getItem(completedKey) === '1'; } catch (e) {}
    if (alreadyCompleted && found.size === TOTAL) {
      // Soft reminder — show HUD only
      ensureHUD();
    }
  })();

});

// =========================================
// PROJECT CARDS: FLIP SCRAMBLE EFFECT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  const flipCards = document.querySelectorAll('.project-card.flip-enabled');
  
  flipCards.forEach(card => {
    // Hover SFX on flip-enabled cards
    card.addEventListener('mouseenter', () => AudioFX.sfx.hover());
    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return;
      
      const isFlipped = this.classList.contains('flipped');
      this.classList.toggle('flipped');
      // Card flip SFX — rising sweep on flip, falling sweep on unflip
      AudioFX.sfx.flip(isFlipped);
      
      if (!isFlipped) {
        const cardBack = this.querySelector('.card-back');
        if (cardBack) {
          delete cardBack.dataset.pixelRevealed;
          pixelReveal(cardBack);
        }

        const scrambleElements = this.querySelectorAll('.scramble-text');
        setTimeout(() => {
          scrambleElements.forEach(el => {
            const finalStr = el.getAttribute('data-final');
            if (finalStr) scrambleText(el, finalStr, 1200); // 1.2s for long descriptions
          });
        }, 300); 
      }
    });
  });
});






