// ====================== Hamburger Menu ======================
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.querySelector(".hamburger");
  navLinks.classList.toggle("active");
  hamburger.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
}
function closeMenu() {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.querySelector(".hamburger");
  navLinks.classList.remove("active");
  hamburger.textContent = "☰";
}

// ====================== Smooth Scroll ======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const targetId = anchor.getAttribute('href');
    if(targetId === '#') return;
    const target = document.querySelector(targetId);
    if(target) {
      if(window.innerWidth <= 768) closeMenu();
      const offset = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ====================== Reveal On Scroll ======================
const revealItems = document.querySelectorAll('.tech-item, .service-card, .project-card');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('appear'); // Add class immediately
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// Observe all items
revealItems.forEach(el => revealObserver.observe(el));

// ====================== Cursor Gradient ======================
revealItems.forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty('--x', `${x}%`);
    item.style.setProperty('--y', `${y}%`);
  });
  item.addEventListener('mouseleave', () => {
    item.style.setProperty('--x', '50%');
    item.style.setProperty('--y', '50%');
  });
});

// ====================== Hero Tagline Animation ======================
const tagline = document.querySelector('.hero-tagline');
if(tagline) {
  const text = tagline.textContent.trim();
  tagline.innerHTML = '';
  text.split(' ').forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.opacity = 0;
    span.style.display = 'inline-block';
    span.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
