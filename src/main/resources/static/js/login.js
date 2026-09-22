// ============================================================
// pages/login.js — Lógica de login.html
// ============================================================

const LoginPage = {
  // ------------------------------------------------------------
  // Estado del login
  // ------------------------------------------------------------
  state: {
    email: "",
    password: "",
    showPassword: false,
    isEmailValid: false,
    emailTouched: false,
    captchaChecked: false,
    showCaptchaModal: false,
    showLoginError: false,
    socialAuthError: null,
    showForgotModal: false,
    forgotSent: false,
    timeLeftMs: 0
  },

  _container: null,
  _messageHandler: null,
  _lockoutInterval: null,

  // ------------------------------------------------------------
  // Validación de correo
  // ------------------------------------------------------------
  validateEmailFormat(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  },

  // ------------------------------------------------------------
  // Contador de bloqueo
  // ------------------------------------------------------------
  formatCountdown(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;

    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  },

  // ------------------------------------------------------------
  // Actualización conservando foco
  // ------------------------------------------------------------
  withFocusPreserved(callback) {
    const activeElement = document.activeElement;
    const activeId = activeElement ? activeElement.id : null;
    const selectionStart =
      activeElement && typeof activeElement.selectionStart === "number"
        ? activeElement.selectionStart
        : null;

    const selectionEnd =
      activeElement && typeof activeElement.selectionEnd === "number"
        ? activeElement.selectionEnd
        : null;

    callback();

    if (!activeId) {
      return;
    }

    const newElement = document.getElementById(activeId);
    if (!newElement) {
      return;
    }

    newElement.focus();
    if (
      selectionStart !== null &&
      selectionEnd !== null &&
      typeof newElement.setSelectionRange === "function"
    ) {
      newElement.setSelectionRange(selectionStart, selectionEnd);
    }
  },

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  render() {
    const s = this.state;
    const isLocked =
      AppState.lockoutUntil !== null && Date.now() < AppState.lockoutUntil;
    const isEmailValid = this.validateEmailFormat(s.email);

    // --------------------------------------------------------
    // Requisitos de contraseña
    // --------------------------------------------------------
    const reqLen = s.password.length >= 8;
    const reqUpper = /[A-Z]/.test(s.password);
    const reqLower = /[a-z]/.test(s.password);
    const reqNum = /[0-9]/.test(s.password);
    const reqSpec = /[@#$!()?&%]/.test(s.password);
    const passedReqsCount = [reqLen, reqUpper, reqLower, reqNum, reqSpec].filter(Boolean).length;
    const allReqsMet = passedReqsCount === 5;

    // --------------------------------------------------------
    // Fortaleza
    // --------------------------------------------------------
    let strengthLabel = "Débil";
    let strengthColor = "txt-danger";

    if (passedReqsCount >= 5) {
      strengthLabel = "Fuerte";
      strengthColor = "txt-lightgreen";
    } else if (passedReqsCount >= 3) {
      strengthLabel = "Media";
      strengthColor = "txt-label";
    }

    // --------------------------------------------------------
    // Validación general del formulario
    // --------------------------------------------------------
    const isFormValid =
      s.email.trim().length > 0 &&
      isEmailValid &&
      s.password.length >= 8 &&
      allReqsMet &&
      s.captchaChecked &&
      !isLocked;

    // --------------------------------------------------------
    // Fila de requisito
    // --------------------------------------------------------
    const reqRow = (met, label, key) => `
      <div data-password-req="${key}" class="flex items-center gap-2 ${met ? "txt-lightgreen" : "txt-danger"
      }">
        ${
          met
          ? '<span class="font-bold">✓</span>'
          : '<span class="w-1.5 h-1.5 rounded-full bg-danger"></span>'
        }
        <span>${label}</span>
      </div>
  `;

    return `
      <div
        class="min-h-screen flex items-center justify-center p-4 md:p-10 relative bg-cover bg-center bg-no-repeat login-background"
        style="background-image: url('https://lh3.googleusercontent.com/aida/AP1WRLtz-1hSh7bGFI6kHCM4A6rmIdLN-t3muX9dLiWprggn-R4VoFBOBk_jJwkuk5Gyx6u8v1V29ulcJlnaqxXCaIafWK3tre1d5d-mPCu5cQHUZpb68F-PrSgjUIBJaWfW_8qXZPsp74DAEDcIoDOZmnkGMYPIpU9Nf1ha4ayJWIhJvhsW3e_H2ocYBgyCJwwmXCcWNFFQLgmUew7Ru5rNtb7qlJJO2qZpm3-YyrYM6b4_sZOvl0CtQ7Ns824')">

        <div class="absolute inset-0 bg-darkbl-80 z-0"></div>
        <main class="w-full max-w-[440px] flex flex-col items-center gap-4 z-10 relative">
          <div class="w-full bg-cremlg shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden border border-darkgr-40">

            <!-- Encabezado -->
            <div class="flex flex-col items-center gap-2 mb-1">
              ${renderLogo({
                size: "lg",
                showText: false
              })}

              <h1 class="font-display font-bold text-2xl md:text-3xl txt-darkbl text-center mt-2">App Cultura Bogotá</h1>
              <p class="font-body text-xs md:text-sm txt-primary text-center max-w-[320px]">Explora la cultura, el arte y los eventos más destacados de Bogotá</p>
            </div>

            <!-- Bloque de bloqueo -->
            ${
              isLocked
              ? `

            <div class="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-alert border br-danger mb-2 text-center animate-fadeIn">
              <span class="material-symbols-outlined txt-danger text-[40px]">lock</span>
              <h3 class="font-display text-lg font-bold txt-darkred">Acceso bloqueado temporalmente</h3>
              <p class="font-body text-xs txt-darkred">Se alcanzó el número máximo de intentos. Intenta nuevamente en unos minutos.</p>
              <div class="mt-2 font-label text-xs font-bold txt-danger bg-white/70 px-4 py-1.5 rounded-full border br-danger/20">Puedes volver a intentarlo en
                ${this.formatCountdown(s.timeLeftMs)}
              </div>
            </div>
            `: ""
            }

            <!-- Error de login -->
            ${s.showLoginError && !isLocked
              ? `
            <div class="flex items-start gap-3 p-3 rounded-xl bg-alert txt-darkred border br-danger/30 animate-shake">
            <span class="material-symbols-outlined text-[20px] mt-0.5">error</span>
            <div class="flex flex-col">
            <span class="font-label text-xs font-bold">El correo electrónico o la contraseña no son correctos.</span>
            <span class="font-label text-[11px] txt-danger mt-0.5 font-bold">Te quedan
            ${3 - AppState.failedLoginAttempts} intentos
            </span>
            </div>
            </div>
            `: ""
            }  

            <!-- FORMULARIO -->
            <form data-hook="login-form" class="flex flex-col gap-4">

              <!-- Correo -->
              <div class="flex flex-col gap-1">
                <label for="login-email" class="font-label text-xs txt-main ml-4 font-medium">Correo Electrónico</label>

                <div class="relative flex items-center rounded-full bg-crem border transition-all
                  ${isLocked ? "opacity-60 cursor-not-allowed br-darkgr" : ""}
                  ${s.emailTouched && s.email.length > 0
                    ? isEmailValid
                    ? "br-lightgreen focus-within:ring-1 focus-within-ring-lightgreen"
                    : "br-danger focus-within:ring-1 focus-within-ring-danger"
                    : "br-darkgr focus-within-border-darkbl"
                  }">
                  <span class="material-symbols-outlined absolute left-4 txt-muted text-[20px]">mail</span>
                  <input id="login-email" type="email" ${isLocked ? "disabled" : ""} value="${escapeHtml(s.email)}" placeholder="ejemplo@correo.com" class="w-full pl-11 pr-11 py-3 bg-transparent border-none rounded-full font-body text-sm outline-none focus:ring-0 txt-main placeholder-txt-muted" required/>
                  ${s.emailTouched && s.email.length > 0 && isEmailValid
                    ? `
                    <span class="material-symbols-outlined absolute right-4 txt-lightgreen text-[20px]">check_circle</span>
                    `: ""
                  }
                </div>
                ${s.emailTouched && s.email.length > 0 && !isEmailValid
                  ? `
                <span class="font-label text-[11px] txt-danger ml-4">Ingresa un correo electrónico válido.</span>
                `: ""
                }
              </div>

              <!-- Contraseña -->
              <div class="flex flex-col gap-1">
                <div class="flex justify-between items-center px-4">
                  <label for="login-password" class="font-label text-xs txt-main font-medium">Contraseña</label>
                  <button type="button" data-hook="login-forgot-btn" class="font-label text-[11px] txt-body hover:underline cursor-pointer">¿Olvidaste tu contraseña?</button>
                </div>
                <div class="relative flex items-center rounded-full bg-crem border br-darkgr transition-all
                  ${isLocked
                    ? "opacity-60 cursor-not-allowed"
                    : "focus-within-border-darkbl"
                  }">
                  <span class="material-symbols-outlined absolute left-4 txt-muted text-[20px]">lock</span>
                  <input id="login-password" type="${s.showPassword ? "text" : "password"}" ${isLocked ? "disabled" : ""} value="${escapeHtml(s.password)}"placeholder="Mínimo 8 caracteres" class="w-full pl-11 pr-12 py-3 bg-transparent border-none rounded-full font-body text-sm outline-none focus:ring-0 txt-main placeholder-txt-muted" required/>
                  <button type="button" data-hook="login-toggle-password" ${isLocked ? "disabled" : ""} class="absolute right-4 txt-muted hover-txt-darkbl transition-colors cursor-pointer">
                    <span class="material-symbols-outlined text-[20px]">${s.showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>

                <!-- Validador de contraseña -->
                ${!allReqsMet && s.password.length > 0
                  ? `
                <div class="flex flex-col gap-1.5 px-4 mt-2 bg-crem p-3 rounded-xl border border-darkgr-30">
                  <div class="flex items-center justify-between">
                    <span class="font-label text-xs font-bold txt-main">Requisitos de contraseña</span>
                    <div class="flex items-center gap-1">
                      <span class="font-label text-[11px] txt-primary">Fortaleza:</span>
                      <span data-password-strength-label class="font-label text-[11px] font-bold ${strengthColor}">${strengthLabel}</span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1 text-[11px] font-body mt-1">
                    ${reqRow(reqLen, "Mínimo 8 caracteres", "length")}
                    ${reqRow(reqUpper, "Una letra mayúscula (A-Z)", "upper")}
                    ${reqRow(reqLower, "Una letra minúscula (a-z)", "lower")}
                    ${reqRow(reqNum, "Un número (0-9)", "number")}
                    ${reqRow(reqSpec,"Un carácter especial (@#$!()?&%)","special",)}
                  </div>
                </div>
                `: ""
                }
              </div>

              <!-- CAPTCHA -->
              <div class="flex flex-col gap-1.5 mt-1">
                <label class="font-label text-xs txt-main ml-4 font-medium">Validación de seguridad</label>
                <div data-hook="login-captcha-box" class="flex items-center justify-between p-3.5 border rounded-2xl bg-crem transition-colors cursor-pointer
                  ${s.captchaChecked ? "br-darkbln bg-white" : "br-darkgr"}
                  ${isLocked ? "opacity-50 cursor-not-allowed" : ""}">
                  <div class="flex items-center gap-3">
                    <input type="checkbox" id="login-captcha-checkbox"
                      ${isLocked ? "disabled" : ""}
                      ${s.captchaChecked ? "checked" : ""} class="w-5 h-5 rounded br-muted txt-darkbl focus-ring-darkbl cursor-pointer"/>
                    <div class="flex flex-col">
                      <span class="font-body text-xs txt-main font-medium">Confirma que eres una persona</span>
                      <span class="font-label text-[10px] txt-primary">Requerido para continuar</span>
                    </div>
                  </div>
                  <span class="material-symbols-outlined txt-muted">shield_person</span>
                </div>
              </div>

              <!-- Botón ingresar -->
              <button type="submit" ${!isFormValid ? "disabled" : ""} class="w-full font-body font-semibold py-3.5 px-6 rounded-full shadow-md transition-all mt-2 cursor-pointer ${isFormValid? "bg-darkbl hover:bg-black text-white active:scale-95": "bg-soft txt-muted cursor-not-allowed"}">Ingresar</button>
            </form>

            <!-- Error social -->
            ${s.socialAuthError
              ? `
            <div class="flex items-start gap-2.5 p-3 rounded-xl bg-alert txt-darkred border border-danger-30 animate-fadeIn text-xs font-label">
              <span class="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">info</span>
              <span class="flex-1 font-medium">${escapeHtml(s.socialAuthError)}</span>
              <button type="button" data-hook="login-dismiss-social-error" class="txt-darkred hover:opacity-75 cursor-pointer ml-1">
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            ` : ""
            }

            <!-- Separador -->
            <div class="flex items-center gap-2 my-2">
              <div class="h-[1px] flex-1 bg-darkgr-50"></div>
              <span class="font-label text-[10px] txt-primary uppercase tracking-widest px-1">o ingresa con</span>
              <div class="h-[1px] flex-1 bg-darkgr-50">
              </div>
            </div>

            <!-- Login social -->
            <div class="flex gap-3">
              <button type="button" data-hook="login-google-btn" class="flex-1 flex items-center justify-center py-2.5 border br-darkgr rounded-full text-xs font-label txt-primary hover-bg-crem transition-colors cursor-pointer">Google</button>
              <button type="button" data-hook="login-facebook-btn" class="flex-1 flex items-center justify-center py-2.5 border br-darkgr rounded-full text-xs font-label txt-primary hover-bg-crem transition-colors cursor-pointer">Facebook</button>
            </div>

            <p class="font-body text-xs txt-main text-center mt-2">¿Aún no eres parte?
              <a href="register.html" data-hook="login-goto-register" class="txt-body font-bold ml-1 hover:underline cursor-pointer no-underline">Regístrate aquí</a>
            </p>
          </div>
        </main>

        <!-- Modal CAPTCHA -->
        ${s.showCaptchaModal ? `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn" >
          <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 border br-darkgr">
            <h3 class="font-display font-bold text-lg txt-darkbl">Verificación Humana</h3>
            <p class="font-body text-xs txt-primary">Por motivos de seguridad, por favor valida el siguiente campo antes de ingresar.</p>
            <label class="cursor-pointer flex items-center justify-between p-3 border br-darkgr rounded-xl hover-bg-crem transition-colors">
              <div class="flex items-center gap-3">
                <input type="checkbox" id="login-captcha-modal-checkbox" ${s.captchaChecked ? "checked" : ""} class="w-5 h-5 rounded br-muted txt-darkbl"/>
                <span class="font-body text-sm font-medium txt-main">No soy un robot</span>
              </div>
              <span class="material-symbols-outlined txt-darkbl">verified_user</span>
            </label>
            <button data-hook="login-captcha-modal-continue" ${!s.captchaChecked ? "disabled" : ""} class="w-full py-3 rounded-full font-body font-semibold text-sm transition-all ${s.captchaChecked 
              ? "bg-darkbl text-white hover:bg-black"
              : "bg-soft txt-muted cursor-not-allowed"}">Continuar</button>
          </div>
        </div>
        ` : ""
        }

        <!-- Modal recuperar contraseña -->
        ${s.showForgotModal ? `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 border br-darkgr" >
            <div class="flex justify-between items-center" >
              <h3 class="font-display font-bold text-lg txt-darkbl">Recuperación de Contraseña</h3>
              <button data-hook="login-forgot-close" class="p-1 txt-muted hover-txt-darkbl">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            ${s.forgotSent
              ? `
            <div class="flex flex-col items-center gap-3 py-4 text-center animate-fadeIn">
              <span class="material-symbols-outlined text-[48px] txt-lightgreen">mark_email_read</span>
              <p class="font-body text-sm txt-main font-medium">Enlace enviado a tu correo</p>
              <p class="font-body text-xs txt-primary"> Hemos enviado las instrucciones para restablecer tu contraseña a<strong>${escapeHtml(s.email)}</strong>.</p>

              <button data-hook="login-forgot-understood" class="w-full mt-2 py-2.5 rounded-full bg-darkbl text-white font-label font-bold text-xs">Entendido</button>
            </div>
            `
            : `
            <div class="flex flex-col gap-3">
              <p class="font-body text-xs txt-primary">Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.</p>
              <div class="flex flex-col gap-1">
                <label class="font-label text-xs font-medium txt-main">Correo Electrónico</label>
                <input type="email" id="login-forgot-email" value="${escapeHtml(s.email)}" class="w-full bg-crem border br-darkgr rounded-lg px-3 py-2 font-body text-sm outline-none focus-border-darkbl" placeholder="ejemplo@correo.com"/>
              </div>
              <button data-hook="login-forgot-send" ${!s.isEmailValid || !s.email ? "disabled" : ""} class="w-full py-3 rounded-full font-body font-semibold text-xs mt-2 transition-all ${s.isEmailValid && s.email
                ? "bg-darkbl text-white hover:bg-black cursor-pointer"
                : "bg-soft txt-muted cursor-not-allowed"
              }">Enviar enlace de recuperación</button>
            </div>
            `}
          </div>
        </div>
        `: ""
        }
      </div>
    `;
  },

  // ------------------------------------------------------------
  // Eventos
  // ------------------------------------------------------------
  bindEvents(container) {
    const s = this.state;

    // --------------------------------------------------------
    // Correo
    // --------------------------------------------------------
    const emailInput = container.querySelector("#login-email");

    if (emailInput) {
      emailInput.addEventListener("input", (e) => {
        s.email = e.target.value;
        s.emailTouched = true;
        s.isEmailValid = this.validateEmailFormat(e.target.value);

        const submitBtn = container.querySelector('[data-hook="login-form"] button[type="submit"]',
        );

        if (submitBtn) {
          const isLocked = AppState.lockoutUntil !== null && Date.now() < AppState.lockoutUntil;
          const canSubmit =
            s.email.length > 0 &&
            s.isEmailValid &&
            s.password.length >= 8 &&
            s.captchaChecked &&
            !isLocked;

          submitBtn.disabled = !canSubmit;
        }
      });
    }

    // --------------------------------------------------------
    // Contraseña
    // --------------------------------------------------------
    const passwordInput = container.querySelector("#login-password");

    if (passwordInput) {
      passwordInput.addEventListener("input", (e) => {
        s.password = e.target.value;

        const password = s.password;
        const reqLen = password.length >= 8;
        const reqUpper = /[A-Z]/.test(password);
        const reqLower = /[a-z]/.test(password);
        const reqNum = /[0-9]/.test(password);
        const reqSpec = /[@#$!()?&%]/.test(password);
        const updateRequirement = (selector, met) => {
          const element = container.querySelector(selector);
          if (!element) {
            return;
          }

          element.className = `flex items-center gap-2 ${met ? "txt-lightgreen" : "txt-danger"}`;
          element.innerHTML = met
            ? '<span class="font-bold">✓</span>'
            : '<span class="w-1.5 h-1.5 rounded-full bg-danger"></span>';
        };

        updateRequirement('[data-password-req="length"]', reqLen);
        updateRequirement('[data-password-req="upper"]', reqUpper);
        updateRequirement('[data-password-req="lower"]', reqLower);
        updateRequirement('[data-password-req="number"]', reqNum);
        updateRequirement('[data-password-req="special"]', reqSpec);

        const strengthLabel = container.querySelector("[data-password-strength-label]");
        const strengthCount = [reqLen, reqUpper, reqLower, reqNum, reqSpec].filter(Boolean).length;

        if (strengthLabel) {
          strengthLabel.textContent =
            strengthCount === 5 ? "Fuerte" : strengthCount >= 3 ? "Media" : "Débil";
          
          strengthLabel.className = `font-label text-[11px] font-bold ${
            strengthCount === 5 ? "txt-lightgreen" : strengthCount >= 3 ? "txt-label" : "txt-danger"
          }`;
        }

        const submitBtn = container.querySelector('[data-hook="login-form"] button[type="submit"]');

        if (submitBtn) {
          const isLocked = AppState.lockoutUntil !== null && Date.now() < AppState.lockoutUntil;

          submitBtn.disabled = !(
            s.email.length > 0 &&
            s.isEmailValid &&
            password.length >= 8 &&
            s.captchaChecked &&
            !isLocked
          );
        }
      });
    }

    // --------------------------------------------------------
    // Mostrar / ocultar contraseña
    // --------------------------------------------------------
    const togglePwBtn = container.querySelector('[data-hook="login-toggle-password"]');

    if (togglePwBtn) {
      togglePwBtn.addEventListener("click", () => {
        s.showPassword = !s.showPassword;
        this.update();
      });
    }

    // --------------------------------------------------------
    // Recuperar contraseña
    // --------------------------------------------------------
    const forgotBtn = container.querySelector('[data-hook="login-forgot-btn"]');

    if (forgotBtn) {
      forgotBtn.addEventListener("click", () => {
        s.forgotSent = false;
        s.showForgotModal = true;
        this.update();
      });
    }

    // --------------------------------------------------------
    // CAPTCHA principal
    // --------------------------------------------------------
    const captchaBox = container.querySelector('[data-hook="login-captcha-box"]');
    
    if (captchaBox) {
      captchaBox.addEventListener("click", (e) => {
        if (e.target && e.target.id === "login-captcha-checkbox") {
          return;
        }

        const isLocked =
          AppState.lockoutUntil !== null && Date.now() < AppState.lockoutUntil;
        if (!isLocked) {
          s.captchaChecked = !s.captchaChecked;
          this.update();
        }
      });

      const captchaCheckbox = container.querySelector("#login-captcha-checkbox");

      if (captchaCheckbox) {
        captchaCheckbox.addEventListener("change", (e) => {
          if (AppState.lockoutUntil !== null && Date.now() < AppState.lockoutUntil) {
            return;
          }

          s.captchaChecked = e.target.checked;
          this.update();
        });
      }
    }

    // --------------------------------------------------------
    // Formulario
    // --------------------------------------------------------
    const form = container.querySelector('[data-hook="login-form"]');

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.authenticate();
      });
    }

    // --------------------------------------------------------
    // Error social
    // --------------------------------------------------------
    const dismissSocialError = container.querySelector('[data-hook="login-dismiss-social-error"]');

    if (dismissSocialError) {
      dismissSocialError.addEventListener("click", () => {
        s.socialAuthError = null;
        this.update();
      });
    }

    // --------------------------------------------------------
    // Google
    // --------------------------------------------------------
    const googleBtn = container.querySelector('[data-hook="login-google-btn"]');
    
    if (googleBtn) {
      googleBtn.addEventListener("click", () => this.handleGoogleLogin());
    }

    // --------------------------------------------------------
    // Facebook
    // --------------------------------------------------------
    const facebookBtn = container.querySelector('[data-hook="login-facebook-btn"]');
    
    if (facebookBtn) {
      facebookBtn.addEventListener("click", () => this.handleFacebookLogin());
    }

    // --------------------------------------------------------
    // CAPTCHA modal
    // --------------------------------------------------------
    const captchaModalCheckbox = container.querySelector("#login-captcha-modal-checkbox");

    if (captchaModalCheckbox) {
      captchaModalCheckbox.addEventListener("change", (e) => {
        s.captchaChecked = e.target.checked;
        this.update();
      });
    }

    const captchaModalContinue = container.querySelector('[data-hook="login-captcha-modal-continue"]');

    if (captchaModalContinue) {
      captchaModalContinue.addEventListener("click", () => {
        if (s.captchaChecked) {
          s.showCaptchaModal = false;
          this.authenticate();
        }
      });
    }

    // --------------------------------------------------------
    // Cerrar recuperación
    // --------------------------------------------------------
    const forgotClose = container.querySelector('[data-hook="login-forgot-close"]');

    if (forgotClose) {
      forgotClose.addEventListener("click", () => {
        s.showForgotModal = false;
        this.update();
      });
    }

    // --------------------------------------------------------
    // Correo recuperación
    // --------------------------------------------------------
    const forgotEmailInput = container.querySelector("#login-forgot-email");

    if (forgotEmailInput) {
      forgotEmailInput.addEventListener("input", (e) => {
        s.email = e.target.value;
        s.isEmailValid = this.validateEmailFormat(e.target.value);
        this.update();
      });
    }

    // --------------------------------------------------------
    // Enviar recuperación
    // --------------------------------------------------------
    const forgotSendBtn = container.querySelector('[data-hook="login-forgot-send"]');

    if (forgotSendBtn) {
      forgotSendBtn.addEventListener("click", () => {
        s.forgotSent = true;
        this.update();
      });
    }

    // --------------------------------------------------------
    // Entendido
    // --------------------------------------------------------
    const forgotUnderstood = container.querySelector('[data-hook="login-forgot-understood"]');

    if (forgotUnderstood) {
      forgotUnderstood.addEventListener("click", () => {
        s.showForgotModal = false;
        this.update();
      });
    }
  },

  // ------------------------------------------------------------
  // Autenticación
  // ------------------------------------------------------------
  async authenticate() {
    const s = this.state;

    const isLocked = AppState.lockoutUntil !== null && Date.now() < AppState.lockoutUntil;
    if (isLocked) {
      return;
    }

    if (!s.captchaChecked) {
      s.showCaptchaModal = true;
      this.update();
      return;
    }
    // Envía las credenciales al endpoint de autenticación de Spring Boot.
    try {
      const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              correo: s.email.trim(),
              contrasena: s.password
          })
      });

      const resultado = await response.json();
      // Registra el intento fallido y activa el bloqueo temporal después de tres intentos.
      if (!response.ok || !resultado.ok) {
        if (response.status === 401) {
          const newAttempts = AppState.failedLoginAttempts + 1;

          AppState.setFailedLoginAttempts(newAttempts);
          s.showLoginError = true;

          if (newAttempts >= 3) {
            AppState.setLockoutUntil(Date.now() + 5 * 60 * 1000);
            this._startLockoutTimer();
          }
          this.update();
          return;
        }
        throw new Error(resultado.mensaje || "No fue posible validar el ingreso.");
      }

      // ----------------------------------------------------
      // Credenciales correctas
      // ----------------------------------------------------
      AppState.setFailedLoginAttempts(0);
      AppState.setLockoutUntil(null);
      AppState.setUser(resultado.usuario);

      window.location.replace("/pages/home.html");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      s.showLoginError = true;
      this.update();
    }
  },

  // ------------------------------------------------------------
  // Google
  // ------------------------------------------------------------
  handleGoogleLogin() {
    this.state.socialAuthError = null;
    const googleClientId =
      window.__ENV__ && window.__ENV__.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      this.state.socialAuthError =
        "El inicio de sesión con Google requiere configurar la variable VITE_GOOGLE_CLIENT_ID.";
      
        this.update();
      return;
    }

    const redirectUri = window.location.origin + "/";
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: "id_token token",
      scope: "openid email profile",
      nonce: Date.now().toString()
    });

    const popup = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      "google_oauth_popup",
      "width=500,height=600"
    );

    if (!popup) {
      this.state.socialAuthError =
        "Habilita las ventanas emergentes (popups) para iniciar sesión con Google.";
      this.update();
    }
  },

  // ------------------------------------------------------------
  // Facebook
  // ------------------------------------------------------------
  handleFacebookLogin() {
    this.state.socialAuthError = null;

    const facebookAppId = window.__ENV__ && window.__ENV__.VITE_FACEBOOK_APP_ID;
    if (!facebookAppId) {
      this.state.socialAuthError =
        "El inicio de sesión con Facebook requiere configurar la variable VITE_FACEBOOK_APP_ID.";
      this.update();
      return;
    }

    const redirectUri = window.location.origin + "/";
    const params = new URLSearchParams({
      client_id: facebookAppId,
      redirect_uri: redirectUri,
      response_type: "token",
      scope: "email,public_profile"
    });

    const popup = window.open(
      `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`,
      "facebook_oauth_popup",
      "width=500,height=600"
    );

    if (!popup) {
      this.state.socialAuthError =
        "Habilita las ventanas emergentes (popups) para iniciar sesión con Facebook.";
      this.update();
    }
  },

  // ------------------------------------------------------------
  // Bloqueo temporal
  // ------------------------------------------------------------
  _startLockoutTimer() {
    if (this._lockoutInterval) {
      clearInterval(this._lockoutInterval);
    }
    if (AppState.lockoutUntil && Date.now() < AppState.lockoutUntil) {
      this._lockoutInterval = setInterval(() => {
        const remaining = AppState.lockoutUntil - Date.now();
        
        if (remaining <= 0) {
          clearInterval(this._lockoutInterval);

          AppState.setLockoutUntil(null);
          AppState.setFailedLoginAttempts(0);
          
          this.state.timeLeftMs = 0;
        } else {
          this.state.timeLeftMs = remaining;
        }
        this.update();
      }, 1000);
    }
  },

  // ------------------------------------------------------------
  // Mensajes OAuth
  // ------------------------------------------------------------
  setupMessageListener() {
    this._messageHandler = async (event) => {
      const origin = event.origin;
      if (
        !origin.endsWith(".run.app") &&
        !origin.includes("localhost") &&
        !origin.includes("127.0.0.1")
      ) {
        return;
      }

      if (event.data && event.data.type === "OAUTH_AUTH_SUCCESS") {
        const { accessToken, idToken, provider } = event.data;
        
        try {
          let userEmail = "";
          let userName = "Usuario";
          let userLastname = provider === "facebook" ? "Facebook" : "Google";

          // ----------------------------------------
          // ID Token
          // ----------------------------------------
          if (idToken) {
            const base64Url = idToken.split(".")[1];

            if (base64Url) {
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split("")
                  .map(
                    (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                  .join("")
              );

              const payload = JSON.parse(jsonPayload);
              userEmail = payload.email || "";
              userName = payload.given_name || payload.name || "Usuario";
              userLastname = payload.family_name || "Google";
            }
          } else if (accessToken) {

            // ------------------------------------
            // Facebook
            // ------------------------------------
            if (provider === "facebook") {
              const res = await fetch(
                `https://graph.facebook.com/me?fields=name,email,first_name,last_name&access_token=${accessToken}`
              );

              if (res.ok) {
                const fbData = await res.json();
                userEmail = fbData.email || "";
                userName = fbData.first_name || fbData.name || "Usuario";
                userLastname = fbData.last_name || "Facebook";
              }
            } else {

              // --------------------------------
              // Google
              // --------------------------------
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo",{
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                });

              if (res.ok) {
                const gData = await res.json();
                userEmail = gData.email || "";
                userName = gData.given_name || gData.name || "Usuario";
                userLastname = gData.family_name || "Google";
              }
            }
          }

          // ----------------------------------------
          // Usuario social
          // ----------------------------------------
          if (userEmail) {
            const existingUserStr = localStorage.getItem("culturatech_user");
            let matchedUser = null;

            if (existingUserStr) {
              const parsed = JSON.parse(existingUserStr);
              
              if (parsed.email && parsed.email.toLowerCase() === userEmail.toLowerCase()) {
                matchedUser = parsed;
              }
            }

            const finalUser = matchedUser || {
              name: userName,
              lastname: userLastname,
              cedula: "N/A",
              birthdate: "",
              email: userEmail
            };

            AppState.setUser(finalUser);

            // OTP eliminado:
            // no usamos pendingLoginEmail
            window.location.href = "home.html";
          } else {
              this.state.socialAuthError =
              "No fue posible obtener el correo del proveedor. Intenta nuevamente.";
            
              this.update();
          }
        } catch (err) {
          console.error("Error procesando autenticación social:", err);

          this.state.socialAuthError = "No se pudo completar el inicio de sesión con el proveedor.";
          
          this.update();
        }
      } else if (event.data && event.data.type === "OAUTH_AUTH_ERROR") {
        this.state.socialAuthError =
          event.data.message || "El proveedor de autenticación no pudo validar la sesión.";
        
          this.update();
      }
    };

    window.addEventListener("message", this._messageHandler);
  },

  // ------------------------------------------------------------
  // Actualizar interfaz
  // ------------------------------------------------------------
  update() {
    this.withFocusPreserved(() => {
      this._container.innerHTML = this.render();
      this.bindEvents(this._container);
    });
  },

  // ------------------------------------------------------------
  // Inicialización
  // ------------------------------------------------------------
  init() {
    AppState.init();
    this._container = document.getElementById("page-content");

    // Popup OAuth
    if (window.opener && window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      const idToken = params.get("id_token");

      if (accessToken || idToken) {
        window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS", accessToken, idToken }, "*");
        
        window.close();
      }
    }

    if (!this._container.innerHTML.trim()) {
      this._container.innerHTML = this.render();
    }
    this.bindEvents(this._container);
    this.setupMessageListener();
    this._startLockoutTimer();
  }
};

// ------------------------------------------------------------
// Inicio
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => LoginPage.init());