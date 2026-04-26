(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const mobileNav = document.querySelector('.mobile-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const cursor = document.querySelector('.custom-cursor');
  const scrollTopBtn = document.querySelector('.scroll-top');
  const toast = document.querySelector('.toast');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  const finishLoading = () => body.classList.add('loaded');
  window.addEventListener('load', finishLoading);
  setTimeout(finishLoading, 1800);

  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 16);
    scrollTopBtn?.classList.toggle('show', window.scrollY > 500);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  navToggle?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    const animate = () => {
      x += (mouseX - x) * 0.16;
      y += (mouseY - y) * 0.16;
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    document.querySelectorAll('a, button, input, textarea, .card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => observer.observe(el));
  }

  const currentPage = body.dataset.page;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((link) => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = Number(el.dataset.counter || '0');
      const duration = 1600;
      const start = performance.now();
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const format = (n) => new Intl.NumberFormat().format(Math.round(n));

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${format(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const contactForm = document.querySelector('[data-contact-form]');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = original;
      showToast('Thanks — your message has been sent.');
    }, 900);
  });
})();

const form = document.querySelector(".contact-form");
const status = document.getElementById("form-status");

if(form){
  form.addEventListener("submit", async function(e){
    e.preventDefault();
    const data = new FormData(form);
    
    fetch(form.action, {
      method: "POST",
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        status.innerHTML = "✅ Message sent successfully!";
        form.reset();
      } else {
        status.innerHTML = "❌ Oops! Something went wrong.";
      }
    }).catch(() => {
      status.innerHTML = "❌ Error sending message.";
    });
  });
}