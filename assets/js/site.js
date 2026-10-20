(() => {
  'use strict';
  const page = document.body.dataset.page;
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('open', !expanded);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
  document.querySelector(`[data-nav="${page}"]`)?.classList.add('active');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const linkOK = href => typeof href === 'string' && (/^https:\/\/[^\s]+$/i.test(href) || /^(?!\.{1,2}\/)(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[\w./%#?=&-]+$/i.test(href));
  const cleanHref = href => linkOK(href) ? href : '';
  const getJSON = async path => {
    const response = await fetch(path, {cache:'no-cache'});
    if (!response.ok) throw new Error(`Could not load ${path}`);
    return await response.json();
  };
  const isAvailable = l => Boolean(cleanHref(l.notes) || cleanHref(l.notes_filled) || cleanHref(l.slides) || cleanHref(l.video));
  const resourceLinks = l => {
    const fields = [['notes','Student notes ↗'],['notes_filled','Filled notes / key ↗'],['slides','Slides ↗'],['video','Watch video ↗']];
    const links = fields.filter(([key]) => cleanHref(l[key])).map(([key,label]) => {
      const href = cleanHref(l[key]);
      const external = /^https:\/\//i.test(href);
      return `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
    });
    return links.length ? links.join('') : '<span class="lecture-unavailable">Notes and links will be added here.</span>';
  };
  const setupLectures = async () => {
    const list = document.getElementById('lecture-list');
    if (!list && !document.getElementById('home-spotlight')) return;
    let lectures;
    try {
      lectures = await getJSON('data/lectures.json');
      if (!Array.isArray(lectures)) throw new Error('Lecture data must be an array');
      lectures = lectures.filter(l => l && Number.isFinite(Number(l.number)) && l.title).sort((a,b) => Number(a.number) - Number(b.number));
    } catch (err) {
      if(list) list.innerHTML='<div class="empty-state">The lecture catalog could not be loaded. Please refresh the page or check data/lectures.json.</div>';
      const spot = document.getElementById('home-spotlight');
      if(spot) spot.innerHTML='<p>Lecture links are temporarily unavailable. Try the lecture library again shortly.</p>';
      console.error(err);
      return;
    }
    const count = document.getElementById('lecture-count');
    if (count) count.textContent = lectures.length;
    const search = document.getElementById('lecture-search');
    const filter = document.getElementById('lecture-filter');
    const result = document.getElementById('lecture-results');
    if(list && search && filter && result) {
      const topics = [...new Set(lectures.map(l => l.topic || 'Other'))].sort();
      topics.forEach(topic => { const option=document.createElement('option'); option.value=topic; option.textContent=topic; filter.append(option); });
      const render = () => {
        const q = search.value.toLowerCase().trim();
        const filtered = lectures.filter(l => (filter.value === 'all' || (l.topic || 'Other') === filter.value) && [l.number,l.title,l.topic,l.summary].join(' ').toLowerCase().includes(q));
        result.textContent = `Showing ${filtered.length} of ${lectures.length} lecture${lectures.length === 1 ? '' : 's'}`;
        list.innerHTML = filtered.length ? filtered.map(l => `<article class="lecture-card">
          <div class="lecture-card-top"><span class="lecture-ordinal">LECTURE ${String(l.number).padStart(2,'0')} · ${esc(l.topic || 'Other').toUpperCase()}</span><span class="lecture-status ${isAvailable(l) ? 'available' : ''}">${isAvailable(l) ? 'Resources available' : 'Coming soon'}</span></div>
          <h3>${esc(l.title)}</h3><p>${esc(l.summary || '')}</p><div class="lecture-links">${resourceLinks(l)}</div>
          </article>`).join('') : '<div class="empty-state">No lectures matched your search. Try another keyword or clear the filters.</div>';
      };
      search.addEventListener('input', render);
      filter.addEventListener('change', render);
      document.getElementById('reset-filters')?.addEventListener('click',() => {search.value='';filter.value='all';render();search.focus();});
      render();
    }
    const spotlight = document.getElementById('home-spotlight');
    if (spotlight) {
      const published = lectures.filter(isAvailable);
      const item = published.length ? published[published.length - 1] : lectures[lectures.length - 1];
      const availableCount = published.length;
      const quick = document.getElementById('quick-materials');
      if (quick) quick.textContent = availableCount ? `${availableCount} lecture${availableCount === 1 ? '' : 's'} with resources` : 'Lecture links added regularly';
      spotlight.innerHTML = item ? `<div class="spotlight-top"><span class="spotlight-tag">${published.length ? 'LATEST AVAILABLE MATERIAL' : 'LECTURE PREVIEW'}</span><span class="spotlight-number">${String(item.number).padStart(2,'0')}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.summary || '')}</p><div class="spotlight-footer"><span class="${isAvailable(item) ? '' : 'planned'}">${isAvailable(item) ? 'Notes or recordings available' : 'MATERIALS COMING SOON'}</span><a href="lectures.html">View lectures →</a></div>` : '<h3>Lecture index</h3><p>Lecture materials will appear here as they are added.</p><a class="text-link" href="lectures.html">Open lectures →</a>';
    }
  };
  const setupRoadmap = async () => {
    const list = document.getElementById('roadmap-list');
    if(!list) return;
    try {
      const weeks = await getJSON('data/roadmap.json');
      list.innerHTML = weeks.map(w => `<article class="roadmap-item"><div class="roadmap-week"><small>WEEK</small><strong>${esc(String(w.week).padStart(2,'0'))}</strong></div><div class="roadmap-body"><span class="date">WEEK OF ${esc(w.date).toUpperCase()}</span><h3>${esc(w.title)}</h3><p>${esc(w.description)}</p></div></article>`).join('');
    } catch(err) {list.innerHTML='<p>The roadmap is temporarily unavailable.</p>';console.error(err);}
  };
  const setupSite = async () => {
    const btn = document.getElementById('playlist-button');
    if (!btn) return;
    try {
      const cfg=await getJSON('data/site.json');
      if (cleanHref(cfg.youtube_playlist)) {
        btn.href=cfg.youtube_playlist;
        btn.classList.remove('is-hidden');
        document.getElementById('playlist-pending')?.classList.add('is-hidden');
      }
    } catch(err) {console.error(err);}
  };
  Promise.all([setupLectures(),setupRoadmap(),setupSite()]);
})();
