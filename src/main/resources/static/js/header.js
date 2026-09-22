// ============================================================
// header.js — Traducción de src/components/Header.tsx, adaptada
// a sitio multi-página: usa la variable global PAGE_KEY (definida
// en cada página) en vez de AppState.currentView, y navega con
// enlaces reales en vez de cambiar de vista en memoria.
// ============================================================

const Header = {
  // Genera la estructura visual del encabezado según las propiedades recibidas.
  render(props = {}) {
    const { showBack = false, title = 'Cultura Bogotá', backHref = null } = props;
    const unreadCount = AppState.getUnreadNotificationsCount();
    const isNotifActive = typeof PAGE_KEY !== 'undefined' && PAGE_KEY === 'notifications';

    return `
      <header class="w-full top-0 sticky z-40 bg-cremlg shadow-sm border-b border-darkgr-30 h-16 transition-colors duration-200">
        <div class="flex items-center justify-between px-4 md:px-10 h-full w-full max-w-[1280px] mx-auto">
          ${
            showBack
              ? `<button aria-label="Regresar" data-hook="header-back-btn" data-href="${backHref || ''}" class="p-2 -ml-2 rounded-full txt-main hover-bg-subtle transition-colors flex items-center justify-center cursor-pointer">
                  <span class="material-symbols-outlined text-[24px]">arrow_back</span>
                </button>`
              : `<button aria-label="Abrir menú" data-hook="header-menu-btn" class="p-2 -ml-2 rounded-full txt-darkbl hover-bg-subtle transition-colors flex items-center justify-center cursor-pointer">
                  <span class="material-symbols-outlined text-[24px]">menu</span>
                </button>`
          }

          <a href="/pages/home.html" data-hook="header-brand" class="flex items-center gap-2 cursor-pointer select-none no-underline">
            ${
              title === 'Cultura Bogotá'
                ? renderLogo({ size: 'sm', showText: true })
                : `<div class="flex items-center gap-2">
                    ${renderLogo({ size: 'sm', showText: false })}
                    <span class="font-display text-[18px] md:text-[20px] font-bold txt-darkbl tracking-tight">${title}</span>
                  </div>`
            }
          </a>

          <div class="flex items-center gap-1">
            <button aria-label="Buscar eventos" data-hook="header-search-btn" class="p-2 rounded-full txt-darkbl hover-bg-subtle transition-colors flex items-center justify-center cursor-pointer">
              <span class="material-symbols-outlined text-[22px]">search</span>
            </button>

            <a href="/pages/notifications.html" aria-label="Notificaciones" data-hook="header-notif-btn" class="p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer relative no-underline ${
              isNotifActive ? 'bg-lightazl txt-darkbln' : 'txt-darkbl hover-bg-subtle'
            }">
              <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: ${
                isNotifActive ? "'FILL' 1" : "'FILL' 0"
              }">notifications</span>
              ${
                unreadCount > 0
                  ? `<span data-hook="header-notif-badge" class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>`
                  : ''
              }
            </a>
          </div>
        </div>
      </header>
    `;
  },
  // Configura las acciones de los botones del encabezado.
  mount(container) {
    // Configura el botón de regreso, cuando está disponible.
    const backBtn = container.querySelector('[data-hook="header-back-btn"]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        const href = backBtn.getAttribute('data-href');
        if (href) window.location.href = href;
        else window.history.back();
      });
    }
    // Configura el botón para abrir el menú lateral.
    const menuBtn = container.querySelector('[data-hook="header-menu-btn"]');
    if (menuBtn) menuBtn.addEventListener('click', () => Drawer.open());
    // Configura el botón para abrir la búsqueda de eventos.
    const searchBtn = container.querySelector('[data-hook="header-search-btn"]');
    if (searchBtn) searchBtn.addEventListener('click', () => SearchModal.open());
  },

  // Vuelve a pintar solo la insignia de notificaciones sin leer
  // (usado tras marcar notificaciones como leídas desde otra página del chrome)
  refreshBadge(container) {
    const badge = container.querySelector('[data-hook="header-notif-badge"]');
    const unreadCount = AppState.getUnreadNotificationsCount();
    if (unreadCount > 0 && !badge) {
      const notifBtn = container.querySelector('[data-hook="header-notif-btn"]');
      if (notifBtn) {
        const span = document.createElement('span');
        span.setAttribute('data-hook', 'header-notif-badge');
        span.className = 'absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white';
        notifBtn.appendChild(span);
      }
    } else if (unreadCount === 0 && badge) {
      badge.remove();
    }
  }
};
