// ============================================================
// logo.js — Traducción directa de src/components/Logo.tsx
// ============================================================

const LOGO_IMG_SRC = '../assets/images/logo_CulturaTechBG.png';
function renderLogo(props = {}) {
  const {
    size = 'md',
    showText = true,
    titleText = 'CulturaTech Bogotá',
    className = '',
    dataAction = '',
    variant = 'light',
    containerBgClass = null,
    textColorClass = null
  } = props;

  const sizeMap = {
    sm: { img: 'w-11 h-11 rounded-lg p-0.5', text: 'text-base md:text-lg' },
    md: { img: 'w-12 h-12 rounded-xl p-1', text: 'text-xl md:text-2xl' },
    lg: { img: 'w-20 h-20 rounded-2xl p-1.5', text: 'text-2xl md:text-3xl' },
    xl: { img: 'w-28 h-28 rounded-2xl p-2', text: 'text-3xl md:text-4xl' }
  };

  const currentSize = sizeMap[size];

  const defaultBg =
    variant === 'dark'
      ? 'bg-lightbl border border-white/15 shadow-sm'
      : variant === 'transparent'
      ? 'bg-transparent border-0'
      : 'bg-white border border-darkgr-40 shadow-sm';

  const defaultTextColor = variant === 'dark' ? 'text-white' : 'txt-darkbl';

  const finalContainerBg = containerBgClass || defaultBg;
  const finalTextColor = textColorClass || defaultTextColor;

  return `
    <div class="flex items-center gap-2.5 select-none ${dataAction ? 'cursor-pointer' : ''} ${className}" ${
    dataAction ? `data-action="${dataAction}"` : ''
  }>
      <div class="${currentSize.img} overflow-hidden flex-shrink-0 flex items-center justify-center transition-all ${finalContainerBg}">
        <img src="${LOGO_IMG_SRC}" alt="CulturaTech Bogotá Logo" class="w-full h-full object-contain rounded-md" referrerpolicy="no-referrer" />
      </div>
      ${
        showText
          ? `<span class="font-display font-bold tracking-tight ${finalTextColor} ${currentSize.text}">${titleText}</span>`
          : ''
      }
    </div>
  `;
}
