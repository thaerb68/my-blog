// posts.js — TOC, section indicator, related-posts injection, article-shell wrap
(function () {
  'use strict';

  // 1) Wrap <article> in a 3-column shell with TOC rail (CSS handles collapse on small viewports)
  const article = document.querySelector('article');
  if (!article) return;
  const container = article.parentNode;
  const shell = document.createElement('div');
  shell.className = 'article-shell';

  const tocAside = document.createElement('aside');
  tocAside.className = 'toc-rail';
  tocAside.innerHTML = '<div class="toc-label">In this essay</div><ol id="toc-list"></ol>';

  const right = document.createElement('aside');
  right.className = 'article-side-right';

  container.insertBefore(shell, article);
  shell.appendChild(tocAside);
  shell.appendChild(article);
  shell.appendChild(right);

  // 2) Auto-generate TOC from H2 headings
  const headings = article.querySelectorAll('h2');
  const tocList = document.getElementById('toc-list');
  const tocItems = [];
  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'sec-' + (h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || ('section-' + i));
    }
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.trim();
    li.appendChild(a);
    tocList.appendChild(li);
    tocItems.push({ h, a });
  });

  if (headings.length === 0) {
    tocAside.style.display = 'none';
  }

  // 3) Reading progress + section indicator
  let progressBar = document.getElementById('reading-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    document.body.prepend(progressBar);
  }
  const indicator = document.createElement('div');
  indicator.id = 'section-indicator';
  document.body.appendChild(indicator);

  function getCurrentSection() {
    const top = window.scrollY + 120;
    let current = null;
    for (const { h, a } of tocItems) {
      if (h.offsetTop <= top) current = { h, a };
      else break;
    }
    return current;
  }

  function onScroll() {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, pct)) + '%';

    const cur = getCurrentSection();
    tocItems.forEach(({ a }) => a.classList.remove('is-active'));
    if (cur) {
      cur.a.classList.add('is-active');
      indicator.textContent = cur.h.textContent.trim();
      if (window.scrollY > 400) indicator.classList.add('visible');
      else indicator.classList.remove('visible');
    } else {
      indicator.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
