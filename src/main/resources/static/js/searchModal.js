// ============================================================
// searchModal.js — Traducción de src/components/SearchModal.tsx,
// adaptada a sitio multi-página. isSearchOpen y searchQuery pasan
// a ser estado local de la página (no tiene sentido persistirlos
// entre cargas de documento). El resultado navega con un enlace
// real a event-detail.html?id=...
// ============================================================

// Ejecuta la búsqueda de eventos según el texto ingresado por el usuario.
const SearchModal = {
  isOpen: false,
  query: '',
  _root: null,
  
  render() {
    if (!this.isOpen) return '';
    const q = this.query.toLowerCase().trim();
    const filteredEvents = AppState.events.filter(e => {
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.locality.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    });
    
    return `
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div class="bg-[#f9faf5] rounded-2xl w-full max-w-2xl shadow-2xl border border-[#c4c6cc]/40 overflow-hidden flex flex-col max-h-[80vh]">
          <div class="p-4 border-b border-[#c4c6cc]/30 flex items-center gap-3 bg-[#ffffff]">
            <span class="material-symbols-outlined text-[#0d1b2a] text-[24px]">search</span>
            <input id="search-modal-input" type="text" autofocus value="${escapeHtml(
              this.query
            )}" placeholder="Buscar eventos, categorías, lugares (ej: Jazz, MAMBO, Teatro)..."
              class="w-full bg-transparent border-none outline-none font-body text-base text-[#1a1c1a] placeholder:text-[#74777d]" />
            ${
              this.query
                ? `<button data-hook="search-clear-btn" class="text-[#74777d] hover:text-[#1a1c1a] p-1">
                    <span class="material-symbols-outlined text-[20px]">cancel</span>
                  </button>`
                : ''
            }
            
            <!-- Filtra los eventos para mostrar únicamente los resultados relacionados con la búsqueda.-->
            <button data-hook="search-close-btn" class="bg-[#e8e8e4] hover:bg-[#e2e3df] text-[#0d1b2a] font-label text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              Cerrar
            </button>
          </div>
       
          <div class="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
            <div class="flex items-center justify-between font-label text-xs text-[#44474c] px-1">
              <span>${this.query ? `Resultados para "${escapeHtml(this.query)}"` : 'Todos los eventos'}</span>
              <span>${filteredEvents.length} encontrados</span>
            </div>
        
            <!-- Dirige al usuario hacia el detalle del evento seleccionado. -->
            ${
              filteredEvents.length === 0
                ? `<div class="py-12 text-center flex flex-col items-center gap-2 text-[#74777d]">
                    <span class="material-symbols-outlined text-[48px]">search_off</span>
                    <p class="font-body text-sm font-medium text-[#1a1c1a]">No encontramos eventos con esa búsqueda.</p>
                    <p class="font-label text-xs">Intenta buscar términos como "Música", "Teatro", "Parque" o "Arte".</p>
                  </div>`
                : filteredEvents
                    .map(
                      event => `
                  <a href="/pages/event-detail.html?id=${encodeURIComponent(event.id)}" data-hook="search-result-item"
                    class="flex items-center gap-4 p-3 rounded-xl bg-[#ffffff] hover:bg-[#f3f4f0] border border-[#c4c6cc]/20 transition-all cursor-pointer group shadow-sm no-underline">
                    <img src="${event.imageUrl}" alt="${escapeHtml(event.title)}" class="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0" />
                    <div class="flex flex-col flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="bg-[#d6e4f9] text-[#0f1c2c] font-label text-[10px] font-semibold px-2 py-0.5 rounded">${event.category}</span>
                        <span class="font-label text-xs text-[#44474c] truncate">${event.date}</span>
                      </div>
                      <h4 class="font-display font-bold text-sm text-[#0d1b2a] group-hover:text-[#2d8aca] transition-colors truncate">${event.title}</h4>
                      <p class="font-body text-xs text-[#74777d] truncate">📍 ${event.location}</p>
                    </div>
                    <span class="material-symbols-outlined text-[#74777d] group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </a>
                `
                    )
                    .join('')
            }
          </div>
        </div>
      </div>
    `;
  },
  // Genera y muestra los resultados de búsqueda dentro del modal.
  mount(container) {
    this._root = container;
    if (!this.isOpen) return;

    const input = container.querySelector('#search-modal-input');
    if (input) {
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(len, len);
      input.addEventListener('input', e => {
        this.query = e.target.value;
        this.repaint({ preserveFocus: true });
      });
    }
    
    // Controla el cierre del modal de búsqueda.
    const clearBtn = container.querySelector('[data-hook="search-clear-btn"]');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.query = '';
        this.repaint({ preserveFocus: true });
      });
    }
    const closeBtn = container.querySelector('[data-hook="search-close-btn"]');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
  },

  repaint(opts = {}) {
    if (!this._root) return;
    if (opts.preserveFocus) {
      withFocusPreserved(() => {
        this._root.innerHTML = this.render();
        this.mount(this._root);
      });
    } else {
      this._root.innerHTML = this.render();
      this.mount(this._root);
    }
  },

  open() {
    this.isOpen = true;
    this.query = '';
    this.repaint();
  },

  close() {
    this.isOpen = false;
    this.repaint();
  }
};
