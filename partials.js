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

  // CDI & Freelance regroupe 4 practices : hover sur desktop révèle un
  // sous-menu inline ; sur mobile c'est le hamburger qui montre tout.
  const navHTML = `
    <nav class="menu">
      <a href="index.html" class="brand" aria-label="GetPro"></a>
      <div class="menu-right" id="menu-right">
        <div class="menu-item-group menu-item-group--cdi">
          <a href="services-tech.html" class="menu-item menu-item--inline"${aria('services-tech.html')}>CDI &amp; Freelance</a>
          <div class="submenu submenu--inline" id="cdi-submenu">
            <div class="submenu-eyebrow">Practices</div>
            <ul class="submenu-list submenu-list--row">
              <li><a href="services-tech.html"${aria('services-tech.html')}>Tech, IA &amp; Data</a></li>
              <li><a href="services-produit.html"${aria('services-produit.html')}>Product &amp; Projects</a></li>
              <li><a href="services-sales.html"${aria('services-sales.html')}>Customer &amp; Admin</a></li>
              <li class="submenu-list-spacer"><a href="services-profils.html"${aria('services-profils.html')}>+2000 recrutements</a></li>
            </ul>
          </div>
        </div>
        <a href="services-renfort.html" class="menu-item menu-item--inline"${aria('services-renfort.html')}>RPO</a>
        <a href="services-transition.html" class="menu-item menu-item--inline"${aria('services-transition.html')}>Management de transition</a>
        <div class="menu-item-group menu-item--collapsed">
          <button class="menu-item menu-item--has-submenu" type="button" aria-expanded="false" aria-controls="solutions-submenu"${SERVICES_PAGES.includes(path) ? ' aria-current="page"' : ''}>
            <span class="trigger-long">Solutions de recrutement</span>
            <span class="trigger-short">Solutions</span>
            <svg class="menu-chevron" viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2.5 4.5L6 8l3.5-3.5"/>
            </svg>
          </button>
          <div class="submenu" id="solutions-submenu">
            <ul class="submenu-list submenu-list--mobile">
              <li><a href="services-tech.html"${aria('services-tech.html')}>CDI &amp; Freelance</a></li>
              <li><a href="services-renfort.html"${aria('services-renfort.html')}>RPO</a></li>
              <li><a href="services-transition.html"${aria('services-transition.html')}>Management de transition</a></li>
              <li><a href="clients.html"${aria('clients.html')}>Clients</a></li>
              <li><a href="equipe.html"${aria('equipe.html')}>Équipe</a></li>
              <li><a href="articles.html"${aria('articles.html')}>Articles</a></li>
              <li class="submenu-contact"><a href="contact.html"${aria('contact.html')}>Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="menu-item-group menu-item-group--more">
          <button class="menu-item menu-item--more" type="button" aria-expanded="false" aria-controls="more-submenu" aria-label="Plus de pages">
            <svg viewBox="0 0 18 14" width="20" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
              <path d="M1 2h16M1 7h16M1 12h16"/>
            </svg>
          </button>
          <div class="submenu" id="more-submenu">
            <ul class="submenu-list submenu-list--row">
              <li><a href="clients.html"${aria('clients.html')}>Clients</a></li>
              <li><a href="equipe.html"${aria('equipe.html')}>Équipe</a></li>
              <li><a href="articles.html"${aria('articles.html')}>Articles</a></li>
            </ul>
          </div>
        </div>
        <a href="contact.html" class="menu-item menu-item--contact menu-item--contact-outside"${aria('contact.html')}>Contact</a>
      </div>
    </nav>
  `;

  const footerHTML = `
    <nav class="foot-featured" aria-label="Services principaux">
      <a href="services-tech.html"${aria('services-tech.html')}>CDI &amp; Freelance</a>
      <a href="services-renfort.html"${aria('services-renfort.html')}>RPO</a>
      <a href="services-transition.html"${aria('services-transition.html')}>Management de transition</a>
      <a href="clients.html"${aria('clients.html')}>Clients</a>
      <a href="equipe.html"${aria('equipe.html')}>Équipe</a>
      <a href="articles.html"${aria('articles.html')}>Articles</a>
    </nav>
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="index.html" class="foot-logo" aria-label="GetPro"></a>
        <p class="foot-tagline">Cabinet de chasse spécialisé experts et dirigeants pour la Tech et l'IA. Depuis 2015.</p>
        <div class="foot-info-row">
          <div class="foot-address-row">
            <p class="foot-line foot-street">41 rue Faidherbe</p>
            <p class="foot-line foot-city">75011 Paris</p>
            <a class="foot-line foot-email" href="mailto:bonjour@getpro.com">bonjour@getpro.com</a>
            <a class="foot-line foot-phone" href="tel:+33939289329">09&nbsp;39&nbsp;28&nbsp;93&nbsp;29</a>
          </div>
          <div class="ratings-stack">
            <div class="rating">
              <img src="assets/google.svg" alt="Google" class="rating-logo" />
              <span class="rating-stars">4,3 ★★★★★</span>
            </div>
            <div class="rating">
              <img src="assets/trustpilot.svg" alt="Trustpilot" class="rating-logo" />
              <span class="rating-stars">5 ★★★★★</span>
            </div>
            <div class="rating">
              <img src="assets/trustfolio.svg" alt="Trustfolio" class="rating-logo" />
              <span class="rating-stars">4,9 ★★★★★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-legal">
      <a href="mentions.html"${aria('mentions.html')}>Mentions légales</a>
    </div>
  `;

  const inject = () => {
    const nav = document.querySelector('[data-nav]');
    if (nav) {
      nav.innerHTML = navHTML;
      // Hamburger toggle (visible sous 480px). aria-expanded change l'état,
      // le CSS utilise [aria-expanded="true"] pour révéler .menu-right.
      // Dropdown "Solutions de recrutement" : toggle aria-expanded au clic
      // (le hover/focus suffit sur souris, le clic est nécessaire en touch).
      // Mega-menus sur HOVER (et focus clavier). Deux triggers :
      //   1. .menu-item-group--cdi : hover sur "CDI & Freelance" (desktop)
      //   2. .menu-item-group (hamburger collapsé) : hover sur le bouton
      //      "Menu" (apparait sous 700px)
      // Le submenu est position:absolute donc visuellement hors du bounding
      // box du group : on écoute mouseenter/leave SUR LE LIEN ET SUR LE
      // SUBMENU séparément, avec un petit délai pour pouvoir traverser le
      // gap. Le menu se ferme quand on quitte les deux (vers une autre
      // option de la nav, ou par le bas du volet).
      const submenuGroups = nav.querySelectorAll('.menu-item-group--cdi, .menu-item-group--more, .menu-item-group.menu-item--collapsed');
      submenuGroups.forEach(group => {
        const btn = group.querySelector('.menu-item--has-submenu');
        const trigger = group.querySelector('.menu-item');
        const submenu = group.querySelector('.submenu');
        let closeTimer = null;
        const setOpen = (open) => {
          if (btn) btn.setAttribute('aria-expanded', String(open));
          group.classList.toggle('is-open', open);
          document.body.classList.toggle('menu-open', open);
        };
        const cancelClose = () => {
          if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        };
        const scheduleClose = () => {
          cancelClose();
          closeTimer = setTimeout(() => setOpen(false), 140);
        };
        [trigger, submenu].filter(Boolean).forEach(el => {
          el.addEventListener('mouseenter', () => { cancelClose(); setOpen(true); });
          el.addEventListener('mouseleave', scheduleClose);
        });
        group.addEventListener('focusin', () => { cancelClose(); setOpen(true); });
        group.addEventListener('focusout', (e) => {
          if (!group.contains(e.relatedTarget)) scheduleClose();
        });
      });

      // Position des submenus via --trigger-left :
      //   - submenu CDI : alignée pile sous le lien "CDI & Freelance"
      //   - hamburger (more) : alignée pile sous l'icône hamburger
      //   - submenu Solutions mobile : aligné sur le bord gauche du logo
      const brand = nav.querySelector('.brand');
      const cdiGroup = nav.querySelector('.menu-item-group--cdi');
      const cdiLink = cdiGroup?.querySelector('.menu-item--inline');
      const cdiSubmenu = cdiGroup?.querySelector('.submenu');
      const moreGroup = nav.querySelector('.menu-item-group--more');
      const moreTrigger = moreGroup?.querySelector('.menu-item--more');
      const moreSubmenu = moreGroup?.querySelector('.submenu');
      const mobileSubmenus = nav.querySelectorAll('.menu-item-group:not(.menu-item-group--cdi):not(.menu-item-group--more) .submenu');
      const syncSubmenu = () => {
        const headerEl = document.querySelector('.header');
        if (!headerEl) return;
        const headerRect = headerEl.getBoundingClientRect();
        if (brand && mobileSubmenus.length) {
          const brandRect = brand.getBoundingClientRect();
          const triggerLeft = (brandRect.left - headerRect.left) + 'px';
          mobileSubmenus.forEach(s => s.style.setProperty('--trigger-left', triggerLeft));
        }
        if (cdiLink && cdiSubmenu) {
          const linkRect = cdiLink.getBoundingClientRect();
          cdiSubmenu.style.setProperty('--trigger-left', (linkRect.left - headerRect.left) + 'px');
        }
        if (moreTrigger && moreSubmenu) {
          const triggerRect = moreTrigger.getBoundingClientRect();
          moreSubmenu.style.setProperty('--trigger-left', (triggerRect.left - headerRect.left) + 'px');
        }
      };
      syncSubmenu();
      // Re-sync après chargement des polices (la nav peut shifter quand
      // ABC Diatype prend le relais sur la fallback system).
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncSubmenu);
      window.addEventListener('load', syncSubmenu);
      window.addEventListener('resize', syncSubmenu);

      // Hauteurs sticky reportées en CSS vars : header (--header-h),
      // subtabs-row (--subtabs-h), categories-bar (--cats-h). Permet aux
      // éléments en dessous de se caler précisément dans la stack.
      const header = document.querySelector('.header');
      const subtabsRow = document.querySelector('.subtabs-row');
      const catsBar = document.querySelector('.categories-bar');
      const syncStickyHeights = () => {
        if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
        if (subtabsRow) document.documentElement.style.setProperty('--subtabs-h', subtabsRow.offsetHeight + 'px');
        if (catsBar) document.documentElement.style.setProperty('--cats-h', catsBar.offsetHeight + 'px');
      };
      syncStickyHeights();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncStickyHeights);
      window.addEventListener('load', syncStickyHeights);
      window.addEventListener('resize', syncStickyHeights);

      // Affordance de scroll horizontal sur les .subtabs (et autres listes
      // scrollables marquées) : on bascule is-overflow-left/right selon
      // la position de scroll pour que le mask fade apparaisse uniquement
      // si le contenu déborde réellement.
      const updateOverflowState = (el) => {
        const max = el.scrollWidth - el.clientWidth;
        const x = el.scrollLeft;
        el.classList.toggle('is-overflow-left', x > 1);
        el.classList.toggle('is-overflow-right', x < max - 1);
      };
      document.querySelectorAll('.subtabs-row .subtabs').forEach((el) => {
        updateOverflowState(el);
        el.addEventListener('scroll', () => updateOverflowState(el), { passive: true });
        window.addEventListener('resize', () => updateOverflowState(el));
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => updateOverflowState(el));
      });

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
