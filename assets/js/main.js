/* Dawat Halal Meals: small, dependency-free interactions */
(() => {
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => '$' + n.toFixed(2);
  const BASE = 'https://dawathalalmeals.com/product/';

  /* Catalogue: prices and product pages from the live store */
  const PLANS = {
    thali: {
      name: 'Thali',
      weekly:  { veg: [49.99,  'weekly-subscription-veg-thali'],  nonveg: [54.99,  'weekly-subscription-non-veg-thali'] },
      monthly: { veg: [199.99, 'monthly-subscription-veg-thali'], nonveg: [219.99, 'monthly-subscription-non-veg-thali'] }
    },
    regular: {
      name: 'Regular',
      weekly:  { veg: [64.99,  'weekly-subscription-veg-meal-regular-size-12-oz-curry'],  nonveg: [69.99,  'weekly-subscription-non-veg-meal-regular-size-12-oz-curry'] },
      monthly: { veg: [249.99, 'monthly-subscription-veg-meal-regular-size-12-oz-curry'], nonveg: [279.99, 'monthly-subscription-non-veg-meal-regular-size-12-oz-curry'] }
    },
    large: {
      name: 'Large',
      weekly:  { veg: [74.99,  'weekly-subscription-veg-meal-large-size-16-oz-curry'],  nonveg: [79.99,  'weekly-subscription-non-veg-meal-large-size-16-oz-curry'] },
      monthly: { veg: [289.99, 'monthly-subscription-veg-meal-large-size-16-oz-curry'], nonveg: [319.99, 'monthly-subscription-non-veg-meal-large-size-16-oz-curry'] }
    }
  };
  const MEALS = { weekly: 5, monthly: 20 };

  /* ---------- Nav ---------- */
  const nav = $('.nav');
  const burger = $('.burger');
  const drawer = $('#drawer');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { nav.classList.toggle('is-scrolled', scrollY > 8); ticking = false; });
  }, { passive: true });
  const setDrawer = open => { burger.setAttribute('aria-expanded', open); drawer.hidden = !open; };
  burger.addEventListener('click', () => setDrawer(drawer.hidden));
  drawer.addEventListener('click', e => { if (e.target.closest('a')) setDrawer(false); });

  /* ---------- Segmented controls ---------- */
  const segValue = seg => $('[aria-pressed="true"]', seg).dataset.val;
  const bindSeg = (seg, onChange) => seg.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.getAttribute('aria-pressed') === 'true') return;
    $$('button', seg).forEach(x => x.setAttribute('aria-pressed', x === b));
    onChange(b.dataset.val);
  });

  /* ---------- Plan cards ---------- */
  const state = { freq: 'weekly', diet: 'nonveg' };
  const renderPlans = animate => {
    $$('.plan').forEach(card => {
      const plan = PLANS[card.dataset.plan];
      const [price, slug] = plan[state.freq][state.diet];
      const num = $('[data-price]', card);
      num.textContent = price.toFixed(2);
      if (animate) { num.classList.remove('flash'); void num.offsetWidth; num.classList.add('flash'); }
      $('[data-per]', card).textContent = state.freq === 'weekly' ? '/ week' : '/ 4 weeks';
      $('[data-permeal]', card).textContent = money(price / MEALS[state.freq]);
      $('[data-order]', card).href = BASE + slug + '/';
      const save = $('[data-save]', card);
      const diff = plan.weekly[state.diet][0] * 4 - plan.monthly[state.diet][0];
      save.hidden = !(state.freq === 'monthly' && diff >= 1);
      save.textContent = 'Save ' + money(diff);
    });
  };
  $$('.controls .seg').forEach(seg => bindSeg(seg, v => { state[seg.dataset.seg] = v; renderPlans(true); }));
  renderPlans(false);

  /* ---------- Builder ---------- */
  const builder = $('#builder');
  const extras = { rice: 0, curry12: 0, curry16: 0, roti: 0 };
  const radio = name => $(`input[name="${name}"]:checked`, builder);

  const renderBuilder = () => {
    const planKey = radio('b-plan').value;
    const freq = radio('b-freq').value;
    const variant = radio('b-variant');
    const diet = variant.value === 'veggie' ? 'veg' : 'nonveg';
    const days = MEALS[freq];
    const [base, slug] = PLANS[planKey][freq][diet];
    const perDay = parseFloat(radio('b-drop').value)
      + extras.rice * 1.99 + extras.curry12 * 5.99 + extras.curry16 * 7.99 + extras.roti * 0.99;
    const add = perDay * days;
    const total = base + add;

    $('[data-s-title]').textContent = `${PLANS[planKey].name} · ${freq === 'weekly' ? 'Weekly' : 'Monthly'}`;
    $('[data-s-sub]').textContent = `${variant.nextElementSibling.firstChild.textContent.trim()} · ${days} meals, Mon–Fri`;
    $('[data-s-base]').textContent = money(base);
    $('[data-s-extras-row]').hidden = add === 0;
    $('[data-s-extras]').textContent = '+' + money(add);
    $('[data-s-total]').textContent = money(total);
    $('[data-s-permeal]').textContent = money(total / days);
    $('[data-s-renew]').textContent = freq === 'weekly' ? 'every 7 days' : 'every 28 days';
    $('[data-s-order]').href = BASE + slug + '/';
  };
  builder.addEventListener('change', e => {
    if (e.target.matches('[data-extra="rice"]')) extras.rice = e.target.checked ? 1 : 0;
    renderBuilder();
  });
  $$('.stepper', builder).forEach(st => st.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const k = st.dataset.extra;
    extras[k] = Math.max(0, Math.min(9, extras[k] + +b.dataset.step));
    $('output', st).textContent = extras[k];
    renderBuilder();
  }));

  // "Customize" on a plan card jumps to the builder with that card's choices
  $$('[data-customize]').forEach(btn => btn.addEventListener('click', () => {
    const plan = btn.closest('.plan').dataset.plan;
    $(`input[name="b-plan"][value="${plan}"]`).checked = true;
    $(`input[name="b-freq"][value="${state.freq}"]`).checked = true;
    const v = $('input[name="b-variant"]:checked').value;
    if (state.diet === 'veg') $('input[name="b-variant"][value="veggie"]').checked = true;
    else if (v === 'veggie') $('input[name="b-variant"][value="chicken"]').checked = true;
    renderBuilder();
    builder.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  renderBuilder();

  /* ---------- Trial ---------- */
  const trial = { meal: 0, days: 2 };
  const renderTrial = () => {
    const rate = 15 + trial.meal;
    $('[data-t-rate]').textContent = `$${rate} / day × ${trial.days} ${trial.days > 1 ? 'days' : 'day'}`;
    $('[data-t-total]').textContent = money(rate * trial.days);
  };
  $$('[data-trial]').forEach(seg => {
    const key = seg.dataset.trial;
    bindSeg(seg, v => { if (key !== 'variant') trial[key] = +v; renderTrial(); });
    if (key !== 'variant') trial[key] = +segValue(seg);
  });
  renderTrial();

  /* ---------- Menu: highlight today ---------- */
  const table = $('.menu__table');
  const start = new Date(table.dataset.weekStart + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const offset = Math.round((today - start) / 864e5); // 0 = Monday
  const rows = $$('.menu__row[data-day]', table);
  const row = offset >= 0 && offset < 5 ? rows[offset] : null;
  if (row) row.classList.add('is-today');
  const dish = $('[data-today-dish]');
  if (dish) {
    dish.textContent = (row || rows[0]).children[1].textContent;
    if (!row) dish.previousElementSibling.textContent = 'On the menu';
  }

  /* ---------- Poster dialog (image loads only when opened) ---------- */
  const poster = $('#poster');
  $('[data-open-poster]').addEventListener('click', () => {
    const img = $('img', poster);
    if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
    poster.showModal();
  });
  $('[data-close-poster]').addEventListener('click', () => poster.close());
  poster.addEventListener('click', e => { if (e.target === poster) poster.close(); });

  /* ---------- Reveal on scroll ---------- */
  const els = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });
  } else els.forEach(el => el.classList.add('in'));

  const y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();
})();
