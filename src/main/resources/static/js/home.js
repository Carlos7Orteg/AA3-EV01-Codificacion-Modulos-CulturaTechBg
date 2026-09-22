// ============================================================
// pages/home.js — Lógica de home.html
// Traducción de src/views/HomeView.tsx a página HTML real.
// Nota: "selectedCategory" era estado compartido en AppContext
// dentro de la SPA (persistía al saltar a event-detail y volver).
// Al ser ahora páginas reales, pasa a ser estado local de estaP
// página (se reinicia en cada carga) — cambio inevitable derivado
// de la separación en documentos independientes, documentado aquí.
// ============================================================

const HomePage = {
  mobileCategories: [
    { name: 'Todo', icon: 'grid_view' },
    { name: 'Música', icon: 'music_note' },
    { name: 'Teatro', icon: 'theater_comedy' },
    { name: 'Arte', icon: 'palette' },
    { name: 'Cine', icon: 'movie' }
  ],
  get desktopCategories() {
    return [...this.mobileCategories, { name: 'Danza', icon: 'celebration' }, { name: 'Museos', icon: 'museum' }, { name: 'Literatura', icon: 'menu_book' }, { name: 'Gastronomía', icon: 'restaurant' }];
  },

  state: {
    carouselIndex: 0,
    todoPage: 1,
    selectedCategory: 'Todo'
  },
  _container: null,
  _touchStartX: null,
  // Genera la estructura visual de la página principal con los eventos y categorías disponibles.
  render() {
    const s = this.state;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Obtiene los próximos eventos y selecciona los tres más cercanos para el carrusel destacado.
    const featuredEvents = AppState.events
        .filter(e => {
            if (!e.date) return false;
            const eventDate = new Date(e.date + 'T00:00:00');
            return eventDate >= today;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date + 'T00:00:00');
            const dateB = new Date(b.date + 'T00:00:00');
            return dateA - dateB;
        })
        .slice(0, 3);
    // Filtra los eventos según la categoría seleccionada.
    const filteredEvents = AppState.events.filter(e => {
        if (s.selectedCategory === 'Todo') return true;
        return e.category.toLowerCase().includes(s.selectedCategory.toLowerCase()) || e.category === s.selectedCategory;
    });
    const currentFeatured = featuredEvents[s.carouselIndex] || featuredEvents[0];
    // Calcula la paginación y determina los eventos que se muestran en la página actual.
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
    const paginatedEvents = filteredEvents.slice((s.todoPage - 1) * itemsPerPage, s.todoPage * itemsPerPage);

    return `
      <main class="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-6 md:py-8 pb-24 md:pb-16">
        <section data-hook="home-carousel" class="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl shadow-xl bg-darkbln group select-none">
          <img src="${currentFeatured.imageUrl}" alt="${escapeHtml(currentFeatured.title)}" class="w-full h-full object-cover opacity-90 transition-all duration-700 ease-out" />
          <div class="absolute inset-0 bg-gradient-to-t from-darkbln-95 via-darkbln-40  to-transparent flex flex-col justify-end p-5 md:p-10">
            <div class="flex flex-col gap-3">
              <div class="flex flex-wrap gap-2">
                <span class="inline-flex items-center gap-1.5 bg-blue-90 text-white px-3 py-1 rounded-sm backdrop-blur-sm font-label text-[11px] font-medium tracking-widest uppercase">
                  <span class="material-symbols-outlined text-[14px]">stars</span>
                  DESTACADO
                </span>
                <span class="inline-flex items-center gap-1.5 bg-brand txt-label px-3 py-1 rounded-sm font-label text-[11px] font-medium tracking-widest uppercase">
                  ${currentFeatured.category}
                </span>
              </div>

              <h2 data-hook="home-featured-title" data-id="${currentFeatured.id}" class="text-white text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-tight tracking-tight cursor-pointer hover-txt-brand transition-colors">
                ${currentFeatured.title}
              </h2>

              <div class="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 font-body text-xs md:text-sm mt-1">
                <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">calendar_today</span><span>${currentFeatured.date}</span></div>
                <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">schedule</span><span>${currentFeatured.time}</span></div>
                <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">payments</span><span>${currentFeatured.cost}</span></div>
              </div>

              <div class="flex items-center gap-3 mt-3">
                <a href="/pages/event-detail.html?id=${encodeURIComponent(currentFeatured.id)}" data-hook="home-featured-details-btn" class="bg-white txt-darkbln font-label font-bold text-xs uppercase px-5 py-2.5 rounded-sm hover-bg-soft transition-colors flex items-center gap-2 cursor-pointer no-underline">
                  Ver detalles
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>

                <button data-hook="home-featured-fav-btn" data-id="${currentFeatured.id}" class="p-2.5 rounded-sm border backdrop-blur-sm transition-all cursor-pointer ${
      AppState.isFavorite(currentFeatured.id) ? 'bg-danger text-white br-danger' : 'bg-white/20 text-white border-white/40 hover:bg-white/40'
    }">
                  <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${
                    AppState.isFavorite(currentFeatured.id) ? "'FILL' 1" : "'FILL' 0"
                  }">favorite</span>
                </button>
              </div>
            </div>
          </div>

          <button
          data-hook="home-carousel-prev" aria-label="Anterior"
          class="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 aspect-square bg-white/65 backdrop-blur-md hover:bg-white text-primary rounded-full shadow-xl border-2 border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined font-bold text-[30px]">chevron_left</span>
          </button>
          
          <button
          data-hook="home-carousel-next" aria-label="Siguiente"
          class="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 aspect-square bg-white/65 backdrop-blur-md hover:bg-white text-primary rounded-full shadow-xl border-2 border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined font-bold text-[30px]">chevron_right</span>
          </button>

          <div class="absolute bottom-3 right-4 flex items-center gap-2">
            ${featuredEvents.map((_, idx) => `<button data-hook="home-carousel-dot" data-idx="${idx}" aria-label="Ir a destacado ${idx + 1}" class="h-2 rounded-full transition-all cursor-pointer ${s.carouselIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'}"></button>`).join('')}
          </div>
        </section>

        <section class="mt-8 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-display font-bold text-xl txt-darkbl tracking-tight">Categorías culturales</h3>
            ${s.selectedCategory !== 'Todo' ? `<button data-hook="home-view-all-categories" class="font-label text-xs txt-body hover:underline font-semibold cursor-pointer">Ver todo</button>` : ''}
          </div>

          <div class="flex md:hidden items-center justify-between w-full px-1 pb-3 pt-1">
            ${this.mobileCategories
              .map(cat => {
                const isActive = s.selectedCategory === cat.name;
                return `<button data-hook="home-category-btn" data-name="${cat.name}" class="flex flex-col items-center flex-shrink-0 cursor-pointer group select-none">
                  <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 border ${isActive ? 'bg-darkbl text-white br-darkbl shadow-md scale-105' : 'bg-crem txt-darkbl br-darkgr-40 group-hover-bg-soft'}">
                    <span class="material-symbols-outlined text-[22px]">${cat.icon}</span>
                  </div>
                  <span class="text-[11px] font-label mt-1.5 whitespace-nowrap transition-colors ${isActive ? 'font-bold txt-darkbl' : 'font-medium txt-primary'}">${cat.name}</span>
                </button>`;
              })
              .join('')}
          </div>

          <div class="hidden md:flex md:items-center md:justify-between w-full gap-1 md:gap-2 lg:gap-3 pt-1 pb-2">
            ${this.desktopCategories
              .map(cat => {
                const isActive = s.selectedCategory === cat.name;
                return `<button data-hook="home-category-btn" data-name="${cat.name}" class="flex flex-col items-center flex-1 cursor-pointer group select-none min-w-0">
                  <div class="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all duration-200 border ${isActive ? 'bg-darkbl text-white br-darkbl shadow-md scale-105' : 'bg-crem txt-darkbl br-darkgr-40 group-hover-bg-soft'}">
                    <span class="material-symbols-outlined text-[20px] lg:text-[22px]">${cat.icon}</span>
                  </div>
                  <span class="text-[11px] lg:text-xs font-label mt-1.5 truncate max-w-full text-center transition-colors ${isActive ? 'font-bold txt-darkbl' : 'font-medium txt-primary'}">${cat.name}</span>
                </button>`;
              })
              .join('')}
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-display font-bold text-2xl txt-darkbl tracking-tight">${s.selectedCategory === 'Todo' ? 'Agenda de Eventos' : `Eventos de ${s.selectedCategory}`}</h3>
            <span class="font-label text-xs txt-primary">Mostrando ${paginatedEvents.length} de ${filteredEvents.length}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${paginatedEvents
              .map(event => {
                const fav = AppState.isFavorite(event.id);
                const inAg = AppState.isInAgenda(event.id);
                return `
              <article class="bg-white rounded-2xl shadow-sm border br-darkgr-30 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
                <div class="relative h-48 w-full overflow-hidden bg-lightsecn">
                  <a href="/pages/event-detail.html?id=${encodeURIComponent(event.id)}" data-hook="home-event-img">
                    <img src="${event.imageUrl}" alt="${escapeHtml(event.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" />
                  </a>

                  <button data-hook="home-event-fav-btn" data-id="${event.id}" aria-label="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}" class="absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md shadow-md transition-all cursor-pointer ${fav ? 'bg-white txt-danger' : 'bg-white/80 txt-muted hover:bg-white hover-txt-danger'}">
                    <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${fav ? "'FILL' 1" : "'FILL' 0"}">favorite</span>
                  </button>

                  <div class="absolute bottom-3 left-3 z-10">
                    <span class="bg-darkbln-80 text-white font-label text-[10px] font-semibold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">${event.category}</span>
                  </div>
                </div>

                <div class="p-5 flex flex-col flex-1">
                  <a href="/pages/event-detail.html?id=${encodeURIComponent(event.id)}" data-hook="home-event-title" class="no-underline">
                    <h4 class="font-display text-lg font-bold txt-darkbl hover-txt-accent transition-colors line-clamp-2 cursor-pointer mb-2">${event.title}</h4>
                  </a>

                  <div class="flex items-center gap-2 txt-primary font-label text-xs mb-1.5">
                    <span class="material-symbols-outlined text-[16px] txt-accent">calendar_today</span>
                    <span>${event.date} • ${event.time}</span>
                  </div>

                  <div class="flex items-center gap-2 txt-primary font-label text-xs mb-4">
                    <span class="material-symbols-outlined text-[16px] txt-accent">location_on</span>
                    <span class="truncate">${event.location}</span>
                  </div>

                  <div class="mt-auto pt-4 border-t br-soft flex items-center justify-between">
                    <span class="font-body text-xs font-semibold txt-darkbl">${
                        Number(event.cost) === 0
                            ? 'Entrada Libre'
                            : '$' + Number(event.cost).toLocaleString('es-CO') + ' COP'
                    }</span>
                    <button data-hook="home-event-agenda-btn" data-id="${event.id}" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer ${inAg ? 'bg-success txt-GREEN font-semibold' : 'bg-crem txt-darkbl hover-bg-soft'}">
                      <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: ${inAg ? "'FILL' 1" : "'FILL' 0"}">${inAg ? 'check' : 'calendar_add_on'}</span>
                      <span>${inAg ? 'Agendado' : 'Agendar'}</span>
                    </button>
                  </div>
                </div>
              </article>
            `;
              })
              .join('')}
          </div>

          ${
            s.selectedCategory === 'Todo' && totalPages > 1
              ? `<div class="mt-10 flex items-center justify-center gap-2">
                  <button data-hook="home-page-prev" ${s.todoPage === 1 ? 'disabled' : ''} class="p-2 rounded-full border br-darkgr txt-darkbl disabled:opacity-30 disabled:cursor-not-allowed hover-bg-soft cursor-pointer">
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                  ${Array.from({ length: totalPages }).map((_, i) => `<button data-hook="home-page-num" data-page="${i + 1}" class="w-9 h-9 rounded-full font-label text-xs font-bold transition-all cursor-pointer ${s.todoPage === i + 1 ? 'bg-darkbl text-white' : 'bg-crem txt-primary hover-bg-soft'}">${i + 1}</button>`).join('')}
                  <button data-hook="home-page-next" ${s.todoPage === totalPages ? 'disabled' : ''} class="p-2 rounded-full border br-darkgr txt-darkbl disabled:opacity-30 disabled:cursor-not-allowed hover-bg-soft cursor-pointer">
                    <span class="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>`
              : ''
          }
        </section>
      </main>
    `;
  },
  // Configura las acciones de interacción de la página principal.
  bindEvents(container) {
    const s = this.state;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const featuredEvents = AppState.events
        .filter(e => {
            if (!e.date) return false;
            const eventDate = new Date(e.date + 'T00:00:00');
            return eventDate >= today;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date + 'T00:00:00');
            const dateB = new Date(b.date + 'T00:00:00');
            return dateA - dateB;
        })
        .slice(0, 3);
    // Configura el desplazamiento táctil del carrusel para dispositivos móviles.
    const carousel = container.querySelector('[data-hook="home-carousel"]');
    if (carousel) {
      carousel.addEventListener('touchstart', e => { this._touchStartX = e.touches[0].clientX; });
      carousel.addEventListener('touchend', e => {
        if (this._touchStartX === null) return;
        const diff = this._touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          s.carouselIndex = diff > 0 ? (s.carouselIndex + 1) % featuredEvents.length : (s.carouselIndex - 1 + featuredEvents.length) % featuredEvents.length;
          this.update();
        }
        this._touchStartX = null;
      });
    }
    // Configura la navegación del evento destacado y los controles del carrusel.
    const featTitle = container.querySelector('[data-hook="home-featured-title"]');
    if (featTitle) featTitle.addEventListener('click', () => { window.location.href = `/pages/event-detail.html?id=${encodeURIComponent(featTitle.getAttribute('data-id'))}`; });

    const prevBtn = container.querySelector('[data-hook="home-carousel-prev"]');
    if (prevBtn) prevBtn.addEventListener('click', () => { s.carouselIndex = (s.carouselIndex - 1 + featuredEvents.length) % featuredEvents.length; this.update(); });

    const nextBtn = container.querySelector('[data-hook="home-carousel-next"]');
    if (nextBtn) nextBtn.addEventListener('click', () => { s.carouselIndex = (s.carouselIndex + 1) % featuredEvents.length; this.update(); });

    container.querySelectorAll('[data-hook="home-carousel-dot"]').forEach(dot => {
      dot.addEventListener('click', () => { s.carouselIndex = parseInt(dot.getAttribute('data-idx'), 10); this.update(); });
    });
    // Configura la selección y restablecimiento de las categorías de eventos.
    const viewAllBtn = container.querySelector('[data-hook="home-view-all-categories"]');
    if (viewAllBtn) viewAllBtn.addEventListener('click', () => { s.selectedCategory = 'Todo'; s.todoPage = 1; this.update(); });

    container.querySelectorAll('[data-hook="home-category-btn"]').forEach(btn => {
      btn.addEventListener('click', () => { s.selectedCategory = btn.getAttribute('data-name'); s.todoPage = 1; this.update(); });
    });
    // Configura la acción para agregar o quitar de favoritos el evento destacado.
    container.querySelectorAll('[data-hook="home-featured-fav-btn"]').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
                
            const id = Number(btn.getAttribute('data-id'));
            AppState.toggleFavorite(id);
            this.update();
            refreshChrome();
        });
    });
    // Configura la acción de favoritos para los eventos mostrados en las tarjetas.
    container.querySelectorAll('[data-hook="home-event-fav-btn"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-id'));
            AppState.toggleFavorite(id);
            this.update();
            refreshChrome();
        });
    });
    // Configura la acción para agregar o quitar eventos de la agenda.
    container.querySelectorAll('[data-hook="home-event-agenda-btn"]').forEach(btn => {
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
    // Configura los controles para cambiar entre las páginas de eventos.
    const pagePrev = container.querySelector('[data-hook="home-page-prev"]');
    if (pagePrev) pagePrev.addEventListener('click', () => { s.todoPage = Math.max(1, s.todoPage - 1); this.update(); });

    container.querySelectorAll('[data-hook="home-page-num"]').forEach(btn => {
      btn.addEventListener('click', () => { s.todoPage = parseInt(btn.getAttribute('data-page'), 10); this.update(); });
    });

    const pageNext = container.querySelector('[data-hook="home-page-next"]');
    if (pageNext) {
      pageNext.addEventListener('click', () => {
        const filteredEvents = AppState.events.filter(e => s.selectedCategory === 'Todo' || e.category.toLowerCase().includes(s.selectedCategory.toLowerCase()) || e.category === s.selectedCategory);
        const totalPages = Math.ceil(filteredEvents.length / 6) || 1;
        s.todoPage = Math.min(totalPages, s.todoPage + 1);
        this.update();
      });
    }
  },
  // Actualiza el contenido de la página conservando el foco del elemento activo.
  update() {
    withFocusPreserved(() => {
      this._container.innerHTML = this.render();
      this.bindEvents(this._container);
    });
  },
  // Inicializa la página, consulta los eventos y prepara su contenido para mostrarlo al usuario.
  async init() {
    AppState.init();
    initChrome({ title: 'Cultura Bogotá' });
    this._container = document.getElementById('page-content');
    // Consulta los eventos disponibles mediante la API REST de Spring Boot.
    try {
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
            address: evento.lugar ? evento.lugar.direccion : '',
            locality: evento.lugar ? evento.lugar.localidad : '',
            coordinates: evento.lugar
            ? {
                lat: evento.lugar.latitud,
                lng: evento.lugar.longitud
              }
            : null
        }));

        this._container.innerHTML = this.render();

        this.bindEvents(this._container);
        // Muestra un mensaje cuando no es posible cargar los eventos desde la API.
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            this._container.innerHTML = `
            <div class="p-8 text-center">
                <p class="txt-darkbl font-body">Error al cargar los eventos.</p>
            </div>`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => HomePage.init());
