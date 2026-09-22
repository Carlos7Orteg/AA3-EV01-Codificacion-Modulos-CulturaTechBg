// ============================================================
// bottomNav.js — Traducción de src/components/BottomNav.tsx,
// adaptada a sitio multi-página (usa PAGE_KEY y enlaces reales).
// ============================================================

const BottomNav = {
  render() {
    const currentView = typeof PAGE_KEY !== 'undefined' ? PAGE_KEY : '';

    if (['login', 'otp', 'register'].includes(currentView)) {
      return '';
    }

    const unreadCount = AppState.getUnreadNotificationsCount();
    const favCount = AppState.favorites.length;
    const agendaCount = AppState.agenda.length;

    const navItems = [
      { id: 'home', label: 'Inicio', icon: 'home', href: '/pages/home.html', active: currentView === 'home', badge: 0 },
      { id: 'events', label: 'Explorar', icon: 'explore', href: '/pages/events.html', active: currentView === 'events' || currentView === 'event-detail', badge: 0 },
      { id: 'agenda', label: 'Agenda', icon: 'calendar_today', href: '/pages/agenda.html', active: currentView === 'agenda', badge: agendaCount },
      { id: 'favorites', label: 'Favoritos', icon: 'favorite', href: '/pages/favorites.html', active: currentView === 'favorites', badge: favCount },
      { id: 'notifications', label: 'Avisos', icon: 'notifications', href: '/pages/notifications.html', active: currentView === 'notifications', badge: unreadCount },
      { id: 'scroll-top', label: 'Arriba', icon: 'arrow_upward', href: null, active: false, badge: 0 }
    ];

    return `
      <nav class="fixed bottom-0 left-0 right-0 z-50 bg-darkbl border-t border-white/10 shadow-[0px_-4px_16px_rgba(0,0,0,0.25)] px-1 py-1.5 md:hidden">
        <div class="flex justify-between items-center max-w-lg mx-auto">
          ${navItems
            .map(
              item => `
            <a ${item.href ? `href="${item.href}"` : ''} data-hook="bottom-nav-btn" data-id="${item.id}"
              class="relative flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-all cursor-pointer select-none no-underline ${
                item.active ? 'txt-brand font-bold scale-105' : 'txt-darkgr hover:text-white'
              }">
              <div class="relative flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${
                  item.active ? "'FILL' 1" : "'FILL' 0"
                }">${item.icon}</span>
                ${
                  item.badge > 0
                    ? `<span class="absolute -top-1 -right-2 bg-warning text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-[#0d1b2a]">${
                        item.badge > 9 ? '9+' : item.badge
                      }</span>`
                    : ''
                }
              </div>
              <span class="font-label text-[10px] mt-0.5 tracking-tight leading-none text-center">${item.label}</span>
            </a>
          `
            )
            .join('')}
        </div>
      </nav>
    `;
  },

  mount(container) {
    const currentView = typeof PAGE_KEY !== 'undefined' ? PAGE_KEY : '';
    
    container.querySelectorAll('[data-hook="bottom-nav-btn"]').forEach(btn => {
      const id = btn.getAttribute('data-id');
      
      // Botón "Arriba"
      if (id === 'scroll-top') {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        return;
      }

      // Determinar cuál botón corresponde a la página actual.
      const isActive =
        (id === 'home' && currentView === 'home') ||
        (id === 'events' && (currentView === 'events' || currentView === 'event-detail')) ||
        (id === 'agenda' && currentView === 'agenda') ||
        (id === 'favorites' && currentView === 'favorites') ||
        (id === 'notifications' && currentView === 'notifications');

      // Estado activo
      btn.classList.toggle('txt-brand', isActive);
      btn.classList.toggle('font-bold', isActive);
      btn.classList.toggle('scale-105', isActive);
  
      // Estado normal
      btn.classList.toggle('txt-darkgr', !isActive);
    });
  }
};
