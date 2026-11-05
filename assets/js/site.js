/* ============================================================
   STACKLY GYM & FITNESS — core engine (vanilla JS)
   ============================================================ */
'use strict';

const body = document.body;
const LOGO = 'stackly-logo-icon.webp';
const page = body.dataset.page || 'home';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

const USERS_KEY = 'stackly-gym-users';
const SESSION_KEY = 'stackly-gym-session';

/* ---------------- shared icons ---------------- */
const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 17h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
  chevron: '<svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/></svg>',
  signOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>'
};

/* ---------------- navigation ---------------- */
const publicNav = [
  ['home', 'Home', 'index.html'],
  ['about', 'About', 'about.html'],
  ['programs', 'Programs', 'programs.html'],
  ['trainers', 'Trainers', 'trainers.html'],
  ['pricing', 'Membership', 'pricing.html'],
  ['contact', 'Contact', 'contact.html']
];

const socialLinks = [
  ['Instagram', 'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2A69 69 0 0 1 2.2 12c0-3.2 0-3.6.1-4.9.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 4.9a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8m0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4m6.3-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z'],
  ['Facebook', 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z'],
  ['YouTube', 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c2 .5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4L15.8 12z'],
  ['X / Twitter', 'M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9zm-1.1 16.1h1.7L7.6 4.7H5.8z'],
  ['WhatsApp', 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.34M12.05 21.79c-.02 0-.02 0 0 0zm-4.66-.76.4-.23-3.74.98 1-3.65-.24-.38a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 7c0 5.45-4.44 9.88-9.89 9.88a9.88 9.88 0 0 1-4.98-1.38l-.35-.21m8.4-18.3A11.82 11.82 0 0 0 12.05 0C5.49 0 .16 5.34.15 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.41'],
  ['LinkedIn', 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z']
];

const socialRow = socialLinks.map(([label, d]) =>
  `<a class="social-link" href="404.html" data-demo aria-label="Stackly Gym &amp; Fitness on ${label}" title="${label}"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="${d}"></path></svg></a>`
).join('');

/* ---------------- public chrome ---------------- */
function renderPublicChrome() {
  const headerSlot = $('[data-site-header]');
  if (headerSlot) {
    const brandHTML = `<a class="brand" href="index.html" aria-label="Stackly Gym &amp; Fitness home">
      <img src="${LOGO}" alt="Stackly Gym &amp; Fitness logo" width="40" height="40">
      <span>STACKLY<small>Gym &amp; Fitness</small></span></a>`;
    const nav = publicNav.map(([key, label, href]) =>
      `<a href="${href}"${key === page ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    headerSlot.innerHTML = `
      <header class="site-header" data-site-header>
        <div class="container header-inner">
          ${brandHTML}
          <nav class="desktop-nav" aria-label="Primary navigation">${nav}</nav>
          <div class="header-actions">
            <a class="header-login" href="login.html">Log in</a>
          </div>
          <button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="public-drawer" aria-expanded="false">${ICON.menu}</button>
        </div>
      </header>
      <div class="drawer-backdrop" data-drawer-backdrop></div>
      <aside class="mobile-drawer" id="public-drawer" aria-label="Mobile navigation" aria-hidden="true">
        <div class="drawer-top">
          ${brandHTML}
          <button class="drawer-close" type="button" data-drawer-close aria-label="Close navigation">${ICON.close}</button>
        </div>
        <nav aria-label="Mobile primary navigation">${nav}</nav>
        <div class="drawer-actions">
          <a class="button" href="login.html">Log in ${ICON.arrow}</a>
        </div>
        <div class="drawer-meta">Open daily &middot; 5:00 AM &ndash; 11:00 PM</div>
      </aside>`;
  }

  const footerSlot = $('[data-site-footer]');
  if (footerSlot) {
    footerSlot.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand">
              <a class="brand" href="index.html"><img src="${LOGO}" alt="" width="44" height="44"><span>STACKLY<small>Gym &amp; Fitness</small></span></a>
              <p>A premium training floor built for real progress &mdash; elite coaching, smart programming, recovery suites, and a community that shows up every single day.</p>
              <div class="social-row" aria-label="Stackly on social media">${socialRow}</div>
            </div>
            <div class="footer-column">
              <h3>Explore</h3>
              <a href="index.html">Home</a><a href="about.html">About us</a><a href="trainers.html">Trainers</a><a href="pricing.html">Membership</a><a href="contact.html">Contact</a>
            </div>
            <div class="footer-column">
              <h3>Programs</h3>
              <a href="programs.html">Strength training</a><a href="programs.html">HIIT &amp; conditioning</a><a href="programs.html">Mobility &amp; recovery</a><a href="programs.html">Boxing</a><a href="programs.html">Nutrition coaching</a>
            </div>
            <div class="footer-column footer-column--contact">
              <h3>Visit us</h3>
              <p class="contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>21 Titan Avenue, Fitness District</span></p>
              <p class="contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg><span>+1 (555) 810-2743</span></p>
              <p class="contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg><span>train@stacklygym.com</span></p>
              <p class="contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Daily &middot; 5:00 AM &ndash; 11:00 PM</span></p>
              <p class="contact-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 17h14l-1.5-5.5a2 2 0 0 0-2-1.5h-7a2 2 0 0 0-2 1.5z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><path d="M9 10V8a3 3 0 0 1 6 0v2"/></svg><span>Free member parking on-site</span></p>
            </div>
          </div>
          <div class="footer-divider" aria-hidden="true"></div>
          <section class="newsletter reveal" aria-label="Newsletter">
            <div class="newsletter-inner">
              <div class="newsletter-copy">
                <div>
                  <span class="eyebrow">The Sunday fuel</span>
                  <h2 class="newsletter-title">Get stronger, smarter. <em>Weekly fuel, free.</em></h2>
                  <p class="newsletter-sub">Training tips, member offers and nutrition guides &mdash; one email a week, written by coaches, straight to your inbox.</p>
                  <div class="newsletter-perks" aria-hidden="true">
                    <span>Zero spam</span><i></i><span>1 email a week</span><i></i><span>Unsubscribe anytime</span>
                  </div>
                </div>
              </div>
              <form class="news-form" data-news novalidate>
                <div class="field" data-field="email">
                  <label for="news-email">Email address<span class="req" aria-hidden="true">*</span></label>
                  <input id="news-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@email.com" required>
                  <p class="field-msg" role="alert"><i></i><span></span></p>
                </div>
                <button class="button button--lg" type="submit">Subscribe ${ICON.arrow}</button>
              </form>
            </div>
          </section>
          <div class="footer-bottom">
            <span>&copy; 2026 Stackly Gym &amp; Fitness. A demo experience with demo data &mdash; nothing real is stored publicly.</span>
            <div class="footer-bottom-links"><a href="404.html" data-demo>Privacy</a><a href="404.html" data-demo>Terms</a><a href="404.html" data-demo>Safety</a></div>
          </div>
        </div>
      </footer>`;
  }
}

/* ---------------- header ---------------- */
function setupHeader() {
  const header = $('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 18);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('.menu-toggle', header);
  const drawer = $('#public-drawer');
  const backdrop = $('[data-drawer-backdrop]');
  if (!toggle || !drawer || !backdrop) return;
  const close = () => {
    drawer.classList.remove('is-open'); backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true'); toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('is-locked');
  };
  const open = () => {
    drawer.classList.add('is-open'); backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false'); toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('is-locked');
    $('[data-drawer-close]', drawer)?.focus();
  };
  toggle.addEventListener('click', () => drawer.classList.contains('is-open') ? close() : open());
  $('[data-drawer-close]', drawer)?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  $$('a, button', drawer).forEach(el => {
    if (!el.matches('[data-drawer-close]')) el.addEventListener('click', close);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
  const desktopMQ = window.matchMedia('(min-width: 920px)');
  const onDesktopChange = e => { if (e.matches) close(); };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onDesktopChange);
  else desktopMQ.addListener(onDesktopChange);
}

/* ---------------- micro polish ---------------- */
function setupCursorGlow() {
  if (reducedMotion || !window.matchMedia('(pointer:fine)').matches) return;
  const glow = $('.cursor-glow');
  if (!glow) return;
  let raf = 0, x = -340, y = -340;
  window.addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY; glow.style.opacity = '1';
    if (!raf) raf = requestAnimationFrame(() => { glow.style.transform = `translate(${x}px,${y}px)`; raf = 0; });
  }, { passive: true });
}

function setupReveals() {
  const items = $$('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reducedMotion) {
    items.forEach(el => el.classList.add('is-inview'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-inview'); io.unobserve(entry.target); }
    });
  }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => io.observe(el));
}

function setupCounters() {
  const els = $$('[data-count]');
  if (!els.length) return;
  const fmt = (val, suffix) => (suffix === '%' ? Math.round(val) : Math.floor(val)).toLocaleString('en-US');
  const run = el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reducedMotion) { el.textContent = fmt(target, suffix) + suffix; return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, suffix) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
}

function setupMeters() {
  const fills = $$('.meter-fill[data-val]');
  if (!fills.length) return;
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = `${e.target.dataset.val}%`;
        io.unobserve(e.target);
      }
    });
  }, { threshold: .6 });
  fills.forEach(el => io.observe(el));
}

function setupParallax() {
  if (reducedMotion) return;
  $$('.hero-media img').forEach(img => {
    const hero = img.closest('section');
    if (!hero) return;
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, hero.offsetHeight || 900);
      img.style.transform = `scale(1.08) translateY(${y * .12}px)`;
    }, { passive: true });
  });
}

function setupTaglineRotator() {
  $$('.tagline-rotator').forEach(rot => {
    const words = Array.from(rot.children);
    if (words.length < 2) return;
    let idx = 0;
    words[0].classList.add('is-active');
    if (reducedMotion) return;
    setInterval(() => {
      words[idx].classList.remove('is-active');
      idx = (idx + 1) % words.length;
      words[idx].classList.add('is-active');
    }, 3400);
  });
}

function setupMagnetic() {
  if (reducedMotion || !window.matchMedia('(pointer:fine)').matches) return;
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${dx * .16}px,${dy * .16}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------------- filters / accordion ---------------- */
function setupFilters() {
  $$('.filter-bar').forEach(bar => {
    const chips = $$('.filter-chip', bar);
    const cards = $$(`[data-cat]`, document);
    if (!chips.length) return;
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.toggle('is-active', c === chip));
      const f = chip.dataset.filter;
      cards.forEach(card => {
        if (!card.closest('.grid')) return;
        const show = f === 'all' || card.dataset.cat === f || (card.dataset.cat || '').split(' ').includes(f);
        card.style.display = show ? '' : 'none';
        if (show) { card.classList.remove('is-inview'); requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('is-inview'))); }
      });
    }));
  });
}

function setupAccordion() {
  $$('.acc-item').forEach(item => {
    const btn = $('.acc-btn', item);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      const group = item.closest('.accordion');
      $$('.acc-item', group).forEach(i => {
        i.classList.remove('open');
        $('.acc-btn', i)?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
}

/* ---------------- custom select ---------------- */
function setupDropdowns() {
  $$('[data-select]').forEach(wrap => {
    const trigger = $('.select-trigger', wrap);
    const menu = $('.select-menu', wrap);
    const label = $('.select-trigger .label', wrap);
    const hidden = $('input[type="hidden"]', wrap);
    if (!trigger || !menu || !hidden) return;

    const setLabel = text => {
      label.textContent = text;
      wrap.classList.toggle('has-value', text !== trigger.dataset.placeholder);
    };
    setLabel(trigger.dataset.placeholder || 'Select an option');

    const close = () => { wrap.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); };
    trigger.addEventListener('click', () => {
      const openNow = !wrap.classList.contains('is-open');
      $$('[data-select].is-open').forEach(w => { if (w !== wrap) w.classList.remove('is-open'); });
      wrap.classList.toggle('is-open', openNow);
      trigger.setAttribute('aria-expanded', String(openNow));
    });
    $$('button', menu).forEach(btn => btn.addEventListener('click', () => {
      $$('button', menu).forEach(b => b.setAttribute('aria-selected', String(b === btn)));
      hidden.value = btn.dataset.value || btn.textContent.trim();
      setLabel(btn.value || btn.textContent.trim());
      wrap.closest('.field')?.classList.remove('invalid');
      close();
      trigger.focus();
    }));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  });
}

/* ----------------Validation helpers---------------- */
function showFieldError(input, message) {
  const field = input.closest('.field') || input.closest('.role-cards')?.parentElement;
  const wrap = input.closest('[data-field]') || field;
  if (!wrap) return;
  wrap.classList.add('invalid');
  const msg = $('.field-msg', wrap) || $('.field-error', wrap);
  if (msg) {
    const i = $('i', msg); const span = $('span', msg);
    if (i) i.innerHTML = ICON.alert;
    if (span) span.textContent = message;
  }
  input.setAttribute('aria-invalid', 'true');
}

function clearFieldError(input) {
  const wrap = input.closest('[data-field]') || input.closest('.field');
  if (!wrap) return;
  wrap.classList.remove('invalid');
  input.removeAttribute('aria-invalid');
}

const RULES = {
  name: v => /^[A-Za-z][A-Za-z\s.'-]{2,39}$/.test(v.trim()) || 'Please use 3–40 letters — no numbers or symbols.',
  email: v => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v.trim()) || 'Enter a valid email like name@example.com.',
  phone: v => /^\d{10}$/.test(v.trim()) || 'Enter exactly 10 digits (numbers only).',
  message: v => v.trim().length >= 10 || 'Tell us a little more — at least 10 characters.',
  password: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,32}$/.test(v) || '8+ chars with uppercase, lowercase, number & symbol.'
};

function validateInput(input) {
  const val = input.value;
  let error = '';
  if (input.dataset.validate) {
    const rule = RULES[input.dataset.validate];
    const res = rule ? rule(val) : true;
    if (typeof res === 'string') error = res;
  }
  if (!error && input.type !== 'checkbox' && input.required && typeof val === 'string' && !val.trim()) error = 'This field is required.';
  return error;
}

function validateForm(form) {
  let firstBad = null;
  let valid = true;
  $$('input, textarea', form).forEach(input => {
    if (input.type === 'hidden' || input.disabled) return;
    if (input.type === 'checkbox') {
      const wrap = input.closest('[data-field]') || input.closest('.field');
      if (input.required && !input.checked) {
        valid = false; firstBad = firstBad || input;
        if (wrap) {
          wrap.classList.add('invalid');
          const msg = $('.field-msg', wrap);
          if (msg) { const i = $('i', msg); if (i) i.innerHTML = ICON.alert; const s = $('span', msg); if (s) s.textContent = 'Please accept this to continue.'; }
        }
        return;
      }
      wrap?.classList.remove('invalid');
      return;
    }
    const error = validateInput(input);
    if (error) { valid = false; firstBad = firstBad || input; showFieldError(input, error); }
    else clearFieldError(input);
  });

  const pwd = form.querySelector('[name="password"]');
  const confirm = form.querySelector('[name="confirm"]');
  if (pwd && confirm && !firstBad?.matches('[name="confirm"]')) {
    if (confirm.value && confirm.value !== pwd.value) { valid = false; showFieldError(confirm, 'Passwords do not match.'); }
    else clearFieldError(confirm);
  }
  const roleInput = form.querySelector('input[name="role"]');
  if (roleInput && !roleInput.value) showToast('Choose Member or Admin role to continue.', 'err');
  if (firstBad) { firstBad.focus(); showToast('Please fix the highlighted fields.', 'err'); }
  return valid;
}

/* ---------------- toast ---------------- */
function showToast(message, tone = 'ok') {
  let stack = $('.toast-stack');
  if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; stack.setAttribute('aria-live', 'polite'); body.appendChild(stack); }
  const toast = document.createElement('div');
  toast.className = `toast toast--${tone}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<i>${tone === 'ok' ? ICON.check : tone === 'err' ? ICON.alert : ICON.info}</i><span>${message}</span>`;
  stack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-in'));
  setTimeout(() => {
    toast.classList.remove('is-in');
    setTimeout(() => toast.remove(), 420);
  }, 4200);
}

/* ---------------- auth store ---------------- */
function hashPassword(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
  return `s${hash.toString(36)}.${value.length}`;
}

function getUsers() {
  try { const raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* demo mode */ }
}

const DEMO_USERS = [
  { name: 'Demo Admin', email: 'admin@stackly.demo', phone: '5551234567', role: 'admin', hash: hashPassword('Train@2026') },
  { name: 'Demo Member', email: 'member@stackly.demo', phone: '5551234567', role: 'customer', hash: hashPassword('Train@2026') }
];

function seedDemoAccounts() {
  const users = getUsers();
  DEMO_USERS.forEach(demo => { if (!users.some(u => u.email === demo.email)) users.push(demo); });
  saveUsers(users);
}

function readSession() {
  try { const raw = sessionStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/* ---------------- forms ---------------- */
function setupPasswordToggles() {
  $$('.pwd-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.innerHTML = show
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.1 10.1 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.5 9.5 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M2 2l20 20"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  });
  const pwd = $('input[name="password"]');
  const bars = $$('.strength i');
  if (pwd && bars.length) pwd.addEventListener('input', () => {
    let score = 0;
    if (pwd.value.length >= 8) score++;
    if (/[A-Z]/.test(pwd.value) && /[a-z]/.test(pwd.value)) score++;
    if (/\d/.test(pwd.value) && /[^A-Za-z\d]/.test(pwd.value)) score++;
    bars.forEach((bar, i) => { bar.className = i < score ? `on-${score}` : ''; });
  });
}

function setupRoleCards() {
  $$('[data-role-card]').forEach(card => {
    card.addEventListener('click', () => {
      const group = card.closest('[data-role-group]') || card.parentElement;
      $$('[data-role-card]', group).forEach(item => item.classList.toggle('is-active', item === card));
      const form = card.closest('form');
      const hidden = form?.querySelector('input[name="role"]');
      if (hidden) hidden.value = card.dataset.roleCard;
      $$('.role-switch', form).forEach(sw => {
        sw.classList.toggle('is-admin', card.dataset.roleCard === 'admin');
        $$('.role-opt', sw).forEach(o => o.classList.toggle('is-active', o.dataset.role === card.dataset.roleCard));
      });
      const wrap = card.closest('.field-wrap') || group.closest('.field');
      wrap?.classList.remove('invalid');
    });
  });
  $$('.role-switch').forEach(sw => {
    const opts = $$('.role-opt', sw);
    const form = sw.closest('form');
    opts.forEach(opt => opt.addEventListener('click', () => {
      const role = opt.dataset.role;
      sw.classList.toggle('is-admin', role === 'admin');
      opts.forEach(o => o.classList.toggle('is-active', o === opt));
      const hidden = form?.querySelector('input[name="role"]');
      if (hidden) hidden.value = role;
      $$('.role-card', form).forEach(c => c.classList.toggle('is-active', c.dataset.roleCard === role));
      const wrap = sw.closest('[data-field]') || sw.closest('.field');
      wrap?.classList.remove('invalid');
    }));
  });
}

function setupForms() {
  const signup = $('form[data-signup]');
  const login = $('form[data-login]');
  const contact = $('form[data-contact]');

  /* live validation feedback */
  $$('form').forEach(form => {
    $$('input:not([type="hidden"]):not([type="checkbox"]), textarea', form).forEach(input => {
      input.addEventListener('blur', () => { if (input.value.trim()) { const err = validateInput(input); err ? showFieldError(input, err) : clearFieldError(input); } });
      input.addEventListener('input', () => clearFieldError(input));
    });
  });

  if (signup) {
    seedDemoAccounts();
    signup.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(signup)) return;
      const users = getUsers();
      const email = signup.email.value.trim().toLowerCase();
      if (users.some(u => u.email.toLowerCase() === email)) {
        showFieldError(signup.email, 'This email is already registered — try logging in.');
        return;
      }
      users.push({
        name: signup.name.value.trim(),
        email,
        phone: signup.phone.value.replace(/\D/g, ''),
        goal: signup.querySelector('[name="goal"]')?.value || 'strength',
        role: signup.querySelector('[name="role"]')?.value || 'customer',
        hash: signup.querySelector('.pwd-wrap input[name="password"]') ? hashPassword(signup.querySelector('.pwd-wrap input[name="password"]').value) : ''
      });
      saveUsers(users);
      showToast('Account created! Taking you to log in…', 'ok');
      const btn = signup.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = '.7'; }
      setTimeout(() => { window.location.href = 'login.html'; }, 1400);
    });
  }

  if (login) {
    seedDemoAccounts();
    login.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(login)) return;
      const users = getUsers();
      const email = login.email.value.trim().toLowerCase();
      const role = login.querySelector('[name="role"]')?.value;
      const user = users.find(u => u.email.toLowerCase() === email);
      if (!user) { showFieldError(login.email, 'No account found with that email. Sign up first.'); return; }
      if (role && user.role !== role) {
        showToast(`This account uses the ${user.role === 'admin' ? 'Admin' : 'Member'} role — switch to it and try again.`, 'err');
        showFieldError(login.querySelector('.pwd-wrap input[name="password"]') || login.email, `Select the ${user.role === 'admin' ? 'Admin' : 'Member'} role to log in.`);
        return;
      }
      if (user.hash !== hashPassword(login.querySelector('.pwd-wrap input[name="password"]').value)) {
        showFieldError(login.querySelector('.pwd-wrap input[name="password"]'), 'Incorrect password. Try again.');
        return;
      }
      showToast(`Welcome back, ${user.name.split(' ')[0]}! Opening your ${user.role === 'admin' ? 'admin' : 'member'} dashboard…`, 'ok');
      const btn = login.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = '.75'; }
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, role: user.role, signedInAt: Date.now() })); } catch { }
      setTimeout(() => { window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html'; }, 1200);
    });
  }

  if (contact) {
    contact.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(contact)) return;
      showToast('Message sent! Our coaching team replies within 24 hours.', 'ok');
      contact.reset();
      $$('[data-select]', contact).forEach(w => {
        const placeholder = $('.select-trigger', w).dataset.placeholder || 'Select an option';
        $('.select-trigger .label', w).textContent = placeholder;
        w.classList.remove('has-value');
        $('input[type="hidden"]', w).value = '';
        $$('button', $('.select-menu', w)).forEach(b => b.setAttribute('aria-selected', 'false'));
      });
    });
  }

  $$('form[data-news]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(form)) return;
    showToast('You are in! Check your inbox for a welcome gift.', 'ok');
    form.reset();
  }));
}

/* ---------------- back / return ---------------- */
function currentPageFile() {
  return (location.pathname.split('/').pop() || 'index.html');
}
const returnStack = () => {
  try { return JSON.parse(sessionStorage.getItem('stackly-return') || '[]'); } catch { return []; }
};
function pushReturnPage(file) {
  if (file === 'login.html' || file === 'signup.html' || file === '404.html' || file === '404dash.html') return;
  const stack = returnStack();
  if (stack[stack.length - 1] !== file) { stack.push(file); try { sessionStorage.setItem('stackly-return', JSON.stringify(stack)); } catch { } }
}
function popReturnPage() {
  const stack = returnStack();
  const last = stack.pop();
  try { sessionStorage.setItem('stackly-return', JSON.stringify(stack)); } catch { }
  return last;
}
function goBackOr(fallback) {
  const last = popReturnPage();
  if (last && last !== currentPageFile()) { location.href = last; return; }
  if (history.length > 1) { history.back(); return; }
  location.href = fallback;
}
function setupGoBackButtons() {
  const dashErrFallback = currentPageFile() === '404dash.html' ? (dashboardForRole() || 'login.html') : 'index.html';
  $$('[data-go-back]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    goBackOr(btn.dataset.goBackTarget || dashErrFallback);
  }));
}
function trackReturns() {
  const file = currentPageFile();
  const dash = file.includes('dashboard');
  if (!dash) document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !['404.html', '404dash.html'].includes(href.split('?')[0])) pushReturnPage(href);
  }, true);
}

function dashboardForRole() {
  const session = readSession();
  if (session?.role === 'admin') return 'admin-dashboard.html';
  if (session?.role === 'customer') return 'customer-dashboard.html';
  return '';
}

/* ---------------- demo routing ---------------- */
/* Strict default: every button / CTA routes to the demo 404 pages; whitelisted controls
   and plain text links keep working. */
function isWhitelistedControl(el) {
  /* drawer / menu controls */
  if (el.closest('.menu-toggle, [data-drawer-close], [data-dash-burger], [data-dash-close]')) return true;
  /* form actions: submit / reset buttons run their own JS (contact, newsletter, login, signup, dashboards) */
  if (el.tagName === 'BUTTON' && el.closest('form')) {
    const t = (el.getAttribute('type') || 'submit').toLowerCase();
    if (t === 'submit' || t === 'reset') return true;
  }
  /* custom dropdown selects (part of forms) */
  if (el.closest('[data-select]')) return true;
  /* in-page widget controls that never navigate */
  if (el.closest('.filter-bar, .billing-toggle, .acc-btn, [data-modal-open], .modal-close, .toast-stack')) return true;
  /* explicit real destinations kept by request */
  if (el.classList.contains('header-login')) return true;               /* login button */
  if (el.classList.contains('skip-link')) return true;
  if (el.closest('.drawer-actions')) return true;                       /* drawer member log in */
  const col = el.closest('.footer-column');
  if (col && ($('h3', col)?.textContent || '').trim().toLowerCase() === 'explore') return true;
  if (el.closest('.dash-nav')) return true;                             /* dashboard sidebar links */
  return false;
}

function looksLikeCta(el) {
  if (el.tagName === 'BUTTON') return true;                /* any non-whitelisted button */
  /* anchors: styled CTAs, tagged demos, or footer-column links (footer excepts Explore) */
  return el.classList.contains('button') || el.hasAttribute('data-demo') || !!el.closest('.footer-column');
}

function setupStrictNav(target) {
  document.addEventListener('click', e => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = e.target.closest('a[href], button');
    if (!el || el.disabled) return;
    if (isWhitelistedControl(el)) return;
    if (!looksLikeCta(el)) return;
    e.preventDefault();
    pushReturnPage(currentPageFile());
    window.location.href = target;
  }, true);
}

function isDashPage(file) {
  return file.includes('dashboard') || file.startsWith('admin-') || file.startsWith('customer-');
}

function setupDemoRouting() {
  const file = currentPageFile();
  const publicSix = ['index.html', 'about.html', 'programs.html', 'trainers.html', 'pricing.html', 'contact.html'];
  if (publicSix.includes(file)) { setupStrictNav('404.html'); return; }
  if (isDashPage(file)) { setupStrictNav('404dash.html'); return; }
  /* remaining pages (auth previews, error screens): keep the light data-demo routing */
  const dashMode = isDashPage(file) || file.startsWith('404dash');
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-demo]');
    if (!el) return;
    e.preventDefault();
    const current = currentPageFile();
    pushReturnPage(current);
    window.location.href = dashMode ? '404dash.html' : '404.html';
  });
}

/* error-page utilities */
function setupErrorPage() {
  const fallback = page === 'errdash' || page === '404dash' ? (dashboardForRole() || 'login.html') : 'index.html';
  $$('[data-home-return]').forEach(btn => btn.addEventListener('click', () => { location.href = 'index.html'; }));
  $$('[data-dashboard-return]').forEach(btn => btn.addEventListener('click', () => { location.href = fallback; }));
}

/* ---------------- dashboard ---------------- */
const ADMIN_NAV = [
  ['Main', [
    ['Members', 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', 'admin-members.html'],
    ['Class Schedule', 'M12 8v4l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z', 'admin-schedule.html'],
    ['Payments & Plans', 'M2 7h20v12H2zM2 11h20M6 15h4', 'admin-payments.html']
  ]],
  ['Management', [
    ['Trainer Management', 'M3 21c0-4 4-7 9-7s9 3 9 7M3 21h18M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z', 'admin-trainers.html'],
    ['Equipment Status', 'M14.7 6.3a5 5 0 0 0-7.07 0l-1.35 1.35a5 5 0 0 0 0 7.07l1.35 1.35a5 5 0 0 0 7.07 0l1.35-1.35a5 5 0 0 0 0-7.07zM4 4l2.4 2.4M20 4l-2.4 2.4', 'admin-equipment.html'],
    ['Floor Check-ins', 'M12 2v4L8 8M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'admin-checkins.html'],
    ['Reports', 'M4 20V10M10 20V4M16 20v-8M22 20H2', 'admin-reports.html']
  ]]
];
const CUSTOMER_NAV = [
  ['Main', [
    ['My Plan', 'M4 20V10M10 20V4M16 20v-8M22 20H2', 'customer-plan.html'],
    ['Book Classes', 'M12 8v4l3 2M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z', 'customer-classes.html'],
    ['My Trainer', 'M3 21c0-4 4-7 9-7s9 3 9 7M3 21h18M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z', 'customer-trainer.html']
  ]],
  ['Health', [
    ['Nutrition', 'M12 8c-4 0-7 2.4-7 6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4c0-3.6-3-6-7-6zM12 8c0-2.5 1.5-4.5 4-5', 'customer-nutrition.html'],
    ['Progress Tracker', 'M3 17l5-6 4 3 5-8M16 3h4v4', 'customer-progress.html']
  ]],
  ['Account', [
    ['Payments & Invoices', 'M2 7h20v12H2zM2 11h20M6 15h4', 'customer-payments.html'],
    ['My Profile', 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'customer-profile.html']
  ]]
];

function navIcon(d) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
}

function renderDashboardChrome(session) {
  const shell = $('[data-dashboard]');
  if (!shell) return;
  const isAdmin = session.role === 'admin';
  const groups = isAdmin ? ADMIN_NAV : CUSTOMER_NAV;
  const file = currentPageFile();

  const sidebarSlot = $('[data-dash-sidebar]');
  if (sidebarSlot) {
    sidebarSlot.innerHTML = `
      <aside class="dash-sidebar" id="dash-sidebar" aria-label="Dashboard navigation">
        <div class="dash-top">
          <span class="brand" style="cursor:default">
            <img src="${LOGO}" alt="" width="40" height="40"><span>STACKLY<small>${isAdmin ? 'Admin Suite' : 'Member Suite'}</small></span></span>
          <button class="dash-close" type="button" data-dash-close aria-label="Close navigation">${ICON.close}</button>
        </div>
        <nav class="dash-nav">
          ${groups.map(([groupLabel, items]) =>
      `<div class="dash-nav-label">${groupLabel}</div>` + items.map(([label, icon, href]) =>
      `<a href="${href}"${file === href ? ' class="is-current" aria-current="page"' : ''}>${navIcon(icon)}${label}</a>`).join('')).join('')}
        </nav>
        <div class="dash-usercard">
          <span class="dash-usercard-avatar" aria-hidden="true">${(session.name || 'S').trim().charAt(0).toUpperCase()}</span>
          <span class="dash-usercard-meta">
            <b>${isAdmin ? 'Gym Admin' : 'Gold Member'}</b>
            <small>${session.email || '—'}</small>
          </span>
        </div>
        <div class="dash-foot">
          <form><button class="button button--dark dash-signout" type="submit" data-logout style="width:100%">${ICON.signOut} Log out</button></form>
        </div>
      </aside>`;
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'dash-backdrop';
  backdrop.setAttribute('data-dash-backdrop', '');
  shell.prepend(backdrop);
}

function setupDashboard() {
  const shell = $('[data-dashboard]');
  if (!shell) return;
  const session = readSession();
  if (!session || !session.role) { window.location.href = 'login.html'; return; }

  renderDashboardChrome(session);

  const burger = $('[data-dash-burger]');
  const drawer = $('#dash-sidebar');
  const backdrop = $('[data-dash-backdrop]');
  if (burger && drawer && backdrop) {
    const close = () => { drawer.classList.remove('is-open'); backdrop.classList.remove('is-open'); body.classList.remove('is-locked'); };
    const open = () => { drawer.classList.add('is-open'); backdrop.classList.add('is-open'); body.classList.add('is-locked'); };
    burger.addEventListener('click', open);
    $('[data-dash-close]', drawer)?.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    const desktopMQ = window.matchMedia('(min-width: 920px)');
    const onDesktopChange = e => { if (e.matches) close(); };
    if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onDesktopChange);
    else desktopMQ.addListener(onDesktopChange);
  }

  $$('[data-logout]').forEach(btn => btn.closest('form')?.addEventListener('submit', e => {
    e.preventDefault();
    try { sessionStorage.removeItem(SESSION_KEY); } catch { }
    showToast('Logged out. See you at the next session!', 'info');
    setTimeout(() => { window.location.href = 'login.html'; }, 800);
  }));

  /* dashboard widgets animate via boot()'s shared observers */
}

/* ---------------- billing toggle (pricing) ---------------- */
function setupBilling() {
  const toggle = $('.billing-toggle');
  if (!toggle) return;
  const buttons = $$('.billing-toggle button', toggle);
  const setMode = yearly => {
    toggle.classList.toggle('is-year', yearly);
    buttons.forEach(b => b.classList.toggle('is-active', (b.dataset.mode === 'year') === yearly));
    $$('[data-cost-monthly]').forEach(el => {
      el.textContent = yearly ? (el.dataset.costYearly || el.dataset.costMonthly) : el.dataset.costMonthly;
    });
    $$('[data-per-note]').forEach(el => { el.textContent = yearly ? ' /mo · billed yearly' : ' /mo'; });
  };
  buttons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode === 'year')));
}

/* modals */
function setupModals() {
  const openers = $$('[data-modal-open]');
  if (!openers.length) return;
  const modal = $('.modal');
  const backdrop = $('.modal-backdrop');
  if (!modal || !backdrop) return;
  const close = () => { modal.classList.remove('is-open'); backdrop.classList.remove('is-open'); body.classList.remove('is-locked'); };
  openers.forEach(opener => {
    opener.addEventListener('click', () => openModal(opener));
    if (opener.matches('[role="button"]')) opener.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(opener); }
    });
  });
  function camelCase(str) {
    return String(str).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }
  function openModal(opener) {
    const card = opener.closest('[data-modal-data]') || opener;
    $$('[data-slot]', modal).forEach(slot => {
      const key = camelCase(slot.dataset.slot);
      const val = card.dataset[key] || opener.dataset[key];
      if (val !== undefined && val !== null && val !== '') slot.textContent = val;
    });
    const src = card.dataset.img || opener.dataset.img;
    if (src) {
      const img = $('.modal-media img', modal);
      if (img) { img.src = src; img.alt = card.dataset.imgalt || opener.dataset.imgalt || 'Program photo'; }
    }
    modal.classList.add('is-open'); backdrop.classList.add('is-open'); body.classList.add('is-locked');
    $('.modal-close', modal)?.focus();
  }
  $('.modal-close', modal)?.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* Dashboard tables reflow into stacked cards on phones. Give every cell its
   column label and group its value so the card reads cleanly without
   horizontal scrolling. */
function setupResponsiveTables() {
  $$('.table').forEach(table => {
    const headers = [...table.querySelectorAll('thead th')];
    if (!headers.length) table.classList.add('table--kv');
    [...table.querySelectorAll('tbody td')].forEach(td => {
      if (headers.length) {
        const label = (headers[td.cellIndex]?.textContent || '').trim();
        if (label) td.setAttribute('data-label', label);
      }
      if (!td.querySelector(':scope > .td-value')) {
        const wrap = document.createElement('span');
        wrap.className = 'td-value';
        while (td.firstChild) wrap.appendChild(td.firstChild);
        td.appendChild(wrap);
      }
    });
  });
}

function boot() {
  renderPublicChrome();
  const dashShell = $('[data-dashboard]');
  const errPages = page === 'err' || page === 'errdash' || currentPageFile().startsWith('404');
  if (!dashShell && !errPages) {
    setupHeader();
    setupParallax();
    setupTaglineRotator();
  }
  if (errPages) {
    setupErrorPage();
  }
  if (dashShell) {
    setupDashboard();
    setupResponsiveTables();
  }
  setupCursorGlow();
  setupReveals();
  setupCounters();
  setupMeters();
  setupDropdowns();
  setupFilters();
  setupAccordion();
  setupPasswordToggles();
  setupRoleCards();
  setupForms();
  setupBilling();
  setupModals();
  setupGoBackButtons();
  setupDemoRouting();
  trackReturns();
  setupMagnetic();
}

document.addEventListener('DOMContentLoaded', boot);
