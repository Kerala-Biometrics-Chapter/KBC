// Kerala Biometrics Chapter — site behaviour. Content lives in /data/*.json.
(async () => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = async f => { try { const r = await fetch(`data/${f}`, { cache: 'no-cache' }); return r.ok ? r.json() : null; } catch { return null; } };

  $('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = $('.nav__toggle'), menu = $('#menu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }));

  const [site, events, team, resources] = await Promise.all(
    ['site.json', 'events.json', 'team.json', 'resources.json'].map(load));

  // Links (forms, socials) from site.json
  if (site?.links) {
    $$('[data-link]').forEach(a => {
      const v = site.links[a.dataset.link];
      if (!v) return;
      a.href = /^(mailto:|https?:)/.test(v) ? v : (v.includes('@') ? `mailto:${v}` : v);
    });
  }

  // Events
  const list = $('#events-list');
  const fmt = d => new Date(d + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const render = filter => {
    const items = (events || [])
      .filter(e => filter === 'upcoming' ? fmt(e.date) >= today : fmt(e.date) < today)
      .sort((a, b) => filter === 'upcoming' ? fmt(a.date) - fmt(b.date) : fmt(b.date) - fmt(a.date));
    if (!items.length) {
      list.innerHTML = `<p class="muted">${filter === 'upcoming' ? 'New sessions are being planned — check back soon or join our community to be notified.' : 'No past events yet.'}</p>`;
      return;
    }
    list.innerHTML = items.map(e => {
      const d = fmt(e.date);
      const link = e.link ? `<a class="btn btn--sm" href="${esc(e.link)}" target="_blank" rel="noopener">${filter === 'upcoming' ? 'Register' : 'Recording'}</a>` : '';
      return `<article class="event">
        <div class="event__date"><b>${d.getDate()}</b><span>${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}</span></div>
        <div><span class="badge">${esc(e.type || 'Session')}</span><span class="badge">${esc(e.mode || 'Online')}</span>
          <h3>${esc(e.title)}</h3><p>${esc(e.speaker ? e.speaker + ' · ' : '')}${esc(e.description || '')}</p></div>
        ${link}</article>`;
    }).join('');
  };
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    render(b.dataset.filter);
  }));
  render('upcoming');

  // Team
  $('#team-list').innerHTML = (team || []).map(m => {
    const initials = m.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const av = m.photo ? `<img src="${esc(m.photo)}" alt="" loading="lazy">` : esc(initials);
    return `<article class="member"><div class="avatar">${av}</div><h3>${esc(m.name)}</h3>
      <p>${esc(m.role)}</p>${m.designation ? `<p>${esc(m.designation)}</p>` : ''}
      ${m.linkedin ? `<a href="${esc(m.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>` : ''}</article>`;
  }).join('');

  // Resources
  $('#resources-list').innerHTML = (resources || []).map(r =>
    `<a class="res" href="${esc(r.url)}" target="_blank" rel="noopener"><small>${esc(r.category)}</small><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p></a>`
  ).join('');

  // Reveal on scroll
  const io = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.card, .track, .event, .member, .res, .section h2').forEach(el => { if (io) { el.classList.add('reveal'); io.observe(el); } });
})();
