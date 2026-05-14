// Single source of truth for navbar + footer.
// Each page exposes empty placeholder elements: <header data-nav></header>, <footer data-footer></footer>.
(() => {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Pages "services-*" qui font partie du regroupement Services dans la navbar.
  // Axe 1 (Recrutements ponctuels) = 3 practices : tech, produit, sales.
  // Axe 2 = renfort. Axe 3 = transition.
  const SERVICES_PAGES = [
    'services-tech.html', 'services-produit.html', 'services-sales.html',
    'services-renfort.html', 'services-transition.html',
    // Pages orphelines conservées (accessibles via URL directe ou footer)
    'services-clevel.html', 'services-outils.html', 'services-profils.html',
  ];

  // Mapping page → sous-item Services à mettre en aria-current.
  // Les 3 practices remontent à "Recrutements ponctuels" (services-tech).
  const SERVICES_GROUP = {
    'services-tech.html': 'services-tech.html',
    'services-produit.html': 'services-tech.html',
    'services-sales.html': 'services-tech.html',
    'services-clevel.html': 'services-tech.html',
    'services-renfort.html': 'services-renfort.html',
    'services-transition.html': 'services-transition.html',
  };

  const isCurrent = (href) => {
    if (path === href) return true;
    if (href.includes('#')) {
      const [p, h] = href.split('#');
      if (path === p && location.hash === '#' + h) return true;
    }
    // Le lien parent "Services" reste actif sur toutes les pages détaillées.
    if (href === '#services' && SERVICES_PAGES.includes(path)) return true;
    // Sous-items du dropdown : actif sur leur page et leurs satellites.
    if (SERVICES_GROUP[path] === href) return true;
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
        <a href="services-tech.html" class="menu-item"${aria('#services')}>Services</a>
        <a href="clients.html" class="menu-item"${aria('clients.html')}>Clients</a>
        <a href="equipe.html" class="menu-item"${aria('equipe.html')}>Équipe</a>
        <a href="contact.html" class="btn-menu"${aria('contact.html')}>Contact</a>
      </div>
    </nav>
  `;

  const footerHTML = `
    <nav class="foot-featured" aria-label="Services principaux">
      <a href="services-tech.html"${aria('services-tech.html')}>Recrutements ponctuels</a>
      <a href="services-renfort.html"${aria('services-renfort.html')}>Renfort en recrutement (RPO)</a>
      <a href="services-transition.html"${aria('services-transition.html')}>Temps partagés &amp; Transition</a>
    </nav>
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="index.html" class="foot-logo" aria-label="GetPro"></a>
        <p class="foot-tagline">Cabinet de chasse spécialisé tech, product, data, sales et dirigeants. Depuis 2015.</p>
        <p class="foot-address">41 rue Faidherbe<br>75011 Paris</p>
      </div>
      <div class="foot-col">
        <a href="services-tech.html"${aria('services-tech.html')}>Chasse Tech</a>
        <a href="services-produit.html"${aria('services-produit.html')}>Chasse Product &amp; Projects</a>
        <a href="services-sales.html"${aria('services-sales.html')}>Chasse Customer &amp; Admin</a>
        <a href="services-renfort.html"${aria('services-renfort.html')}>Renfort en recrutement (RPO)</a>
        <a href="services-transition.html"${aria('services-transition.html')}>Temps partagés &amp; Transition</a>
      </div>
      <div class="foot-col">
        <a href="services-profils.html"${aria('services-profils.html')}>+2000 recrutements</a>
        <a href="methode.html"${aria('methode.html')}>Méthode GetPro</a>
        <a href="clients.html"${aria('clients.html')}>Clients</a>
        <a href="equipe.html"${aria('equipe.html')}>Consultants</a>
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

    // Bouton flottant "remonter en haut de la page" injecté sur toutes
    // les pages. Visible à partir d'un certain scroll.
    if (!document.querySelector('.scroll-top-btn')) {
      const scrollTopBtn = document.createElement('button');
      scrollTopBtn.className = 'scroll-top-btn';
      scrollTopBtn.type = 'button';
      scrollTopBtn.setAttribute('aria-label', 'Remonter en haut de la page');
      scrollTopBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
      document.body.appendChild(scrollTopBtn);
      const updateVisibility = () => {
        scrollTopBtn.classList.toggle('is-visible', window.scrollY > 400);
      };
      window.addEventListener('scroll', updateVisibility, { passive: true });
      updateVisibility();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
