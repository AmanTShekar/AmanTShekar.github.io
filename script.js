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

    // 2. Cinematic Hero Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

    heroTl
      .from('.nav-container', { y: -30, opacity: 0, duration: 1 })
      .from('.retro-2side-box', { y: 40, opacity: 0, scale: 0.95, duration: 1.2 }, '-=0.6')
      .from('.hero-title .line', { y: 60, opacity: 0, stagger: 0.15 }, '-=0.8')
      .from('.retro-sub-text', { opacity: 0, y: 20, duration: 0.8 }, '-=0.8')
      .from('.btn-retro-primary, .btn-retro-outline', { opacity: 0, y: 20, stagger: 0.15, duration: 0.8 }, '-=0.6')
      .from('.image-frame', { x: 80, opacity: 0, duration: 1.5, scale: 0.95 }, '-=1.2')
      .from('.exp-badge', { scale: 0, opacity: 0, ease: 'back.out(2)' }, '-=0.8');

    // 2b. Hero Image Drift
    gsap.to('.image-frame img', {
      y: 15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
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
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  }

  // 4. Staggered Bento Grid & Section Headers
  if (hasGsap && typeof ScrollTrigger !== 'undefined') {
    const sections = gsap.utils.toArray('section');
    sections.forEach(section => {
      const header = section.querySelector('.section-header');
      if (header) {
        gsap.from(header, {
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
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
          y: 30,
          opacity: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }
    });
  }

  // 5. Bento Item Hover Parallax (Desktop Only)
  if (hasGsap && window.matchMedia('(min-width: 1024px)').matches) {
    document.querySelectorAll('.bento-item').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(item, {
          rotateY: x * 5,
          rotateX: -y * 5,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    });
  }

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
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: (i % 3) * 0.1, // Slight stagger for grid items
          ease: 'power2.out'
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
