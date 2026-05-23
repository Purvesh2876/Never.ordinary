/* NEVER ORDINARY — site JS */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Custom cursor ---------- */
  const cursor = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  if (cursor && dot && matchMedia('(hover:hover)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2;
    let cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    const tick = () => {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll('a,button,.proj,.pillar,.cap,.stat,.step')
      .forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
      });
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', scrollY > 24);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    /* Add close (×) button inside the drawer */
    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.style.cssText = 'position:absolute;top:22px;right:22px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:50%;font-size:22px;color:#fff;cursor:pointer;z-index:2';
    closeBtn.innerHTML = '&times;';
    links.appendChild(closeBtn);

    const blockScroll = e => e.preventDefault();

    const openNav = () => {
      burger.classList.add('is-open');
      links.classList.add('is-open');
      nav.classList.add('nav--open');
      burger.setAttribute('aria-expanded', 'true');
      document.addEventListener('touchmove', blockScroll, { passive: false });
      document.addEventListener('wheel', blockScroll, { passive: false });
    };

    const closeNav = () => {
      burger.classList.remove('is-open');
      links.classList.remove('is-open');
      nav.classList.remove('nav--open');
      burger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('touchmove', blockScroll);
      document.removeEventListener('wheel', blockScroll);
    };

    burger.addEventListener('click', () =>
      burger.classList.contains('is-open') ? closeNav() : openNav()
    );
    closeBtn.addEventListener('click', closeNav);
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Hero glow follows mouse ---------- */
  const glow = document.querySelector('.hero__glow');
  if (glow && !reduced) {
    addEventListener('mousemove', e => {
      const x = (e.clientX / innerWidth - .5) * 40;
      const y = (e.clientY / innerHeight - .5) * 40;
      glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  /* ---------- Word crossfade rotor ---------- */
  const wrWords = document.querySelectorAll('.wr');
  if (wrWords.length > 1) {
    let cur = 0;
    setInterval(() => {
      wrWords[cur].classList.remove('is-active');
      cur = (cur + 1) % wrWords.length;
      wrWords[cur].classList.add('is-active');
    }, 2600);
  }

  /* ---------- Counter animation ---------- */
  const ease = t => 1 - Math.pow(1 - t, 3);
  const animateCount = el => {
    const target = parseFloat(el.dataset.count);
    const dur = 1800;
    const start = performance.now();
    const isLarge = target >= 1000;
    const step = now => {
      const p = Math.min(1, (now - start) / dur);
      const v = target * ease(p);
      el.textContent = isLarge
        ? Math.floor(v).toLocaleString('en-IN')
        : Math.floor(v);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = isLarge ? target.toLocaleString('en-IN') : target;
    };
    requestAnimationFrame(step);
  };
  const countIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => countIo.observe(el));

  /* ---------- Year stamp ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
