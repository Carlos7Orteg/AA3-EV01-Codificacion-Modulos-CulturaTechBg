// ============================================================
// pages/register.js — Lógica de register.html
// Traducción de src/views/RegisterView.tsx a página HTML real.
// ============================================================

const RegisterPage = {
  state: {
    name: '',
    lastname: '',
    cedula: '',
    birthdate: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    acceptedTerms: false
  },
  _container: null,
  // Valida que el correo electrónico tenga un formato válido.
  validateEmailFormat(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  },
  // Genera la estructura visual del formulario de registro y refleja su estado actual.
  render() {
    const s = this.state;
    const isEmailValid = this.validateEmailFormat(s.email);
    // Evalúa los requisitos de seguridad definidos para la contraseña.
    const reqLen = s.password.length >= 8;
    const reqUpper = /[A-Z]/.test(s.password);
    const reqLower = /[a-z]/.test(s.password);
    const reqNum = /[0-9]/.test(s.password);
    const reqSpec = /[@#$!()?&%]/.test(s.password);
    const passedReqsCount = [reqLen, reqUpper, reqLower, reqNum, reqSpec].filter(Boolean).length;
    const allReqsMet = passedReqsCount === 5;
    // Determina la fortaleza de la contraseña según los requisitos cumplidos.
    let strengthLabel = 'Débil';
    let strengthColor = 'text-[#ba1a1a]';
    if (passedReqsCount >= 5) { strengthLabel = 'Fuerte'; strengthColor = 'text-[#146c2e]'; }
    else if (passedReqsCount >= 3) { strengthLabel = 'Media'; strengthColor = 'text-[#783d01]'; }

    const passwordsMatch = s.password === s.confirmPassword && s.confirmPassword.length > 0;
    // Comprueba que todos los campos y condiciones necesarias permitan registrar la cuenta.
    const isFormValid =
      s.name.trim().length > 0 &&
      s.lastname.trim().length > 0 &&
      s.cedula.trim().length > 0 &&
      s.birthdate.length > 0 &&
      isEmailValid &&
      allReqsMet &&
      passwordsMatch &&
      s.acceptedTerms;
    // Genera la representación visual de cada requisito de contraseña.
    const reqRow = (met, label) => `
      <div class="flex items-center gap-2 ${met ? 'text-[#146c2e]' : 'text-[#ba1a1a]'}">
        ${met ? '<span class="font-bold">✓</span>' : '<span class="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>'}
        <span>${label}</span>
      </div>
    `;

    return `
      <div class="min-h-screen bg-[#f9faf5] flex flex-col items-center">
        <header class="w-full sticky top-0 bg-[#f3f4f0] border-b border-[#c4c6cc]/30 flex items-center justify-between px-4 md:px-10 h-20 z-40 shadow-sm">
          <div class="flex items-center gap-3">${renderLogo({ size: 'sm', showText: true })}</div>
          <a href="login.html" data-hook="register-login-link" class="text-[#8e4e14] font-label font-medium hover:text-[#0d1b2a] underline underline-offset-4 cursor-pointer">
            Iniciar sesión
          </a>
        </header>

        <main class="flex-grow w-full max-w-[1280px] px-4 md:px-10 py-8 md:py-12 flex items-center justify-center">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full items-center">
            <div class="hidden lg:flex flex-col gap-6">
              <h1 class="font-display font-bold text-4xl text-[#0f1c2c] leading-tight">
                Descubre la vibrante esencia cultural de Bogotá.
              </h1>
              <p class="font-body text-base text-[#44474c] max-w-md">
                Regístrate para acceder a convocatorias exclusivas, guardar tus eventos favoritos y explorar la agenda cultural más completa de la capital.
              </p>
              <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-[#c4c6cc]/30">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMUJokjth6XPDP-qw7WKSyUh7pno2SfSi9Pt0ifGcV5VWqHq7WdCmhTb54JLrbtCz_wj-tGXR-Gp87MvRa-MyuPC7RI-GfBUm_SEcvZ5xnwNjElZy5JnK_mDMF3w2oAk3cEDJrCKegr2WHI-bEsKQjkZqKghnCBW1R1y7y5FsYP-NJSCtNHyzGEtLUa_ExjSbx-poYxv34ta_opBL3R5208M1J4nIX1JhFohcB6PYCT6AnrIjesSjeCzpV2YPeTPWeIYcWKdW70FU" alt="Cultura Bogotá" class="object-cover w-full h-full" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0f1c2c]/40 to-transparent"></div>
              </div>
            </div>

            <div class="w-full max-w-lg mx-auto">
              <div class="bg-[#ffffff] p-6 md:p-10 rounded-2xl border border-[#c4c6cc]/40 shadow-xl">
                <div class="mb-6 text-center md:text-left">
                  <h2 class="font-display text-2xl md:text-3xl font-bold text-[#0f1c2c] mb-1">Crear Cuenta</h2>
                  <p class="font-body text-xs md:text-sm text-[#44474c]">Regístrate para continuar en la plataforma</p>
                </div>

                <form data-hook="register-form" class="flex flex-col gap-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                      <label class="font-label text-xs font-medium text-[#1a1c1a]">Nombres</label>
                      <input type="text" id="reg-name" required value="${escapeHtml(s.name)}" placeholder="Ej: Juan"
                        class="w-full bg-[#f3f4f0] border border-[#c4c6cc] rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-[#0f1c2c] transition-all" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="font-label text-xs font-medium text-[#1a1c1a]">Apellidos</label>
                      <input type="text" id="reg-lastname" required value="${escapeHtml(s.lastname)}" placeholder="Ej: Pérez"
                        class="w-full bg-[#f3f4f0] border border-[#c4c6cc] rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-[#0f1c2c] transition-all" />
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="font-label text-xs font-medium text-[#1a1c1a]">Documento (Cédula)</label>
                    <input type="text" id="reg-cedula" required value="${escapeHtml(s.cedula)}" placeholder="Ej: 1020304050"
                      class="w-full bg-[#f3f4f0] border border-[#c4c6cc] rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-[#0f1c2c] transition-all" />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="font-label text-xs font-medium text-[#1a1c1a]">Fecha de Nacimiento</label>
                    <div class="relative flex items-center">
                      <input type="date" id="reg-birthdate" required value="${escapeHtml(s.birthdate)}"
                        class="w-full bg-[#f3f4f0] border border-[#c4c6cc] rounded-lg pl-4 pr-10 py-3 font-body text-sm outline-none focus:border-[#0f1c2c] transition-all" />
                      <span class="material-symbols-outlined absolute right-3 text-[#74777d] pointer-events-none">calendar_month</span>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="font-label text-xs font-medium text-[#1a1c1a]">Correo Electrónico</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3 text-[#74777d]">mail</span>
                      <input type="email" id="reg-email" required value="${escapeHtml(s.email)}" placeholder="Ej: juan.perez@example.com"
                        class="w-full bg-[#f3f4f0] border rounded-lg pl-10 pr-10 py-3 font-body text-sm outline-none transition-all ${
                          s.email.length > 0 ? (isEmailValid ? 'border-[#146c2e]' : 'border-[#ba1a1a]') : 'border-[#c4c6cc] focus:border-[#0f1c2c]'
                        }" />
                      ${
                        s.email.length > 0 && isEmailValid
                          ? '<span class="material-symbols-outlined absolute right-3 text-[#146c2e]">check_circle</span>'
                          : ''
                      }
                    </div>
                    ${
                      s.email.length > 0 && !isEmailValid
                        ? '<span class="font-label text-[11px] text-[#ba1a1a]">Ingresa un correo electrónico válido.</span>'
                        : ''
                    }
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="font-label text-xs font-medium text-[#1a1c1a]">Contraseña</label>
                    <div class="relative flex items-center">
                      <span class="material-symbols-outlined absolute left-3 text-[#74777d]">lock</span>
                      <input type="${s.showPassword ? 'text' : 'password'}" id="reg-password" required value="${escapeHtml(s.password)}" placeholder="Mínimo 8 caracteres"
                        class="w-full bg-[#f3f4f0] border border-[#c4c6cc] rounded-lg pl-10 pr-10 py-3 font-body text-sm outline-none focus:border-[#0f1c2c] transition-all" />
                      <button type="button" data-hook="register-toggle-password" class="absolute right-3 text-[#74777d] hover:text-[#0d1b2a] cursor-pointer">
                        <span class="material-symbols-outlined text-[20px]">${s.showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>

                    <div class="flex flex-col gap-1.5 mt-2">
                      <label class="font-label text-xs font-medium text-[#1a1c1a]">Confirmar Contraseña</label>
                      <div class="relative flex items-center">
                        <span class="material-symbols-outlined absolute left-3 text-[#74777d]">lock_reset</span>
                        <input type="${s.showPassword ? 'text' : 'password'}" id="reg-confirm-password" required value="${escapeHtml(s.confirmPassword)}" placeholder="Repite tu contraseña"
                          class="w-full bg-[#f3f4f0] border rounded-lg pl-10 pr-10 py-3 font-body text-sm outline-none transition-all ${
                            s.confirmPassword.length > 0 ? (passwordsMatch ? 'border-[#146c2e]' : 'border-[#ba1a1a]') : 'border-[#c4c6cc] focus:border-[#0f1c2c]'
                          }" />
                        ${
                          s.confirmPassword.length > 0 && passwordsMatch
                            ? '<span class="material-symbols-outlined absolute right-3 text-[#146c2e]">check_circle</span>'
                            : ''
                        }
                      </div>
                      ${
                        s.confirmPassword.length > 0 && !passwordsMatch
                          ? '<span class="font-label text-[11px] text-[#ba1a1a]">Las contraseñas no coinciden.</span>'
                          : ''
                      }
                    </div>

                    ${
                      !allReqsMet && s.password.length > 0
                        ? `<div class="flex flex-col gap-1.5 p-3 bg-[#f3f4f0] rounded-xl border border-[#c4c6cc]/30 mt-1">
                            <div class="flex items-center justify-between font-label text-xs">
                              <span class="font-bold text-[#1a1c1a]">Requisitos de contraseña</span>
                              <span>Fortaleza: <strong class="${strengthColor}">${strengthLabel}</strong></span>
                            </div>
                            <div class="flex flex-col gap-1 text-[11px] font-body">
                              ${reqRow(reqLen, 'Mínimo 8 caracteres')}
                              ${reqRow(reqUpper, 'Una letra mayúscula (A-Z)')}
                              ${reqRow(reqLower, 'Una letra minúscula (a-z)')}
                              ${reqRow(reqNum, 'Un número (0-9)')}
                              ${reqRow(reqSpec, 'Un carácter especial (@#$!()?&%)')}
                            </div>
                          </div>`
                        : ''
                    }
                  </div>

                  <div class="flex items-start gap-3 mt-2">
                    <input type="checkbox" id="reg-terms" required ${s.acceptedTerms ? 'checked' : ''}
                      class="mt-1 w-5 h-5 rounded border-[#c4c6cc] text-[#0f1c2c] focus:ring-[#0f1c2c]/20 cursor-pointer" />
                    <label for="reg-terms" class="font-body text-xs text-[#44474c] leading-relaxed cursor-pointer">
                      Acepto los
                      <a href="#terms" data-hook="register-noop-link" class="text-[#0f1c2c] font-semibold hover:underline">Términos y Condiciones</a>
                      y la
                      <a href="#privacy" data-hook="register-noop-link" class="text-[#0f1c2c] font-semibold hover:underline">Política de Privacidad</a>.
                    </label>
                  </div>

                  <button type="submit" ${!isFormValid ? 'disabled' : ''} class="w-full font-body font-medium py-3.5 px-6 rounded-lg shadow-sm transition-all mt-4 cursor-pointer ${
      isFormValid ? 'bg-[#0f1c2c] hover:bg-black text-white active:scale-98' : 'bg-[#e2e3df] text-[#74777d] cursor-not-allowed'
    }">
                    Registrarse
                  </button>
                </form>

                <div class="mt-8 text-center">
                  <p class="font-body text-xs text-[#44474c]">
                    ¿Ya tienes una cuenta?
                    <a href="login.html" data-hook="register-goto-login" class="text-[#0f1c2c] font-bold hover:underline ml-1 cursor-pointer">Iniciar Sesión</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer class="w-full py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#c4c6cc]/30 bg-[#f3f4f0] text-[#44474c] font-label text-xs">
          <span>Explora la cultura digital con CulturaTech Bogotá. Conectando mentes creativas.</span>
          <span>© ${new Date().getFullYear()} CulturaTech Bogotá. Todos los derechos reservados.</span>
        </footer>
      </div>
    `;
  },
  // Configura las interacciones y validaciones del formulario de registro.
  bindEvents(container) {
    const s = this.state;
    // Vincula un campo del formulario con el estado correspondiente.
    const bindText = (id, key) => {
    const el = container.querySelector(`#${id}`);
    
    if (el) {
      el.addEventListener('input', e => {
        s[key] = e.target.value;

      // Mantener el campo actual sin reconstruir todo el formulario.
      if (key === 'email') {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email);

        el.classList.toggle('border-[#146c2e]', s.email.length > 0 && isEmailValid);
        el.classList.toggle('border-[#ba1a1a]', s.email.length > 0 && !isEmailValid);
      } else {
        this.update();
      }
    });
  }
};

    bindText('reg-name', 'name');
    bindText('reg-lastname', 'lastname');
    bindText('reg-cedula', 'cedula');
    bindText('reg-birthdate', 'birthdate');
    bindText('reg-email', 'email');
    bindText('reg-password', 'password');
    bindText('reg-confirm-password', 'confirmPassword');
    // Configura el botón para mostrar u ocultar las contraseñas ingresadas.
    const toggleBtn = container.querySelector('[data-hook="register-toggle-password"]');
    if (toggleBtn) toggleBtn.addEventListener('click', () => { s.showPassword = !s.showPassword; this.update(); });
    // Registra la aceptación de los términos y condiciones del registro.
    const termsCheckbox = container.querySelector('#reg-terms');
    if (termsCheckbox) termsCheckbox.addEventListener('change', e => { s.acceptedTerms = e.target.checked; this.update(); });
    // Evita la navegación de los enlaces informativos que aún no tienen una página asociada.
    container.querySelectorAll('[data-hook="register-noop-link"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
    // Configura el envío y la validación final del formulario de registro.
    const form = container.querySelector('[data-hook="register-form"]');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        // Revalida los datos antes de permitir el envío del formulario.
        const isEmailValid = this.validateEmailFormat(s.email);
        const reqLen = s.password.length >= 8;
        const reqUpper = /[A-Z]/.test(s.password);
        const reqLower = /[a-z]/.test(s.password);
        const reqNum = /[0-9]/.test(s.password);
        const reqSpec = /[@#$!()?&%]/.test(s.password);
        const allReqsMet = [reqLen, reqUpper, reqLower, reqNum, reqSpec].every(Boolean);
        const passwordsMatch = s.password === s.confirmPassword && s.confirmPassword.length > 0;

        const isFormValid =
          s.name.trim().length > 0 &&
          s.lastname.trim().length > 0 &&
          s.cedula.trim().length > 0 &&
          s.birthdate.length > 0 &&
          isEmailValid &&
          allReqsMet &&
          passwordsMatch &&
          s.acceptedTerms;

        if (!isFormValid) return;

      });
    }
  },
  // Actualiza el formulario conservando el foco del campo que está utilizando el usuario.
  update() {
    withFocusPreserved(() => {
      this._container.innerHTML = this.render();
      this.bindEvents(this._container);
    });
  },
  // Inicializa el formulario de registro y configura sus eventos.
  init() {
    AppState.init();
    this._container = document.getElementById('page-content');
    if (!this._container.innerHTML.trim()) {
      this._container.innerHTML = this.render();
    }
    this.bindEvents(this._container);
  }
};

document.addEventListener('DOMContentLoaded', () => RegisterPage.init());
