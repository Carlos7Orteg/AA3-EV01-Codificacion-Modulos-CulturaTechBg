// ============================================================
// pages/events.js — Lógica de events.html
// Traducción de src/views/EventsView.tsx a página HTML real.
// selectedCategory pasa a ser local a esta página (ver nota en
// pages/home.js sobre el mismo cambio inevitable).
// ============================================================

const EventsPage = {
  categories: ['Todo', 'Música', 'Teatro', 'Arte', 'Cine', 'Danza'],
  dateOptions: ['Próximos eventos', 'Hoy', 'Próximos 7 días', 'Este mes', 'Próximo mes'],
  
  // Consulta los eventos disponibles mediante la API de Spring Boot.
  async loadEventsFromServer() {
    const response = await fetch('/api/eventos');
    const eventos = await response.json();

    // Adapta los datos recibidos de la API al formato utilizado por la interfaz.
    AppState.events = eventos.map(evento => ({
        id: evento.idEvento,
        title: evento.titulo,
        description: evento.descripcion,
        date: evento.fechaHora ? evento.fechaHora.split('T')[0] : '',
        time: evento.fechaHora ? evento.fechaHora.split('T')[1] : '',
        cost: evento.costo,
        imageUrl: evento.imagen,
        category: evento.categoria ? evento.categoria.nombreCategoria : '',
        location: evento.lugar ? evento.lugar.nombreLugar : '',
        locality: evento.lugar ? evento.lugar.localidad : '',
        coordinates: evento.lugar
        ? {
            lat: evento.lugar.latitud,
            lng: evento.lugar.longitud
        }
        : null
    }));
  },
  
  state: {
    selectedCategory: 'Todo',
    filterQuery: '',
    selectedDateFilter: 'Próximos eventos',
    isCategoryOpen: false,
    isDateOpen: false,
    currentPage: 1
  },
  _container: null,
  
    // Genera la representación visual de los eventos para mostrarlos en la interfaz.
    matchesDateFilter(eventDateStr, filter) {
        if (filter === 'Próximos eventos') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const eventDate = new Date(eventDateStr + 'T00:00:00');
            return eventDate >= today;
        }
        
        const eventDate = new Date(eventDateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        if (filter === 'Hoy') {
        return eventDate.getTime() === today.getTime();
        }
    
        if (filter === 'Próximos 7 días') {
            const limite = new Date(today);
            limite.setDate(limite.getDate() + 7);
            return eventDate >= today && eventDate <= limite;
        }

        if (filter === 'Este mes') {
            return eventDate.getFullYear() === today.getFullYear()
            && eventDate.getMonth() === today.getMonth();
        }

        if (filter === 'Próximo mes') {
            const proximoMes = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            return eventDate.getFullYear() === proximoMes.getFullYear()
            && eventDate.getMonth() === proximoMes.getMonth();
        }
        return true;
  },
  
    formatEventDateLabel(dateStr) {
    const eventDate = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (eventDate.getTime() === today.getTime()) return 'Hoy';
    if (eventDate.getTime() === tomorrow.getTime()) return 'Mañana';
    return dateStr;
  },
  
    formatCost(cost) {
        const value = Number(cost);
        if (!value || value === 0) return 'Entrada Libre';
        return '$' + value.toLocaleString('es-CO') + ' COP';
    },

  getFilteredEvents() {
    const s = this.state;
    return AppState.events.filter(e => {
      const matchesCategory = s.selectedCategory === 'Todo' ? true : e.category === s.selectedCategory;
      const matchesDate = this.matchesDateFilter(e.date, s.selectedDateFilter);
      const q = s.filterQuery.toLowerCase().trim();
      const matchesSearch = !q
              || (e.title || '').toLowerCase().includes(q)
              || (e.location || '').toLowerCase().includes(q)
              || (e.locality || '').toLowerCase().includes(q)
              || (e.category || '').toLowerCase().includes(q);
      return matchesCategory && matchesDate && matchesSearch;
    });
  },

  render() {
    const s = this.state;
    const isCategoryActive = s.selectedCategory !== 'Todo';
    const isDateActive = s.selectedDateFilter !== 'Próximos eventos';
    const hasActiveFilters = isCategoryActive || isDateActive || s.filterQuery.trim() !== '';

    const filteredEvents = this.getFilteredEvents();
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
    const paginatedEvents = filteredEvents.slice((s.currentPage - 1) * itemsPerPage, s.currentPage * itemsPerPage);

    return `
      <main class="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-6 md:py-8 pb-24 md:pb-16">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="font-display font-bold text-3xl md:text-4xl txt-darkbl tracking-tight">Explorar Eventos</h1>
            <p class="font-body text-sm txt-primary mt-1">Catálogo completo de actividades, muestras y talleres en Bogotá.</p>
          </div>
          <div class="relative w-full md:w-80">
            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 txt-muted">search</span>
            <input id="events-filter-input" type="text" value="${escapeHtml(s.filterQuery)}" placeholder="Filtrar por nombre o lugar..."
              class="w-full bg-white border br-darkgr rounded-full pl-10 pr-4 py-2.5 font-body text-sm outline-none focus-border-darkbl shadow-sm" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 md:gap-3 mb-8 relative z-30">
          ${s.isCategoryOpen || s.isDateOpen ? `<div data-hook="events-dropdown-backdrop" class="fixed inset-0 z-20 bg-transparent"></div>` : ''}

          <div class="relative z-30">
            <button data-hook="events-category-toggle" class="flex items-center gap-2 px-4 py-2.5 rounded-full font-label text-xs font-semibold transition-all cursor-pointer border shadow-sm ${
              isCategoryActive ? 'bg-darkbl text-white br-darkbl' : 'bg-white txt-darkbl br-darkgr hover-bg-crem'
            }">
              <span class="material-symbols-outlined text-[18px]">category</span>
              <span>${s.selectedCategory === 'Todo' ? 'Categoría' : `Cat: ${s.selectedCategory}`}</span>
              <span class="material-symbols-outlined text-[18px]">${s.isCategoryOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            ${
              s.isCategoryOpen
                ? `<div class="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-darkgr-40 py-2 z-40 animate-fadeIn">
                    ${this.categories
                      .map(
                        cat => `<button data-hook="events-category-option" data-cat="${cat}" class="w-full text-left px-4 py-2 text-xs font-body hover-bg-crem flex items-center justify-between cursor-pointer ${
                          s.selectedCategory === cat ? 'font-bold txt-darkbl bg-azuladclr' : 'txt-primary'
                        }">
                        <span>${cat === 'Todo' ? 'Todas las categorías' : cat}</span>
                        ${s.selectedCategory === cat ? '<span class="material-symbols-outlined text-[16px] txt-accent">check</span>' : ''}
                      </button>`
                      )
                      .join('')}
                  </div>`
                : ''
            }
          </div>

          <div class="relative z-30">
            <button data-hook="events-date-toggle" class="flex items-center gap-2 px-4 py-2.5 rounded-full font-label text-xs font-semibold transition-all cursor-pointer border shadow-sm ${
              isDateActive ? 'bg-darkbl text-white br-darkbl' : 'bg-white txt-darkbl br-darkgr hover-bg-crem'
            }">
              <span class="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>${s.selectedDateFilter === 'Próximos eventos' ? 'Fecha' : s.selectedDateFilter}</span>
              <span class="material-symbols-outlined text-[18px]">${s.isDateOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            ${
              s.isDateOpen
                ? `<div class="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-darkgr-40 py-2 z-40 animate-fadeIn">
                    ${this.dateOptions
                      .map(
                        opt => `<button data-hook="events-date-option" data-opt="${opt}" class="w-full text-left px-4 py-2 text-xs font-body hover-bg-crem flex items-center justify-between cursor-pointer ${
                          s.selectedDateFilter === opt ? 'font-bold txt-darkbl bg-azuladclr' : 'txt-primary'
                        }">
                        <span>${opt}</span>
                        ${s.selectedDateFilter === opt ? '<span class="material-symbols-outlined text-[16px] txt-accent">check</span>' : ''}
                      </button>`
                      )
                      .join('')}
                  </div>`
                : ''
            }
          </div>

          <button data-hook="events-clear-filters" title="Restablecer todos los filtros" class="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-label text-xs font-semibold transition-all cursor-pointer border shadow-sm ${
            hasActiveFilters ? 'bg-danger-10 txt-danger border-danger-30 hover-bg-danger-20 font-bold' : 'bg-crem txt-muted border-darkgr-40 hover-bg-soft'
          }">
            <span class="material-symbols-outlined text-[18px]">filter_alt_off</span>
            <span>Limpiar</span>
          </button>
        </div>

        ${
          paginatedEvents.length === 0
            ? `<div class="bg-white rounded-2xl p-12 text-center border border-darkgr-30 shadow-sm flex flex-col items-center gap-3">
                <span class="material-symbols-outlined text-[48px] txt-muted">event_busy</span>
                <h3 class="font-display font-bold text-lg txt-darkbl">No hay eventos con estos filtros</h3>
                <p class="font-body text-xs txt-primary">Prueba cambiando la categoría seleccionada o limpia la búsqueda.</p>
                <button data-hook="events-clear-filters-empty" class="bg-darkbl text-white font-label text-xs font-bold px-4 py-2 rounded-full mt-2 cursor-pointer hover-bg-azulmrn transition-colors">Restablecer filtros</button>
              </div>`
            : `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Configura la navegación hacia la página de detalle del evento seleccionado.-->
                ${paginatedEvents
                  .map(event => {
                    const fav = AppState.isFavorite(event.id);
                    const inAg = AppState.isInAgenda(event.id);
                    return `
                  <article class="bg-white rounded-2xl shadow-sm border border-darkgr-30 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
                    <div class="relative h-48 w-full overflow-hidden bg-lightsecn">
                      <a href="/pages/event-detail.html?id=${encodeURIComponent(event.id)}" data-hook="events-event-img">
                        <img src="${event.imageUrl}" alt="${escapeHtml(event.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" />
                      </a>
                      <button data-hook="events-event-fav-btn" data-id="${event.id}" aria-label="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}" class="absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${fav ? 'bg-white txt-danger' : 'bg-white/80 txt-muted hover:bg-white hover-txt-danger'}">
                        <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${fav ? "'FILL' 1" : "'FILL' 0"}">favorite</span>
                      </button>
                      <div class="absolute bottom-3 left-3 z-10">
                        <span class="bg-darkbln-80 text-white font-label text-[10px] font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">${event.category}</span>
                      </div>
                    </div>

                    <div class="p-5 flex flex-col flex-1">
                      <a href="/pages/event-detail.html?id=${encodeURIComponent(event.id)}" data-hook="events-event-title" class="no-underline">
                        <h4 class="font-display text-lg font-bold txt-darkbl hover-txt-accent transition-colors line-clamp-2 cursor-pointer mb-2">${event.title}</h4>
                      </a>
                      <div class="flex items-center gap-2 txt-primary font-label text-xs mb-1.5">
                        <span class="material-symbols-outlined text-[16px] txt-accent">calendar_today</span>
                        <span>${this.formatEventDateLabel(event.date)} • ${event.time}</span>
                      </div>
                      <div class="flex items-center gap-2 txt-primary font-label text-xs mb-4">
                        <span class="material-symbols-outlined text-[16px] txt-accent">location_on</span>
                        <span class="truncate">${event.location}</span>
                      </div>
                      <div class="mt-auto pt-4 border-t br-soft flex items-center justify-between">
                        <span class="font-body text-xs font-semibold txt-darkbl">${this.formatCost(event.cost)}</span>
                        <button data-hook="events-event-agenda-btn" data-id="${event.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer ${inAg ? 'bg-success txt-green font-semibold' : 'bg-crem txt-darkbl hover-bg-soft'}">
                          <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: ${inAg ? "'FILL' 1" : "'FILL' 0"}">${inAg ? 'check' : 'calendar_add_on'}</span>
                          <span>${inAg ? 'Agendado' : 'Agendar'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                `;
                  })
                  .join('')}
              </div>`
        }

        ${
          totalPages > 1
            ? `<div class="mt-10 flex items-center justify-center gap-2">
                <button data-hook="events-page-prev" ${s.currentPage === 1 ? 'disabled' : ''} class="p-2 rounded-full border br-darkgr txt-darkbl disabled:opacity-30 disabled:cursor-not-allowed hover-bg-soft">
                  <span class="material-symbols-outlined">chevron_left</span>
                </button>
                ${Array.from({ length: totalPages }).map((_, i) => `<button data-hook="events-page-num" data-page="${i + 1}" class="w-9 h-9 rounded-full font-label text-xs font-bold transition-all ${s.currentPage === i + 1 ? 'bg-darkbl text-white' : 'bg-crem txt-primary hover-bg-soft'}">${i + 1}</button>`).join('')}
                <button data-hook="events-page-next" ${s.currentPage === totalPages ? 'disabled' : ''} class="p-2 rounded-full border br-darkgr txt-darkbl disabled:opacity-30 disabled:cursor-not-allowed hover-bg-soft">
                  <span class="material-symbols-outlined">chevron_right</span>
                </button>
              </div>`
            : ''
        }
      </main>
    `;
  },

  handleClearFilters() {
    const s = this.state;
    s.selectedCategory = 'Todo';
    s.selectedDateFilter = 'Próximos eventos';
    s.filterQuery = '';
    s.currentPage = 1;
    s.isCategoryOpen = false;
    s.isDateOpen = false;
    this.update();
  },

  bindEvents(container) {
    const s = this.state;

    const filterInput = container.querySelector('#events-filter-input');
    if (filterInput) filterInput.addEventListener('input', e => { s.filterQuery = e.target.value; s.currentPage = 1; this.update(); });

    const backdrop = container.querySelector('[data-hook="events-dropdown-backdrop"]');
    if (backdrop) backdrop.addEventListener('click', () => { s.isCategoryOpen = false; s.isDateOpen = false; this.update(); });

    const catToggle = container.querySelector('[data-hook="events-category-toggle"]');
    if (catToggle) catToggle.addEventListener('click', () => { s.isCategoryOpen = !s.isCategoryOpen; s.isDateOpen = false; this.update(); });

    container.querySelectorAll('[data-hook="events-category-option"]').forEach(btn => {
      btn.addEventListener('click', () => { s.selectedCategory = btn.getAttribute('data-cat'); s.isCategoryOpen = false; s.currentPage = 1; this.update(); });
    });

    const dateToggle = container.querySelector('[data-hook="events-date-toggle"]');
    if (dateToggle) dateToggle.addEventListener('click', () => { s.isDateOpen = !s.isDateOpen; s.isCategoryOpen = false; this.update(); });

    container.querySelectorAll('[data-hook="events-date-option"]').forEach(btn => {
      btn.addEventListener('click', () => { s.selectedDateFilter = btn.getAttribute('data-opt'); s.isDateOpen = false; s.currentPage = 1; this.update(); });
    });

    const clearBtn = container.querySelector('[data-hook="events-clear-filters"]');
    if (clearBtn) clearBtn.addEventListener('click', () => this.handleClearFilters());

    const clearBtnEmpty = container.querySelector('[data-hook="events-clear-filters-empty"]');
    if (clearBtnEmpty) clearBtnEmpty.addEventListener('click', () => this.handleClearFilters());

    container.querySelectorAll('[data-hook="events-event-fav-btn"]').forEach(btn => {
      btn.addEventListener('click', () => { AppState.toggleFavorite(btn.getAttribute('data-id')); this.update(); refreshChrome(); });
    });

    container.querySelectorAll('[data-hook="events-event-agenda-btn"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-id'));
            
            if (AppState.isInAgenda(id)) {
                AppState.removeFromAgenda(id);
            } else {
                AppState.addToAgenda(id);
            }
                
            this.update();
            refreshChrome();
        });
    });

    const pagePrev = container.querySelector('[data-hook="events-page-prev"]');
    if (pagePrev) pagePrev.addEventListener('click', () => { s.currentPage = Math.max(1, s.currentPage - 1); this.update(); });

    container.querySelectorAll('[data-hook="events-page-num"]').forEach(btn => {
      btn.addEventListener('click', () => { s.currentPage = parseInt(btn.getAttribute('data-page'), 10); this.update(); });
    });

    const pageNext = container.querySelector('[data-hook="events-page-next"]');
    if (pageNext) {
      pageNext.addEventListener('click', () => {
        const totalPages = Math.ceil(this.getFilteredEvents().length / 6) || 1;
        s.currentPage = Math.min(totalPages, s.currentPage + 1);
        this.update();
      });
    }
  },

  update() {
    withFocusPreserved(() => {
      this._container.innerHTML = this.render();
      this.bindEvents(this._container);
    });
  },
  
  async init() {
    this._container = document.getElementById('page-content');
    
        try {
            initChrome({ title: 'Listado de Eventos' });
            
            await this.loadEventsFromServer();

            this._container.innerHTML = this.render();
            this.bindEvents(this._container);

        } catch (error) {
            console.error('Error al cargar la página de eventos:', error);
        
            this._container.innerHTML = `
                <div class="max-w-2xl mx-auto mt-10 bg-white rounded-2xl p-8 border border-red-200 shadow-sm">
                    <h2 class="font-display font-bold text-xl txt-darkbl mb-3">
                        Error al cargar los eventos
                    </h2>
                    <p class="font-body text-sm txt-primary mb-2">
                        La página no pudo completar la carga de los eventos desde el servidor.
                    </p>
                    <p class="font-body text-xs txt-danger break-words">
                        ${escapeHtml(error.message || String(error))}
                    </p>
                </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => EventsPage.init());
