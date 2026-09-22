// ============================================================
// pages/eventDetail.js — Lógica de event-detail.html
// Traducción de src/views/EventDetailView.tsx a página HTML real.
// El evento a mostrar viaja por la URL: event-detail.html?id=XXXX
// (en la SPA original vivía en memoria como AppState.selectedEventId).
// ============================================================

const EventDetailPage = {
    state: {
        registeredAssistance: false
    },
    _container: null,
    _event: null,

    formatEventDateLabel(dateStr) {
        const eventDate = new Date(dateStr + 'T00:00:00');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (eventDate.getTime() === today.getTime()) {
            return 'Hoy';
        }

        if (eventDate.getTime() === tomorrow.getTime()) {
            return 'Mañana';
        }

        return dateStr;
    },

    formatCost(cost) {

        const value = Number(cost);

        if (!value || value === 0) {
            return 'Entrada Libre';
        }

        return '$' + value.toLocaleString('es-CO') + ' COP';
    },

    render() {
        const s = this.state;
        const event = this._event;
        const fav = AppState.isFavorite(event.id);
        const inAg = AppState.isInAgenda(event.id);
        const recommendedEvents = AppState.events.filter(e => e.id !== event.id).slice(0, 3);

        const descriptionParagraphs = (event.fullDescription || event.description || '').split('\n\n')
                .map(p => {
                    const textoSeguro = escapeHtml(p);
                    const textoConLinks = textoSeguro.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer" class="evento-link">$1</a>');
                    return `<p>${textoConLinks}</p>`;
                })
                .join('');

        return `
      <div class="min-h-screen flex flex-col bg-crem">
        <header class="w-full sticky top-0 z-40 bg-cremlg-90 backdrop-blur-md border-b border-darkgr-30 h-16 flex items-center justify-between px-4 md:px-10">
          <div class="flex items-center gap-3">
            <button data-hook="ed-back-btn" class="p-2 -ml-2 rounded-full hover-bg-subtle transition-colors cursor-pointer">
              <span class="material-symbols-outlined txt-darkbl">arrow_back</span>
            </button>
            <span class="font-display font-bold text-lg md:text-xl txt-darkbl">Cultura Bogotá</span>
          </div>
          <div class="flex items-center gap-1">
            <button data-hook="ed-share-btn" aria-label="Compartir evento" class="p-2 rounded-full hover-bg-subtle txt-primary hover-txt-darkbl transition-colors">
              <span class="material-symbols-outlined text-[22px]">share</span>
            </button>
            <button data-hook="ed-fav-btn" aria-label="${fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}" class="p-2 rounded-full transition-colors ${fav ? 'text-danger' : 'txt-primary hover-text-danger'}">
              <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: ${fav ? "'FILL' 1" : "'FILL' 0"}">favorite</span>
            </button>
          </div>
        </header>

        <main class="flex-1 w-full max-w-[1280px] mx-auto pb-16">
          <section class="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden md:rounded-2xl md:mt-6 shadow-xl bg-darkbln">
            <img src="${event.imageUrl}" alt="${escapeHtml(event.title)}" class="w-full h-full object-cover opacity-90" />
            <div class="absolute inset-0 bg-gradient-to-t from-darkbln-95 via-darkbln-40 to-transparent flex flex-col justify-end p-5 md:p-10">
              <div class="flex flex-col gap-3">
                <div class="flex flex-wrap gap-2">
                  ${
                event.isFeatured
                ? `<span class="inline-flex items-center gap-1 bg-blue-90 text-white px-3 py-1 rounded-sm font-label text-[11px] font-medium uppercase tracking-widest">
                          <span class="material-symbols-outlined text-[14px]">stars</span>DESTACADO
                        </span>`
                : ''
                }
                  <span class="inline-flex items-center gap-1 bg-brand txt-label px-3 py-1 rounded-sm font-label text-[11px] font-medium uppercase tracking-widest">${event.category}</span>
                </div>
                <h1 class="text-white text-3xl md:text-5xl font-display font-bold leading-tight max-w-3xl">${event.title}</h1>
                <div class="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 font-body text-xs md:text-sm mt-1">
                  <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">calendar_today</span><span>${this.formatEventDateLabel(event.date)}</span></div>
                  <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">schedule</span><span>${event.time}</span></div>
                  <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">payments</span><span>${this.formatCost(event.cost)}</span></div>
                </div>
              </div>
            </div>
          </section>

          <div class="px-4 md:px-10 mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            <div class="lg:col-span-8 flex flex-col gap-10">
              <div>
                <h2 class="text-2xl font-display font-bold txt-darkbl mb-4 border-b border-darkgr-40 pb-2">Acerca del evento</h2>
                <div class="space-y-4 font-body text-base md:text-lg txt-main leading-relaxed">${descriptionParagraphs}</div>
              </div>

              ${
                event.schedule && event.schedule.length > 0
                ? `<div class="bg-crem rounded-2xl p-6 md:p-8 border border-darkgr-40">
                      <h3 class="text-xl font-display font-bold txt-darkbl mb-6">Cronograma de Presentaciones</h3>
                      <div class="space-y-6">
                        ${event.schedule
                .map(
                        item => `<div class="flex gap-4 md:gap-6 items-start">
                            <span class="font-label font-bold txt-darkbl text-base min-w-[60px]">${item.time}</span>
                            <div class="flex flex-col border-l-2 border-darkbl-20 pl-4">
                              <h4 class="font-display font-bold text-base txt-main">${item.title}</h4>
                              <p class="font-body text-xs txt-primary mt-0.5">${item.description}</p>
                            </div>
                          </div>`
                )
                .join('')}
                      </div>
                    </div>`
                : ''
                }

              <div class="space-y-6">
                <h3 class="text-2xl font-display font-bold txt-darkbl border-b border-darkgr-40 pb-2">Lugar del evento</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="flex flex-col gap-3 font-body">
                    <div><p class="font-label text-[11px] font-bold txt-primary uppercase tracking-wider">Nombre del lugar</p><p class="font-display font-bold text-lg txt-main">${event.location}</p></div>
                    <div><p class="font-label text-[11px] font-bold txt-primary uppercase tracking-wider">Dirección</p><p class="text-sm txt-main">${event.address}</p></div>
                    <div><p class="font-label text-[11px] font-bold txt-primary uppercase tracking-wider">Localidad</p><p class="text-sm txt-main">${event.locality}</p></div>
                    ${event.phone ? `<div><p class="font-label text-[11px] font-bold txt-primary uppercase tracking-wider">Teléfono</p><p class="text-sm txt-main">${event.phone}</p></div>` : ''}
                    ${
                event.website
                ? `<div><p class="font-label text-[11px] font-bold txt-primary uppercase tracking-wider">Página web</p><a href="https://${event.website}" target="_blank" rel="noreferrer" class="text-sm txt-body font-semibold hover:underline">${event.website}</a></div>`
                : ''
                }
                    <button data-hook="ed-map-btn" class="mt-2 inline-flex items-center justify-center gap-2 bg-darkbl text-white px-5 py-3 rounded-lg font-label font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors cursor-pointer">
                      <span class="material-symbols-outlined text-[18px]">map</span>Ver ubicación
                    </button>
                  </div>
                  <div class="w-full h-60 rounded-2xl overflow-hidden relative shadow-inner border border-darkgr-40 bg-lightsecn">
                    <iframe title="Mapa de ubicación de ${escapeHtml(event.title)}" width="100%" height="100%" class="w-full h-full border-0"
                      loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"
                      src="${
                      event.coordinates && event.coordinates.lat != null && event.coordinates.lng != null
                      ? `https://www.google.com/maps?q=${encodeURIComponent(`${event.location}, ${event.address}, ${event.locality}, Bogotá, Colombia`)}&z=17&output=embed`
                      : `https://maps.google.com/maps?q=${encodeURIComponent(`${event.location}, ${event.address}, ${event.locality}, Bogotá, Colombia`)}&hl=es&z=15&output=embed`
                 }"></iframe>
                  </div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-4 flex flex-col gap-6">
              <div class="bg-white rounded-2xl p-6 shadow-sm border border-darkgr-40">
                <span class="font-label text-[10px] txt-muted uppercase tracking-widest block mb-4">Organización oficial</span>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-darkbln text-white flex items-center justify-center font-bold text-lg shadow-sm">${(event.organizer && event.organizer.name && event.organizer.name[0]) || 'I'}</div>
                  <div>
                    <h4 class="font-display font-bold text-base txt-main">${(event.organizer && event.organizer.name) || 'IDARTES'}</h4>
                    <p class="font-body text-xs txt-primary">${(event.organizer && event.organizer.description) || 'Instituto Distrital de las Artes'}</p>
                  </div>
                </div>
              </div>

              <div class="bg-darkbln text-white rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-darkgr-20">
                <div class="relative z-10 flex flex-col gap-4">
                  <div>
                    <span class="font-display text-2xl font-bold block mb-1">${event.cost}</span>
                    <p class="font-body text-xs txt-lightazl">El registro te permite reservar tu cupo y sincronizar tu agenda cultural.</p>
                  </div>
                  <div class="space-y-3 mt-2">
                    <button data-hook="ed-register-btn" class="w-full py-3.5 rounded-lg font-label font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                s.registeredAssistance ? 'bg-success txt-green' : 'bg-white txt-darkbln hover-bg-soft'
                }">
                      <span class="material-symbols-outlined text-[18px]">${s.registeredAssistance ? 'check_circle' : 'how_to_reg'}</span>
                      ${s.registeredAssistance ? 'Asistencia confirmada' : 'Registrar asistencia'}
                    </button>
                    <button data-hook="ed-agenda-btn" class="w-full py-3.5 rounded-lg font-label font-bold text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                inAg ? 'bg-blue br-blue text-white' : 'br-lightazl txt-lightazl hover:bg-white/10'
                }">
                      <span class="material-symbols-outlined text-[18px]">${inAg ? 'event_available' : 'calendar_add_on'}</span>
                      ${inAg ? 'En tu agenda' : 'Agregar a Agenda'}
                    </button>
                  </div>
                  <p class="font-label text-[10px] txt-lightazl-70 text-center mt-2 leading-tight">Al registrarte aceptas los términos de la Secretaría de Cultura de Bogotá.</p>
                </div>
              </div>

              <a href="/pages/events.html" data-hook="ed-goto-list-btn" class="w-full py-3.5 txt-primary hover-txt-darkbl font-label font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover-bg-crem rounded-xl transition-all cursor-pointer border border-darkgr-40 no-underline">
                <span class="material-symbols-outlined text-[18px]">arrow_back</span>Regresar al listado
              </a>
            </div>
          </div>

          <section class="mt-16 px-4 md:px-10 border-t border-darkgr-30 pt-12">
            <h3 class="text-2xl font-display font-bold txt-darkbl mb-6">Otros eventos recomendados</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              ${recommendedEvents
                .map(
                        item => `<a href="/pages/event-detail.html?id=${encodeURIComponent(item.id)}" data-hook="ed-recommended-item" class="group cursor-pointer bg-white rounded-xl overflow-hidden border border-darkgr-30 shadow-sm hover:shadow-md transition-all p-3 no-underline block">
                  <div class="aspect-[16/10] rounded-lg overflow-hidden mb-3 relative">
                    <img src="${item.imageUrl}" alt="${escapeHtml(item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span class="font-label text-[10px] font-bold txt-body uppercase tracking-wider">${item.category} • ${item.date}</span>
                  <h5 class="font-display font-bold text-base txt-main grp-hover-accent transition-colors mt-0.5 line-clamp-1">${item.title}</h5>
                </a>`
                )
                .join('')}
            </div>
          </section>
        </main>
      </div>
    `;
    },

    handleShare(event) {
        if (navigator.share) {
            navigator.share({title: event.title, text: event.description, url: window.location.href}).catch(() => {
            });
        } else {
            alert(`Enlace copiado al portapapeles: ${event.title}`);
        }
    },

    // Configura las acciones de los botones de la vista de detalle del evento.
    bindEvents(container) {
        const s = this.state;
        const event = this._event;
        const inAg = AppState.isInAgenda(event.id);

        // Configura el botón para regresar a la vista anterior.
        const backBtn = container.querySelector('[data-hook="ed-back-btn"]');
        if (backBtn)
            backBtn.addEventListener('click', () => window.history.back());

        // Configura la acción para compartir el evento.
        const shareBtn = container.querySelector('[data-hook="ed-share-btn"]');
        if (shareBtn)
            shareBtn.addEventListener('click', () => this.handleShare(event));

        // Permite agregar o quitar el evento de favoritos.
        const favBtn = container.querySelector('[data-hook="ed-fav-btn"]');
        if (favBtn)
            favBtn.addEventListener('click', () => {
                AppState.toggleFavorite(event.id);
                this.update();
                refreshChrome();
            });
        
        // Configura el acceso a la ubicación del evento mediante Google Maps.
        const mapBtn = container.querySelector('[data-hook="ed-map-btn"]');
        if (mapBtn) {
            mapBtn.addEventListener('click', () => {
                const searchQuery = `${event.location}, ${event.address}, ${event.locality}, Bogotá, Colombia`;
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`, '_blank');
            });
        }

        // Configura la acción de registro de asistencia al evento.
        const registerBtn = container.querySelector('[data-hook="ed-register-btn"]');
        if (registerBtn)
            registerBtn.addEventListener('click', () => {
                s.registeredAssistance = true;
                this.update();
            });

        // Configura la acción para agregar el evento a la agenda.
        const agendaBtn = container.querySelector('[data-hook="ed-agenda-btn"]');
        if (agendaBtn)
            agendaBtn.addEventListener('click', () => {
                if (!inAg) {
                    AppState.addToAgenda(event.id);
                    this.update();
                    refreshChrome();
                }
            });
    },

    update() {
        withFocusPreserved(() => {
            this._container.innerHTML = this.render();
            this.bindEvents(this._container);
        });
    },

    async loadEventFromServer(eventId) {
        const response = await fetch('/api/eventos');
        const eventos = await response.json();

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

        return AppState.events.find(e => String(e.id) === String(eventId));
    },

    async init() {
        this._container = document.getElementById('page-content');

        try {
            const eventId = getUrlParam('id');
            this._event = await this.loadEventFromServer(eventId);

            if (!this._event) {
                throw new Error(`No se encontró el evento con ID ${eventId}.`);
            }

            initChrome();

            this._container.innerHTML = this.render();
            this.bindEvents(this._container);

        } catch (error) {
            console.error('Error al cargar el detalle del evento:', error);

            this._container.innerHTML = `
              <div class="max-w-2xl mx-auto mt-10 bg-white rounded-2xl p-8 border border-red-200 shadow-sm">
                 <h2 class="font-display font-bold text-xl txt-darkbl mb-3">
                   Error al cargar el evento
                 </h2>
                 <p class="font-body text-sm txt-primary mb-2">
                   La página no pudo completar la carga del evento desde el servidor.
                 </p>
                 <p class="font-body text-xs txt-danger break-words">
                    ${escapeHtml(error.message || String(error))}
                 </p>
              </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => EventDetailPage.init());
