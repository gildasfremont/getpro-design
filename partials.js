// Single source of truth for navbar + footer.
// Each page exposes empty placeholder elements: <header data-nav></header>, <footer data-footer></footer>.
(() => {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Toutes les pages "solutions-*" partagent le même item de navbar.
  const SOLUTIONS_PAGES = [
    'solutions-cdi.html', 'solutions-freelance.html', 'solutions-clevel.html',
    'solutions-rpo.html', 'solutions-drh.html', 'solutions-outils.html',
    'solutions-profils.html',
  ];

  const isCurrent = (href) => {
    if (path === href) return true;
    if (href.includes('#')) {
      const [p, h] = href.split('#');
      if (path === p && location.hash === '#' + h) return true;
    }
    // Le lien navbar "Solutions de recrutement" reste actif sur toutes les
    // pages détaillées (solutions-cdi, solutions-rpo, solutions-profils, etc.)
    if (href === 'solutions-cdi.html' && SOLUTIONS_PAGES.includes(path)) return true;
    return false;
  };

  const aria = (href) => isCurrent(href) ? ' aria-current="page"' : '';

  const navHTML = `
    <nav class="menu">
      <a href="index.html" class="brand" aria-label="GetPro"></a>
      <button class="menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu-right">
        <span class="menu-toggle-bars" aria-hidden="true"></span>
      </button>
      <div class="menu-right" id="menu-right">
        <a href="solutions-cdi.html" class="menu-item"${aria('solutions-cdi.html')}>
          <span class="menu-label-full">Solutions de recrutement</span>
          <span class="menu-label-short">Solutions</span>
        </a>
        <a href="clients.html" class="menu-item"${aria('clients.html')}>Clients</a>
        <a href="equipe.html" class="menu-item"${aria('equipe.html')}>Équipe</a>
        <a href="contact.html" class="btn-menu"${aria('contact.html')}>Contact</a>
      </div>
    </nav>
  `;

  const footerHTML = `
    <nav class="foot-featured" aria-label="Solutions principales">
      <a href="solutions-cdi.html"${aria('solutions-cdi.html')}>Recrutement salarié</a>
      <a href="solutions-freelance.html"${aria('solutions-freelance.html')}>Freelance</a>
      <a href="solutions-drh.html"${aria('solutions-drh.html')}>RH de transition</a>
    </nav>
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="index.html" class="foot-logo" aria-label="GetPro"></a>
        <p class="foot-tagline">Cabinet de chasse spécialisé tech, product, data, sales et dirigeants. Depuis 2015.</p>
        <p class="foot-address">41 rue Faidherbe<br>75011 Paris</p>
      </div>
      <div class="foot-col">
        <a href="solutions-cdi.html"${aria('solutions-cdi.html')}>Recrutement CDI</a>
        <a href="solutions-freelance.html"${aria('solutions-freelance.html')}>Freelance</a>
        <a href="solutions-clevel.html"${aria('solutions-clevel.html')}>C-Level</a>
        <a href="solutions-rpo.html"${aria('solutions-rpo.html')}>RPO</a>
        <a href="solutions-drh.html"${aria('solutions-drh.html')}>DRH de transition</a>
        <a href="solutions-outils.html"${aria('solutions-outils.html')}>Outils &amp; ATS</a>
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
    if (nav) {
      nav.innerHTML = navHTML;
      // Hamburger toggle (visible sous 480px). aria-expanded change l'état,
      // le CSS utilise [aria-expanded="true"] pour révéler .menu-right.
      const toggle = nav.querySelector('.menu-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => {
          const open = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', String(!open));
          toggle.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
        });
        // Ferme le menu au clic sur un lien (utile pour les ancres internes).
        nav.querySelectorAll('.menu-right a').forEach(a => {
          a.addEventListener('click', () => {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Ouvrir le menu');
          });
        });
      }
    }
    const foot = document.querySelector('[data-footer]');
    if (foot) foot.innerHTML = footerHTML;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
