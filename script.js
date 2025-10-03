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

 
