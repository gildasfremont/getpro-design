// Single source of truth for navbar + footer.
// Each page exposes empty placeholder elements: <header data-nav></header>, <footer data-footer></footer>.
(() => {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Pages "services-*" qui font partie du regroupement Services dans la navbar.
  // Axe 1 (Chasse de dirigeants) = 3 practices : tech, produit, sales.
  // Axe 2 = renfort. Axe 3 = transition.
  const SERVICES_PAGES = [
    'services-tech.html', 'services-produit.html', 'services-sales.html',
    'services-renfort.html', 'services-transition.html',
    // Pages orphelines conservées (accessibles via URL directe ou footer)
    'services-clevel.html', 'services-outils.html', 'services-profils.html',
  ];

  // Mapping page → sous-item Services à mettre en aria-current.
  // Les 3 practices remontent à "Chasse de dirigeants" (services-tech).
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
        <div class="menu-item-group" data-services-group>
          <a href="services-tech.html" class="menu-item menu-item--has-submenu"${aria('#services')} aria-haspopup="true" aria-expanded="false">
            Services
            <span class="menu-caret" aria-hidden="true"></span>
          </a>
          <ul class="submenu" role="menu" aria-label="Services">
            <li role="none"><a role="menuitem" href="services-tech.html"${aria('services-tech.html')}>Chasse de dirigeants</a></li>
            <li role="none"><a role="menuitem" href="services-renfort.html"${aria('services-renfort.html')}>Renfort en recrutement</a></li>
            <li role="none"><a role="menuitem" href="services-transition.html"${aria('services-transition.html')}>Temps partagé &amp; transition</a></li>
          </ul>
        </div>
        <a href="clients.html" class="menu-item"${aria('clients.html')}>Clients</a>
        <a href="equipe.html" class="menu-item"${aria('equipe.html')}>Consultants</a>
        <a href="contact.html" class="btn-menu"${aria('contact.html')}>Contact</a>
      </div>
    </nav>
  `;

  const footerHTML = `
    <nav class="foot-featured" aria-label="Services principaux">
      <a href="services-tech.html"${aria('services-tech.html')}>Chasse de dirigeants</a>
      <a href="services-renfort.html"${aria('services-renfort.html')}>Renfort en recrutement</a>
      <a href="services-transition.html"${aria('services-transition.html')}>Temps partagé &amp; transition</a>
    </nav>
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="index.html" class="foot-logo" aria-label="GetPro"></a>
        <p class="foot-tagline">Cabinet de chasse spécialisé tech, product, data, sales et dirigeants. Depuis 2015.</p>
        <p class="foot-address">41 rue Faidherbe<br>75011 Paris</p>
      </div>
      <div class="foot-col">
        <a href="services-tech.html"${aria('services-tech.html')}>Chasse Tech</a>
        <a href="services-produit.html"${aria('services-produit.html')}>Chasse Produit</a>
        <a href="services-sales.html"${aria('services-sales.html')}>Chasse Sales &amp; Support</a>
        <a href="services-renfort.html"${aria('services-renfort.html')}>Renfort en recrutement</a>
        <a href="services-transition.html"${aria('services-transition.html')}>Temps partagé &amp; transition</a>
      </div>
      <div class="foot-col">
        <a href="services-profils.html"${aria('services-profils.html')}>Métiers recrutés</a>
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
      // Dropdown Services : ouvre/ferme au clic sur le parent (desktop +
      // mobile). Le hover est géré en CSS. aria-expanded change l'état.
      const servicesParent = nav.querySelector('[data-services-group] .menu-item--has-submenu');
      if (servicesParent) {
        servicesParent.addEventListener('click', (e) => {
          // Sur desktop, on garde le comportement de lien (clic = aller sur
          // services-tech.html). Sur petit écran sans hover, on intercepte le
          // 1er clic pour révéler le sous-menu. window.matchMedia détecte
          // l'absence de hover (touch).
          const isTouch = window.matchMedia('(hover: none)').matches;
          if (!isTouch) return;
          const open = servicesParent.getAttribute('aria-expanded') === 'true';
          if (!open) {
            e.preventDefault();
            servicesParent.setAttribute('aria-expanded', 'true');
          }
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
