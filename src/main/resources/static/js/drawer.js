// ============================================================
// drawer.js — Traducción de src/components/Drawer.tsx, adaptada
// a sitio multi-página. isDrawerOpen ya no vive en AppState (no
// tiene sentido persistirlo entre cargas de página); es estado
// visual local de la página actual, igual que devNotice.
// ============================================================

// Inicializa el menú lateral y configura sus elementos de navegación.
const Drawer = {
  isOpen: false,
  devNotice: null,
  _noticeTimeout: null,
  _root: null,

  // Controla la apertura y el cierre del menú lateral mediante las acciones del usuario.
  render() {
    if (!this.isOpen) return '';

    const currentView = typeof PAGE_KEY !== 'undefined' ? PAGE_KEY : '';
    const user = AppState.user;

    const navItem = (href, view, icon, label) => `
      <a href="${href}" data-hook="drawer-nav"
        class="flex items-center gap-3 px-4 py-3 rounded-full text-left transition-colors font-medium cursor-pointer no-underline ${
          currentView === view ? 'bg-lightazl txt-darkbln' : 'txt-main hover-bg-crem'
        }">
        <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: ${
          currentView === view ? "'FILL' 1" : "'FILL' 0"
        }">${icon}</span>
        <span>${label}</span>
      </a>
    `;
    
    return `
      <div data-hook="drawer-backdrop" class="fixed inset-0 bg-black/60 z-[100] transition-opacity animate-fadeIn"></div>

      <aside class="fixed top-0 left-0 h-full max-h-[100dvh] w-[290px] max-w-[80vw] bg-cremlg shadow-2xl z-[100] flex flex-col border-r border-darkgr-40 animate-slideRight">
        <div class="p-4 flex items-center justify-between border-b border-darkgr-30 h-16 bg-lightsecn flex-shrink-0">
          ${renderLogo({ size: 'sm', showText: true, titleText: 'CulturaTech Bogotá' })}
          <button data-hook="drawer-close-btn" aria-label="Cerrar menú" class="p-2 rounded-full txt-primary hover-bg-subtle transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!--Configura las opciones del menú según el estado de autenticación y el rol del usuario.-->
        ${
          user
            ? `<div class="p-4 bg-crem border-b border-darkgr-20 flex items-center gap-3 flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-darkbln text-white flex items-center justify-center font-bold text-sm">
                  ${user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="font-display font-semibold text-sm txt-main truncate">${user.name} ${user.lastname}</span>
                  <span class="font-label text-xs txt-primary truncate">${user.email}</span>
                </div>
              </div>`
            : ''
        }

        <nav class="flex-1 overflow-y-auto py-4 px-3 pb-16 flex flex-col gap-1 font-body">
          ${navItem('/pages/home.html', 'home', 'home', 'Inicio')}
          ${navItem('/pages/events.html', 'events', 'event', 'Eventos')}
          ${navItem('/pages/favorites.html', 'favorites', 'bookmark', 'Favoritos')}
          ${navItem('/pages/agenda.html', 'agenda', 'calendar_today', 'Agenda personal')}
          ${navItem('/pages/notifications.html', 'notifications', 'notifications', 'Notificaciones')}

          <div class="my-2 border-t border-darkgr-30 mx-2"></div>
             
          <!-- Dirige al usuario autenticado hacia la configuración de su perfil.-->
          <a href="/pages/perfil.html" data-hook="drawer-nav"
            class="flex items-center gap-3 px-4 py-3 rounded-full text-left transition-colors font-medium cursor-pointer no-underline txt-main hover-bg-crem">
            <span class="material-symbols-outlined text-[22px]">manage_accounts</span>
            <span>Configuración de perfil</span>
          </a>

          <!-- Permite acceder al panel administrativo cuando el usuario tiene permisos de administrador.>-->
          ${
            user && String(user.rol || '').toUpperCase() === 'ADMIN'
              ? `<a href="/pages/admin.html" data-hook="drawer-nav"
                  class="flex items-center gap-3 px-4 py-3 rounded-full text-left transition-colors font-medium cursor-pointer no-underline txt-main hover-bg-crem">
                  <span class="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                  <span>Panel administrativo</span>
                </a>`
              : ''
          }

          <button data-hook="drawer-notice" data-feature="Ajustes"
            class="w-full flex items-center justify-between px-4 py-3 rounded-full txt-primary hover-bg-crem hover-txt-darkbl font-medium transition-colors cursor-pointer text-left">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[22px]">settings</span>
              <span>Ajustes</span>
            </div>
            <span class="font-label text-[10px] bg-soft txt-primary px-2 py-0.5 rounded-md">Próximamente</span>
          </button>

          ${
            this.devNotice
              ? `<div class="mx-2 my-2 p-3 bg-darkbl text-white text-xs font-body rounded-xl animate-fadeIn text-center shadow-lg">${this.devNotice}</div>`
              : ''
          }

          <div class="pt-4 mt-2">
            <button data-hook="drawer-logout-btn"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full border br-danger text-danger hover-bg-alert-40 transition-colors font-medium cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">logout</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>
    `;
  },

  // Cierra el menú lateral después de seleccionar una opción de navegación.
  mount(container) {
    this._root = container;
    if (!this.isOpen) return;

    const backdrop = container.querySelector('[data-hook="drawer-backdrop"]');
    if (backdrop) backdrop.addEventListener('click', () => this.close());

    const closeBtn = container.querySelector('[data-hook="drawer-close-btn"]');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    container.querySelectorAll('[data-hook="drawer-notice"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const feature = btn.getAttribute('data-feature');
        this.devNotice = `La sección "${feature}" estará disponible en la siguiente versión.`;
        if (this._noticeTimeout) clearTimeout(this._noticeTimeout);
        this._noticeTimeout = setTimeout(() => {
          this.devNotice = null;
          this.repaint();
        }, 3000);
        this.repaint();
      });
    });

    const logoutBtn = container.querySelector('[data-hook="drawer-logout-btn"]');
    if (logoutBtn) logoutBtn.addEventListener('click', () => AppState.logout());
  },

  repaint() {
    if (!this._root) return;
    this._root.innerHTML = this.render();
    this.mount(this._root);
  },

  open() {
    this.isOpen = true;
    this.repaint();
  },

  close() {
    this.isOpen = false;
    this.repaint();
  }
};
