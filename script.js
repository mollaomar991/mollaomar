// background canvas animation for hero section
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const AMBER = 'rgba(212,168,83,';
  const WHITE = 'rgba(240,237,232,';

  let W, H, nodes;
  const COUNT = 55;
  const DIST  = 180;
  const SPEED = 0.3;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    makeNodes();
  }

  function makeNodes() {
    nodes = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    }

    // draw lines between close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const a = (1 - d / DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = WHITE + a + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // draw dots
    nodes.forEach((n, i) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = i % 9 === 0 ? AMBER + '0.7)' : WHITE + '0.25)';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();


// typewriter effect for hero tagline
(function() {
  const el = document.querySelector('.tagline-rotating');
  if (!el) return;

  const phrases = [
    'Interpretable ML systems.',
    'LLM security research.',
    'Computer vision pipelines.',
    'Tools that explain themselves.',
    'AI that earns your trust.',
  ];

  let pi = 0, ci = 0, del = false;

  function tick() {
    const phrase = phrases[pi];
    if (!del) {
      ci++;
      el.textContent = phrase.slice(0, ci);
      if (ci === phrase.length) {
        del = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 55);
    } else {
      ci--;
      el.textContent = phrase.slice(0, ci);
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 30);
    }
  }

  setTimeout(tick, 800);
})();


// nav: mobile menu + active link on scroll
(function() {
  const nav      = document.getElementById('nav');
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function updateActive() {
    let current = '';
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
    if (window.innerWidth <= 640) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


// scroll reveal animations
(function() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  // stagger cards in grids
  document.querySelectorAll('.research-grid, .projects-grid, .skills-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.dataset.delay = i * 80;
    });
  });

  document.querySelectorAll('.achieve-list li').forEach((li, i) => {
    li.classList.add('reveal');
    li.dataset.delay = i * 100;
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// 3D tilt on hover for profile photo
(function() {
  const wrap  = document.querySelector('.hero-photo-wrap');
  const frame = document.getElementById('hero-photo');
  if (!wrap || !frame) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const MAX = 12;

  wrap.addEventListener('mousemove', (e) => {
    const rect = frame.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
    const rx = -dy * MAX;
    const ry =  dx * MAX;

    frame.classList.add('tilting');
    frame.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    frame.style.boxShadow = `${-ry * 2}px ${rx * 2}px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,83,${0.08 + Math.abs(dx + dy) * 0.07})`;
  });

  wrap.addEventListener('mouseleave', () => {
    frame.classList.remove('tilting');
    frame.style.transform = '';
    frame.style.boxShadow = '';
  });
})();


// fade in hero on page load
(function() {
  const inner = document.querySelector('.hero-inner');
  if (!inner) return;
  inner.style.opacity = '0';
  inner.style.transform = 'translateY(16px)';
  inner.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      inner.style.opacity = '1';
      inner.style.transform = 'translateY(0)';
    });
  });
})();
