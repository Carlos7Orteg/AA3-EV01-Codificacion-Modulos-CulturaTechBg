const PAGE_KEY = (document.body && document.body.dataset && document.body.dataset.page) || '';
// ============================================================
// chrome.js — Utilidades comunes a todas las páginas:
// - withFocusPreserved: evita perder el cursor al re-pintar un
//   fragmento que contiene un input/textarea enfocado.
// - initChrome / refreshChrome: montan y refrescan Header, Footer,
//   Drawer, SearchModal y BottomNav, que son iguales en todas las
//   páginas (equivalente a que en el original estuvieran siempre
//   montados alrededor de "MainContent").
// ============================================================

function withFocusPreserved(renderFn) {
  const active = document.activeElement;
  const hasId = active && active.id;
  const selStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
  const selEnd = active && typeof active.selectionEnd === 'number' ? active.selectionEnd : null;

  renderFn();

  if (hasId) {
    const el = document.getElementById(active.id);
    if (el) {
      el.focus();
      if (selStart !== null && el.setSelectionRange) {
        try {
          el.setSelectionRange(selStart, selEnd);
        } catch (e) {
          // Algunos tipos de input (date, email) no soportan setSelectionRange en ciertos navegadores
        }
      }
    }
  }
}

function initChrome(headerProps = {}) {
  AppState.init();

  const headerRoot = document.getElementById('header-root');
  if (headerRoot) {
    if (!headerRoot.innerHTML.trim()) headerRoot.innerHTML = Header.render(headerProps);
    Header.mount(headerRoot);
  }

  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    if (!footerRoot.innerHTML.trim()) footerRoot.innerHTML = Footer.render();
    Footer.mount(footerRoot);
  }

  const drawerRoot = document.getElementById('drawer-root');
  if (drawerRoot) {
    if (!drawerRoot.innerHTML.trim()) drawerRoot.innerHTML = Drawer.render();
    Drawer.mount(drawerRoot);
  }

  const searchRoot = document.getElementById('search-modal-root');
  if (searchRoot) {
    if (!searchRoot.innerHTML.trim()) searchRoot.innerHTML = SearchModal.render();
    SearchModal.mount(searchRoot);
  }

  const bottomNavRoot = document.getElementById('bottom-nav-root');
  if (bottomNavRoot) {
    if (!bottomNavRoot.innerHTML.trim()) bottomNavRoot.innerHTML = BottomNav.render();
    BottomNav.mount(bottomNavRoot);
  }
}

// Vuelve a pintar Footer y BottomNav (insignias de favoritos/agenda/
// notificaciones) y la insignia del Header, sin recargar la página.
// Se llama después de cualquier acción que cambie favoritos, agenda
// o notificaciones desde la propia página.
function refreshChrome() {
  const headerRoot = document.getElementById('header-root');
  if (headerRoot) Header.refreshBadge(headerRoot);

  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    footerRoot.innerHTML = Footer.render();
    Footer.mount(footerRoot);
  }

  const bottomNavRoot = document.getElementById('bottom-nav-root');
  if (bottomNavRoot) {
    bottomNavRoot.innerHTML = BottomNav.render();
    BottomNav.mount(bottomNavRoot);
  }
}
