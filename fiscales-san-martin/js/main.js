/* =========================================================
   Fiscales San Martín S.A. — comportamiento de la web
   ========================================================= */

// PENDIENTE: URL del servicio que recibirá los mensajes del formulario
// (por ejemplo Formspree: 'https://formspree.io/f/xxxxxxxx').
// Mientras esté vacía, el formulario muestra un aviso en lugar de enviar.
const FORM_ENDPOINT = '';

// PENDIENTE: confirmar si el número de WhatsApp es un móvil o un fijo con WhatsApp Business.
//   Móvil (por defecto):            '5491152637450'
//   Fijo con WhatsApp Business:     '541152637450'
const WHATSAPP_NUMBER = '5491152637450';
const WHATSAPP_MESSAGE = 'Hola, quiero información sobre sus servicios de depósito fiscal.';

// PENDIENTE: confirmar el email. El dominio (fiscalessanmartin.com) no coincide
// con el de la web actual (fiscalsanmartin.ar). Si cambia, actualizarlo también en index.html.
const CONTACT_EMAIL = 'comercial@fiscalessanmartin.com';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Enlaces de WhatsApp ---------- */
const waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href = waUrl; });

/* ---------- Menú móvil ---------- */
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('menu-principal');
function setMenu(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
});

/* ---------- Sección activa en el menú ---------- */
const navLinks = [...nav.querySelectorAll('a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        const on = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}

/* ---------- Aparición al hacer scroll y contadores ---------- */
const nf = new Intl.NumberFormat('es-AR');
function runCounter(el) {
  const target = Number(el.dataset.count);
  const fmt = v => el.dataset.format === 'thousands' ? nf.format(v) : String(v);
  if (reduceMotion) { el.textContent = fmt(target); return; }
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  }
  el.textContent = fmt(0);
  requestAnimationFrame(step);
}

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('[data-count]').forEach(runCounter);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* ---------- Formulario de contacto ---------- */
const form = document.getElementById('contact-form');
const statusBox = document.getElementById('form-status');
const submitBtn = form.querySelector('button[type="submit"]');

const RULES = {
  nombre: v => v.trim() ? '' : 'Escriba su nombre.',
  email: v => !v.trim() ? 'Escriba su email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revise el email: debe tener el formato nombre@empresa.com.',
  mensaje: v => v.trim() ? '' : 'Escriba su consulta.'
};

function validateField(name) {
  const input = form.elements[name];
  const msg = RULES[name](input.value);
  const err = document.getElementById('e-' + name);
  err.textContent = msg;
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}
Object.keys(RULES).forEach(name => {
  form.elements[name].addEventListener('blur', () => { if (form.elements[name].value) validateField(name); });
  form.elements[name].addEventListener('input', () => { if (form.elements[name].getAttribute('aria-invalid') === 'true') validateField(name); });
});

function showStatus(type, html) {
  const icon = type === 'ok' ? 'i-circle-check' : 'i-circle-alert';
  statusBox.className = 'form-status ' + type;
  statusBox.innerHTML = '<svg class="i" aria-hidden="true"><use href="#' + icon + '"/></svg><p>' + html + '</p>';
  statusBox.hidden = false;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const invalid = Object.keys(RULES).filter(name => !validateField(name));
  if (invalid.length) {
    showStatus('error', 'Faltan datos o hay campos con errores. Revise los campos marcados.');
    form.elements[invalid[0]].focus();
    return;
  }

  const contactLinks = 'escríbanos a <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> o por <a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a>';

  if (!FORM_ENDPOINT) {
    showStatus('warn', 'La consulta no se envió: el formulario todavía no está conectado a un servicio de envío. Mientras tanto, ' + contactLinks + '.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';
  try {
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    showStatus('ok', 'Consulta enviada. El equipo comercial le responderá a la brevedad.');
  } catch (err) {
    showStatus('error', 'No pudimos enviar la consulta. Inténtelo de nuevo en unos minutos o ' + contactLinks + '.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar consulta';
  }
});
