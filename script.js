/* ============================================================
   AI Laoshi — jonli animatsiyalar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeaderScroll();
  initParallaxBlobs();
  initFloatingHanzi();
  initTypingRotator();
  initActiveNav();
  initCardTilt();
});

/* ---------- 1. Scroll-reveal: bo'limlar silliq paydo bo'ladi ---------- */
function initReveal() {
  // Animatsiya qilinadigan elementlarga "reveal" klassini beramiz
  const targets = document.querySelectorAll(
    '.hero > *, #about .section-title, #about .section-desc, #about .eyebrow, ' +
    '.about-photo, .about-content, .project-card, .contact-box, ' +
    '#projects .eyebrow, #projects .section-title, #projects .section-desc, ' +
    '#contact .eyebrow, #contact .section-title, #contact .section-desc'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Bir guruhdagi elementlar ketma-ket (stagger) chiqishi uchun kichik kechikish
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
  });

  // Harakatni kamaytirishni yoqqan foydalanuvchilar uchun animatsiyani o'chiramiz
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  // IntersectionObserver mavjud bo'lmasa — hammasini darhol ko'rsatamiz
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  targets.forEach((el) => observer.observe(el));

  // Xavfsizlik to'ri: agar biror sabab bilan observer ishlamasa,
  // kontent "opacity:0" holatida qotib qolmasligi uchun 1.5s dan keyin ochamiz
  setTimeout(() => {
    targets.forEach((el) => el.classList.add('visible'));
  }, 1500);
}

/* ---------- 2. Header scroll paytida "qalinlashadi" ---------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- 3. Fon "blob"lari sichqoncha ortidan yuradi ---------- */
function initParallaxBlobs() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const blobs = document.querySelectorAll('.bg-blob');
  if (!blobs.length) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  window.addEventListener('mousemove', (e) => {
    // -0.5 ... 0.5 oralig'ida normallashtiramiz
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;
  });

  const render = () => {
    // Silliq "ergashish" uchun lerp
    curX += (targetX - curX) * 0.05;
    curY += (targetY - curY) * 0.05;

    blobs.forEach((blob, i) => {
      const depth = (i + 1) * 26; // har bir blob har xil chuqurlikda
      blob.style.transform =
        `translate(${curX * depth}px, ${curY * depth}px)`;
    });
    requestAnimationFrame(render);
  };
  render();
}

/* ---------- 4. Fon bo'ylab ko'tariladigan xitoycha ierogliflar ---------- */
function initFloatingHanzi() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Ma'nosi bilan tanlangan belgilar
  const chars = [
    ['学', "o'rganish"], ['爱', 'sevgi'], ['智', 'aql'],
    ['语', 'til'], ['师', 'ustoz'], ['中', 'markaz/Xitoy'],
    ['文', 'yozuv'], ['能', 'qobiliyat'], ['未来', 'kelajak'],
    ['你好', 'salom'], ['谢谢', 'rahmat'], ['成功', 'muvaffaqiyat'],
  ];

  const layer = document.createElement('div');
  layer.className = 'hanzi-layer';
  document.body.appendChild(layer);

  const spawn = () => {
    const [ch] = chars[Math.floor(Math.random() * chars.length)];
    const el = document.createElement('span');
    el.className = 'hanzi';
    el.textContent = ch;

    const size = 20 + Math.random() * 46;          // 20–66px
    const duration = 12 + Math.random() * 12;        // 12–24s
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = size + 'px';
    el.style.animationDuration = duration + 's';
    el.style.opacity = (0.05 + Math.random() * 0.12).toFixed(2);

    layer.appendChild(el);
    // Animatsiya tugagach tozalaymiz
    setTimeout(() => el.remove(), duration * 1000);
  };

  // Sahifa yuklanganda bir nechtasini tarqatib yuboramiz
  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 1400);
  setInterval(spawn, 2600);
}

/* ---------- 5. Hero'da almashib turadigan yozuv (typing) ---------- */
function initTypingRotator() {
  const el = document.getElementById('rotator');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = 'tez';
    return;
  }

  const words = ['tez', 'qiziqarli', 'samarali', 'zamonaviy', 'oson'];
  let w = 0, i = 0, deleting = false;

  const tick = () => {
    const word = words[w];
    el.textContent = word.slice(0, i);

    if (!deleting && i < word.length) {
      i++;
      setTimeout(tick, 90);
    } else if (!deleting && i === word.length) {
      deleting = true;
      setTimeout(tick, 1400);         // to'liq so'zni bir oz ushlab turamiz
    } else if (deleting && i > 0) {
      i--;
      setTimeout(tick, 45);
    } else {
      deleting = false;
      w = (w + 1) % words.length;
      setTimeout(tick, 250);
    }
  };
  tick();
}

/* ---------- 6. Scroll paytida faol menyu bo'limi yoritiladi ---------- */
function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const map = new Map();
  links.forEach((link) => {
    const id = link.getAttribute('href').replace('#', '');
    const section = document.getElementById(id);
    if (section) map.set(section, link);
  });
  if (!map.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          map.get(entry.target)?.classList.add('active');
        }
      });
    },
    { threshold: 0.35 }
  );
  map.forEach((_, section) => observer.observe(section));
}

/* ---------- 7. Loyiha kartalari sichqonchaga qarab 3D egiladi ---------- */
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
