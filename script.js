/**
 * PORTFOLIO v5.0 | INTERACTION ENGINE
 * Optimized GSAP Engine for Performance & Immersion
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize GSAP & ScrollTrigger safely if loaded
  const hasGsap = typeof gsap !== 'undefined';

  if (hasGsap) {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 2. Retro Boot Sequence & Hero Reveal
    const retroLoader = document.getElementById('retroLoader');
    const loaderBar = document.getElementById('loaderBar');
    const loaderText = document.getElementById('loaderText');

    if (retroLoader) {
      document.body.style.overflow = 'hidden'; // prevent scrolling while loading
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        const filled = '|'.repeat(progress / 10);
        const empty = ' '.repeat(10 - (progress / 10));
        loaderBar.textContent = `[${filled}${empty}] ${progress}%`;
        
        if (progress === 30) loaderText.textContent = 'Loading core modules...';
        if (progress === 70) loaderText.textContent = 'Establishing secure connection...';
        if (progress === 100) loaderText.textContent = 'SYSTEM ONLINE.';
        
        if (progress >= 100) {
          clearInterval(interval);
          gsap.to(retroLoader, {
            y: '-100%',
            duration: 0.4,
            ease: 'power4.in',
            delay: 0.3,
            onComplete: () => {
              retroLoader.style.display = 'none';
              document.body.style.overflow = '';
            }
          });

          // Blocky Hero Reveal
          const heroTl = gsap.timeline({ defaults: { ease: 'none', duration: 0.15 } });

          heroTl
            .from('.nav-container', { y: -20, opacity: 0 }, '+=0.4')
            .from('.brutal-hero-box', { x: -20, opacity: 0 })
            .from('.hero-title .line', { x: -20, opacity: 0, stagger: 0.1 })
            .from('.brutal-description-box', { y: 20, opacity: 0 })
            .from('.hero-actions', { y: 20, opacity: 0 })
            .from('.image-frame', { x: 20, opacity: 0 })
            .from('.exp-badge', { scale: 0.8, opacity: 0 });
        }
      }, 80); // Speed of loading
    }
  }

  // 3. Hero Tagline Animation (Replaces the native implementation)
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
        gsap.to(title, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
          text: originalText,
          duration: originalText.length * 0.05,
          ease: 'none'
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
            toggleActions: 'play none none none'
          },
          keyframes: [
            { opacity: 0, duration: 0.05 },
            { opacity: 1, duration: 0.05 },
            { opacity: 0, duration: 0.05 },
            { opacity: 1, duration: 0.1 }
          ],
          stagger: 0.05,
          ease: 'steps(1)',
          clearProps: 'all'
        });
      }
    });
  }

  // 5. Bento Item Hover Parallax (REMOVED FOR RETRO THEME)
  // 3D Tilt conflicts with flat 2D blocky aesthetics.

  // 6. Generic GSAP Scroll Reveals (Replacing native IntersectionObserver)
  if (hasGsap && typeof ScrollTrigger !== 'undefined') {
    const revealSelectors = ['.project-card', '.work-card', '.testimonial-card', '.service-card', '.tech-item', '.contact-item', '.reveal'];
    revealSelectors.forEach(selector => {
      gsap.utils.toArray(selector).forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
          },
          keyframes: [
            { opacity: 0, duration: 0.05 },
            { opacity: 1, duration: 0.05 },
            { opacity: 0, duration: 0.05 },
            { opacity: 1, duration: 0.1 }
          ],
          delay: (i % 3) * 0.1, // Slight stagger for grid items
          ease: 'steps(1)',
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

});
