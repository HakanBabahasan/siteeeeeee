// Küçük etkileşim: URL hash ile basit scroll, mobil menü ve reveal
document.addEventListener('DOMContentLoaded', ()=>{
  const hash = location.hash;
  if(hash){
    const el = document.querySelector(hash);
    if(el) el.scrollIntoView({behavior:'smooth'});
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && reveals.length){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r=>obs.observe(r));
  } else {
    reveals.forEach(r=>r.classList.add('visible'));
  }

  // Search / filter in post list
  const search = document.getElementById('search-input');
  const posts = Array.from(document.querySelectorAll('.post-item'));
  if(search){
    search.addEventListener('input', ()=>{
      const q = search.value.trim().toLowerCase();
      posts.forEach(p=>{
        const title = (p.querySelector('h3')||{textContent:''}).textContent.toLowerCase();
        const excerpt = (p.querySelector('p')||{textContent:''}).textContent.toLowerCase();
        const tags = (p.dataset.tags||'').toLowerCase();
        const match = !q || title.includes(q) || excerpt.includes(q) || tags.includes(q);
        p.style.display = match ? '' : 'none';
      });
    });
  }

  // Tag filter buttons
  const tagButtons = document.querySelectorAll('.tag-filter');
  tagButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const tag = btn.textContent.trim().toLowerCase();
      // toggle simple active state
      const active = btn.classList.toggle('active');
      // if active, filter to that tag, otherwise clear filter
      posts.forEach(p=>{
        const tags = (p.dataset.tags||'').toLowerCase();
        const match = !active || tags.split(',').map(t=>t.trim()).includes(tag);
        p.style.display = match ? '' : 'none';
      });
    });
  });

  // Populate recent posts sidebar (basic)
  const recent = document.getElementById('recent-posts');
  if(recent){
    recent.innerHTML = '';
    posts.forEach(p=>{
      const a = p.querySelector('a');
      const title = (p.querySelector('h3')||{textContent:''}).textContent;
      if(a && title){
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = title;
        li.appendChild(link);
        recent.appendChild(li);
      }
    });
  }
});
