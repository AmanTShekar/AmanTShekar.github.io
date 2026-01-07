<<<<<<< HEAD
/**
 * PORTFOLIO v5.0 | INTERACTION ENGINE
 * Optimized GSAP Engine for Performance & Immersion
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize GSAP & ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 2. Cinematic Hero Entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

  heroTl
    .from('.nav-container', { y: -30, opacity: 0, duration: 1 })
    .from('.hero-title .line', { y: 100, opacity: 0, stagger: 0.15, skewY: 5 }, '-=0.8')
    .from('.availability-badge', { x: -20, opacity: 0 }, '-=1.2')
    .from('.hero-sub', { y: 30, opacity: 0 }, '-=1.2')
    .from('.hero-actions', { y: 30, opacity: 0 }, '-=1.2')
    .from('.image-frame', { x: 100, opacity: 0, duration: 2, scale: 0.9 }, '-=1.5')
    .from('.exp-badge', { scale: 0, opacity: 0, ease: 'back.out(2)' }, '-=1.2');

  // 2b. Hero Image Drift
  gsap.to('.image-frame img', {
    y: 15,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // 3. Staggered Bento Grid & Section Headers
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
          start: 'top 95%', // More aggressive trigger
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'all' // Ensures GSAP doesn't leave styles behind
      });
    }
  });

  // 4. Bento Item Hover Parallax (Desktop Only)
  if (window.matchMedia('(min-width: 1024px)').matches) {
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

  // 5. Project Reveal Logic
  gsap.utils.toArray('.project-card').forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 92%',
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // 6. Smooth Navbar Transition
  const checkNav = () => {
    const nav = document.querySelector('.nav-container');
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkNav, { passive: true });
  checkNav(); // Initial check

  // 7. Mobile Menu Logic
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

});
=======
// ====================== Hamburger Menu ======================
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.querySelector(".hamburger");
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("open");
}

function closeMenu() {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.querySelector(".hamburger");
  navLinks.classList.remove("active");
  hamburger.classList.remove("open");
}

// ====================== Smooth Scroll ======================
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

// ====================== Reveal On Scroll ======================
const revealItems = document.querySelectorAll('.tech-item, .service-card, .project-card');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('appear');
      }, i * 150); // stagger animation
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(el => revealObserver.observe(el));

// ====================== Cursor Gradient Effect ======================
let rafId;
revealItems.forEach(item => {
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

  item.addEventListener('mousemove', moveHandler);
  item.addEventListener('mouseleave', () => {
    item.style.setProperty('--x', '50%');
    item.style.setProperty('--y', '50%');
  });
});

// ====================== Hero Tagline Animation ======================
document.addEventListener("DOMContentLoaded", () => {
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    const text = tagline.textContent.trim();
    tagline.innerHTML = '';

    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = 0;
      span.style.display = 'inline-block';
      span.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      span.style.transitionDelay = `${i * 0.2}s`;
      span.style.transform = 'translateY(10px)';
      tagline.appendChild(span);
    });

    setTimeout(() => {
      tagline.querySelectorAll('span').forEach(span => {
        span.style.opacity = 1;
        span.style.transform = 'translateY(0)';
      });
    }, 300);
  }
});

const reveals = document.querySelectorAll('.reveal, .tech-item, .service-card, .project-card, .contact-item');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

reveals.forEach(el => observer.observe(el));

// ====================== Active Nav Link on Scroll ======================
const sections = document.querySelectorAll("section[id]"); // all sections with IDs
const navLinksAll = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80; // offset for navbar height
    const sectionHeight = section.offsetHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove("active-link");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active-link");
    }
  });
});

 
>>>>>>> 5c2dab960849602b7cde0c28cfd3e4e080e6a179
