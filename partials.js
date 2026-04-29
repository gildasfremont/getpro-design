// Single source of truth for navbar + footer.
// Each page exposes empty placeholder elements: <header data-nav></header>, <footer data-footer></footer>.
(() => {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const isCurrent = (href) => {
    if (path === href) return true;
    // Solutions sub-pages share the "Solutions de recrutement" navbar item
    if (href === 'solutions.html' && (path === 'solutions-profils.html' || path === 'solutions-renfort.html')) return true;
    return false;
  };

  const aria = (href) => isCurrent(href) ? ' aria-current="page"' : '';

  const navHTML = `
    <nav class="menu">
      <a href="index.html" class="brand" aria-label="GetPro"></a>
      <div class="menu-right">
        <a href="solutions.html" class="menu-item"${aria('solutions.html')}>Solutions<span class="menu-long"> de recrutement</span></a>
        <a href="clients.html" class="menu-item"${aria('clients.html')}>Clients</a>
        <a href="#" class="btn-menu">Contact</a>
      </div>
    </nav>
  `;

  const footerHTML = `
    <div class="foot-col">
      <h3>Équipe</h3>
      <a href="equipe.html"${aria('equipe.html')}>Consultants</a>
      <a href="equipe.html">Support</a>
    </div>
    <div class="foot-col">
      <h3>Contact</h3>
      <a href="#">Nous contacter</a>
      <a href="mentions.html"${aria('mentions.html')}>Mentions légales</a>
    </div>
    <div class="foot-col">
      <h3>Ressources</h3>
      <a href="#">Blog</a>
      <a href="#">Cas</a>
    </div>
    <div class="foot-col">
      <h3>GetPro</h3>
      <a href="solutions.html">Solutions de recrutement</a>
      <a href="clients.html">Clients</a>
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
