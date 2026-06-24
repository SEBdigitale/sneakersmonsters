const WHATSAPP_PHONE = '14385966455';

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobileMenu');
if (toggle && menu) {
  const closeMenu = () => { menu.hidden = true; toggle.setAttribute('aria-expanded','false'); };
  const openMenu = () => { menu.hidden = false; toggle.setAttribute('aria-expanded','true'); };
  toggle.addEventListener('click', (e) => { e.stopPropagation(); menu.hidden ? openMenu() : closeMenu(); });
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

function fieldLabel(field) {
  const explicit = field.closest('label')?.innerText?.trim();
  if (explicit) return explicit;
  if (field.getAttribute('placeholder')) return field.getAttribute('placeholder');
  const name = field.getAttribute('name') || 'Field';
  return name.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').replace(/^./, c => c.toUpperCase());
}

function getFormMessage(form) {
  const isFrench = document.documentElement.lang === 'fr';
  const intro = form.dataset.whatsappIntro || (isFrench
    ? 'Salut Sneakers Monsters, je viens du site web. Voici ma demande :'
    : "Hi Sneakers Monsters, I’m coming from the website. Here is my request:");
  const formType = form.dataset.form === 'lead-magnet'
    ? (isFrench ? 'Guide gratuit Sneakers Monsters' : 'Free Sneakers Monsters Guide')
    : (isFrench ? 'Demande Sneakers Monsters' : 'Sneakers Monsters Request');
  const pageTitle = document.title || 'Sneakers Monsters';
  const lines = [intro, '', `Type: ${formType}`, `Page: ${pageTitle}`];

  const fields = form.querySelectorAll('input, select, textarea');
  fields.forEach(field => {
    if (!field.name || field.type === 'hidden' || field.type === 'submit') return;
    if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
    const value = field.type === 'checkbox' ? 'Yes' : (field.value || '').trim();
    if (!value) return;
    lines.push(`${fieldLabel(field)}: ${value}`);
  });

  lines.push('');
  lines.push(isFrench
    ? 'Peux-tu me répondre ici sur WhatsApp?'
    : 'Can you reply to me here on WhatsApp?');
  return lines.join('\n');
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
}

document.querySelectorAll('form').forEach(form => form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const btn = form.querySelector('button[type="submit"]');
  const original = btn ? btn.textContent : '';
  const isFrench = document.documentElement.lang === 'fr';
  if (btn) btn.textContent = isFrench ? 'OUVERTURE WHATSAPP...' : 'OPENING WHATSAPP...';
  form.classList.add('form-submitted');
  openWhatsApp(getFormMessage(form));
  setTimeout(()=> {
    if (btn) btn.textContent = original;
    form.classList.remove('form-submitted');
  }, 1800);
}));
