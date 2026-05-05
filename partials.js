// Single source of truth for navbar + footer.
// Each page exposes empty placeholder elements: <header data-nav></header>, <footer data-footer></footer>.
(() => {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const isCurrent = (href) => {
    if (path === href) return true;
    // path#hash matching for deep-links (footer links vers offres précises)
    if (href.includes('#')) {
      const [p, h] = href.split('#');
      if (path === p && location.hash === '#' + h) return true;
    }
    // Solutions sub-pages share the "Solutions de recrutement" navbar item
    if (href === 'solutions.html' && (path === 'solutions-profils.html' || path === 'solutions-renfort.html')) return true;
    return false;
  };

  const aria = (href) => isCurrent(href) ? ' aria-current="page"' : '';

  const navHTML = `
    <nav class="menu">
      <a href="index.html" class="brand" aria-label="GetPro"></a>
      <div class="menu-right">
        <a href="solutions.html" class="menu-item"${aria('solutions.html')}>
          <span class="menu-label-full">Solutions de recrutement</span>
          <span class="menu-label-short">Solutions</span>
        </a>
        <a href="clients.html" class="menu-item"${aria('clients.html')}>Clients</a>
        <a href="equipe.html" class="menu-item"${aria('equipe.html')}>Consultants</a>
        <a href="mailto:bonjour@getpro.com" class="btn-menu">Contact</a>
      </div>
    </nav>
  `;

  const footerHTML = `
    <nav class="foot-featured" aria-label="Solutions principales">
      <a href="solutions.html#cdi"${aria('solutions.html#cdi')}>Recrutement salarié</a>
      <a href="solutions.html#freelance"${aria('solutions.html#freelance')}>Freelance</a>
      <a href="solutions-renfort.html#drh"${aria('solutions-renfort.html#drh')}>RH de transition</a>
    </nav>
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="index.html" class="foot-logo" aria-label="GetPro"></a>
        <p class="foot-tagline">Cabinet de chasse spécialisé tech, product, data, sales et dirigeants. Depuis 2015.</p>
        <p class="foot-address">41 rue Faidherbe<br>75011 Paris</p>
      </div>
      <div class="foot-col">
        <a href="solutions.html#cdi"${aria('solutions.html#cdi')}>Recrutement CDI</a>
        <a href="solutions.html#freelance"${aria('solutions.html#freelance')}>Freelance</a>
        <a href="solutions-renfort.html#drh"${aria('solutions-renfort.html#drh')}>DRH de transition</a>
        <a href="solutions-renfort.html#rpo"${aria('solutions-renfort.html#rpo')}>RPO</a>
        <a href="solutions-renfort.html#outils"${aria('solutions-renfort.html#outils')}>Outils &amp; ATS</a>
      </div>
      <div class="foot-col">
        <a href="solutions-profils.html"${aria('solutions-profils.html')}>Métiers recrutés</a>
        <a href="methode.html"${aria('methode.html')}>Méthode GetPro</a>
        <a href="clients.html"${aria('clients.html')}>Clients</a>
        <a href="equipe.html"${aria('equipe.html')}>Équipe</a>
        <a href="mentions.html"${aria('mentions.html')}>Mentions légales</a>
      </div>
      <div class="foot-col foot-contact">
        <a href="mailto:bonjour@getpro.com">bonjour@getpro.com</a>
        <a href="tel:+33939289329">09 39 28 93 29</a>
        <div class="rating">
          <img src="assets/google.svg" alt="Google" class="rating-logo" />
          <span class="rating-stars">4,3 ★★★★★</span>
        </div>
      </div>
    </div>
  `;

  const inject = () => {
    const nav = document.querySelector('[data-nav]');
    if (nav) nav.innerHTML = navHTML;
    const foot = document.querySelector('[data-footer]');
    if (foot) foot.innerHTML = footerHTML;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
