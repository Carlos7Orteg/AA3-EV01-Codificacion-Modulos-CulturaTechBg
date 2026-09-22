// ============================================================
// footer.js — Traducción de src/components/Footer.tsx, adaptada
// a sitio multi-página (usa PAGE_KEY y enlaces reales en vez de
// AppState.currentView y AppState.navigateWithHistory).
// ============================================================

const Footer = {
    // Genera la estructura visual del pie de página según la vista actual.
  render() {
    const currentView = typeof PAGE_KEY !== 'undefined' ? PAGE_KEY : '';
    const unreadCount = AppState.getUnreadNotificationsCount();
    const favCount = AppState.favorites.length;
    const agendaCount = AppState.agenda.length;

    const desktopNavItems = [
      { id: 'home', label: 'Inicio', icon: 'home', href: '/pages/home.html', active: currentView === 'home', badge: 0 },
      { id: 'events', label: 'Explorar', icon: 'explore', href: '/pages/events.html', active: currentView === 'events' || currentView === 'event-detail', badge: 0 },
      { id: 'agenda', label: 'Mi Agenda', icon: 'calendar_today', href: '/pages/agenda.html', active: currentView === 'agenda', badge: agendaCount },
      { id: 'favorites', label: 'Favoritos', icon: 'favorite', href: '/pages/favorites.html', active: currentView === 'favorites', badge: favCount },
      { id: 'notifications', label: 'Avisos', icon: 'notifications', href: '/pages/notifications.html', active: currentView === 'notifications', badge: unreadCount }
    ];

    const tabletNavItems = [
      { id: 'home', label: 'Inicio', icon: 'home', href: '/pages/home.html', active: currentView === 'home', badge: 0 },
      { id: 'events', label: 'Explorar', icon: 'explore', href: '/pages/events.html', active: currentView === 'events' || currentView === 'event-detail', badge: 0 },
      { id: 'agenda', label: 'Agenda', icon: 'calendar_today', href: '/pages/agenda.html', active: currentView === 'agenda', badge: agendaCount },
      { id: 'favorites', label: 'Favoritos', icon: 'favorite', href: '/pages/favorites.html', active: currentView === 'favorites', badge: favCount },
      { id: 'scrollTop', label: '', icon: 'arrow_upward', href: null, active: false, badge: 0 },
      { id: 'notifications', label: 'Avisos', icon: 'notifications', href: '/pages/notifications.html', active: currentView === 'notifications', badge: unreadCount }
    ];
    
    // Genera un elemento de navegación del pie de página para dispositivos de tamaño tablet.
    const renderTabletBtn = item => `
      <a ${item.href ? `href="${item.href}"` : ''} data-hook="footer-tablet-nav" data-id="${item.id}" title="${item.id === 'scrollTop' ? 'Volver arriba' : item.label}"
        class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer select-none font-label min-w-0 no-underline ${
          item.active ? 'bg-body text-white font-bold shadow-sm' : 'txt-darkgr hover:text-white hover:bg-white/10'
        }">
        ${item.badge > 0 ? `<span class="absolute top-1 right-2 px-1.5 py-0.2 bg-warning text-white text-[9px] font-bold rounded-full leading-none z-10">${item.badge}</span>` : ''}
        <span class="material-symbols-outlined text-[18px]">${item.icon}</span>
        ${item.label ? `<span class="text-[10px] tracking-tight leading-tight mt-0.5 text-center truncate max-w-full">${item.label}</span>` : ''}
      </a>
    `;
        
    // Genera un elemento de navegación del pie de página para dispositivos de escritorio.
    const renderDesktopBtn = item => `
      <a href="${item.href}" data-hook="footer-desktop-nav" data-id="${item.id}" title="${item.label}"
        class="relative flex items-center justify-start gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer select-none text-xs font-label no-underline ${
          item.active ? 'bg-body text-white font-bold shadow-sm' : 'txt-darkgr hover:text-white hover:bg-white/10'
        }">
        <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
        <span class="inline">${item.label}</span>
        ${item.badge > 0 ? `<span class="ml-0.5 px-1.5 py-0.2 bg-warning text-white text-[10px] font-bold rounded-full">${item.badge}</span>` : ''}
      </a>
    `;

    return `
      <footer class="w-full bg-darkbl txt-cremlg mt-auto relative overflow-hidden pb-20 md:pb-0">
        <div class="absolute top-0 right-1/4 w-96 h-96 bg-accent-10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="block md:hidden bg-darkblp border-t border-white/10 px-6 py-8 relative z-10">
          <div class="flex flex-col items-center gap-4 text-center">
            ${renderLogo({ size: 'md', variant: 'dark', titleText: 'CulturaTech Bogotá', showText: true })}
            <div class="flex items-center justify-center gap-4 font-label text-xs txt-darkgr mt-1">
              <a href="#terminos" data-hook="footer-noop-link" class="hover:text-white transition-colors">Términos</a>
              <span class="opacity-30">•</span>
              <a href="#privacidad" data-hook="footer-noop-link" class="hover:text-white transition-colors">Privacidad</a>
              <span class="opacity-30">•</span>
              <a href="#contacto" data-hook="footer-noop-link" class="hover:text-white transition-colors">Soporte</a>
            </div>
            <p class="font-label text-xs txt-darkgr-80 mt-1">© 2026 CulturaTech Bogotá. Todos los derechos reservados.</p>
          </div>
        </div>

        <div class="hidden md:block py-10 px-6 lg:px-10 border-t border-darkgr-20 relative z-10 max-w-[1280px] mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6">
            <div class="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
              ${renderLogo({ size: 'sm', variant: 'dark', titleText: 'CulturaTech Bogotá', showText: true })}
              <p class="font-label text-xs txt-darkgr max-w-xs lg:max-w-md mt-1">Conectando el arte, el patrimonio y la agenda cultural de la capital.</p>
            </div>

            <div class="hidden md:grid lg:hidden grid-cols-3 gap-2 bg-default p-2.5 rounded-2xl border border-white/10 shadow-lg w-full max-w-[420px]">
              ${tabletNavItems.map(renderTabletBtn).join('')}
            </div>

            <div class="hidden lg:flex lg:items-center lg:gap-2 bg-default p-2 rounded-2xl border border-white/10 shadow-lg">
              ${desktopNavItems.map(renderDesktopBtn).join('')}
            </div>

            <div class="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
              <div class="flex items-center justify-center md:justify-end gap-3 font-label text-xs txt-darkgr">
                <a href="#terminos" data-hook="footer-noop-link" class="hover:text-white transition-colors">Términos</a>
                <span class="opacity-30">•</span>
                <a href="#privacidad" data-hook="footer-noop-link" class="hover:text-white transition-colors">Privacidad</a>
                <span class="opacity-30">•</span>
                <a href="#contacto" data-hook="footer-noop-link" class="hover:text-white transition-colors">Soporte</a>
              </div>
              <p class="font-label text-[11px] txt-darkgr-70
              ">© 2026 CulturaTech Bogotá. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  },
  // Configura las acciones y el estado visual de los elementos del pie de página.
  mount(container) {
    // Evita la navegación de los enlaces informativos que aún no tienen una página asociada.
    container.querySelectorAll('[data-hook="footer-noop-link"]').forEach(a => {
      a.addEventListener('click', e => e.preventDefault());
    });
    
    const currentView = typeof PAGE_KEY !== 'undefined' ? PAGE_KEY : '';
    
    // Configura la navegación inferior para dispositivos de tamaño tablet.
    container.querySelectorAll('[data-hook="footer-tablet-nav"]').forEach(btn => {
      const id = btn.getAttribute('data-id');
      
      if (id === 'scrollTop') {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        return;
      }
      
      const isActive =
      (id === 'home' && currentView === 'home') ||
      (id === 'events' && (currentView === 'events' || currentView === 'event-detail')) ||
      (id === 'agenda' && currentView === 'agenda') ||
      (id === 'favorites' && currentView === 'favorites') ||
      (id === 'notifications' && currentView === 'notifications');
      
      btn.classList.toggle('bg-body', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('font-bold', isActive);
      btn.classList.toggle('shadow-sm', isActive);

      btn.classList.toggle('txt-darkgr', !isActive);
    });
    // Configura la navegación del pie de página para dispositivos de escritorio.
    container.querySelectorAll('[data-hook="footer-desktop-nav"]').forEach(btn => {
      const id = btn.getAttribute('data-id');

      const isActive =
        (id === 'home' && currentView === 'home') ||
        (id === 'events' && (currentView === 'events' || currentView === 'event-detail')) ||
        (id === 'agenda' && currentView === 'agenda') ||
        (id === 'favorites' && currentView === 'favorites') ||
        (id === 'notifications' && currentView === 'notifications');
  
      btn.classList.toggle('bg-body', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('font-bold', isActive);
      btn.classList.toggle('shadow-sm', isActive);
  
      btn.classList.toggle('txt-darkgr', !isActive);
    });
  }
};
