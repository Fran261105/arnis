/* ==========================================================================
   Fiscales San Martín S.A. – JavaScript
   ========================================================================== */

// PENDIENTE: URL del servicio que recibirá los mensajes del formulario
// (por ejemplo Formspree: "https://formspree.io/f/xxxxxxxx").
// Mientras esté vacía, el formulario muestra un aviso en lugar de enviar.
const FORM_ENDPOINT = "";

// PENDIENTE: confirmar si el número es un celular o un fijo con WhatsApp Business.
//   Celular (por defecto):          "5491152637450"
//   Fijo con WhatsApp Business:     "541152637450"
const WHATSAPP_NUMBER = "5491152637450";
const WHATSAPP_MESSAGE = "Hola, quiero información sobre sus servicios de depósito fiscal.";

// REVISAR: el dominio del correo no coincide con el de la web actual (fiscalsanmartin.ar).
const CONTACT_EMAIL = "comercial@fiscalessanmartin.com";

(function () {
  "use strict";

  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Enlaces de WhatsApp ---------- */
  const waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = waUrl; });

  /* ---------- Cabecera y menú móvil ---------- */
  const header = document.getElementById("cabecera");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("menu-principal");
  const toggleLabel = toggle.querySelector(".visually-hidden");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    toggleLabel.textContent = open ? "Cerrar menú" : "Abrir menú";
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
  });

  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Sección activa en el menú ---------- */
  const navLinks = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
  const sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          const active = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contador de cifras ---------- */
  function formatNumber(n, format) {
    return format === "miles" ? n.toLocaleString("es-AR") : String(n);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const format = el.dataset.format;
    const duration = 1400;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatNumber(Math.round(target * eased), format);
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll(".counter");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.textContent = "0";
      counterObserver.observe(el);
    });
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById("form-contacto");
  const statusBox = document.getElementById("form-status");
  const submitBtn = form.querySelector("button[type='submit']");
  const submitLabel = submitBtn.querySelector(".btn-label");

  const rules = {
    nombre: function (v) { return v.trim() ? "" : "Ingrese su nombre."; },
    email: function (v) {
      if (!v.trim()) return "Ingrese su email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Ingrese un email válido (por ejemplo, nombre@empresa.com).";
    },
    mensaje: function (v) { return v.trim() ? "" : "Escriba su consulta."; }
  };

  function validateField(name) {
    const input = form.elements[name];
    const msg = rules[name](input.value);
    const field = input.closest(".field");
    field.classList.toggle("has-error", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    document.getElementById("e-" + name).textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    const input = form.elements[name];
    input.addEventListener("blur", function () { if (input.value) validateField(name); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validateField(name);
    });
  });

  function showStatus(type, html) {
    statusBox.className = "form-status is-" + type;
    statusBox.innerHTML = html;
    statusBox.hidden = false;
  }

  const fallbackContact =
    'Mientras tanto, puede escribirnos a <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + "</a>" +
    ' o por <a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp</a>.';

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusBox.hidden = true;

    let firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) {
      showStatus("error", "Revise los campos marcados para poder enviar la consulta.");
      firstInvalid.focus();
      return;
    }

    // Trampa anti-spam: si un bot completó el campo oculto, no enviar.
    if (form.elements._gotcha.value) return;

    if (!FORM_ENDPOINT) {
      showStatus("warning",
        "<strong>El formulario todavía no está conectado.</strong> Su mensaje no fue enviado. " + fallbackContact);
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = "Enviando…";

    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        showStatus("success", "<strong>¡Gracias! Su consulta fue enviada.</strong> Le responderemos a la brevedad.");
      })
      .catch(function () {
        showStatus("error", "<strong>No pudimos enviar su consulta.</strong> Intente nuevamente en unos minutos. " + fallbackContact);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitLabel.textContent = "Enviar consulta";
      });
  });
})();
