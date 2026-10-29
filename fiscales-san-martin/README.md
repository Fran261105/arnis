# Web de Fiscales San Martín S.A.

Web de una sola página, hecha con HTML, CSS y JavaScript simple (sin frameworks).
Se puede abrir con doble clic en `index.html` y subir tal cual a cualquier hosting.

```
index.html       Contenido y textos de la web
css/styles.css   Colores, tipografía y diseño
js/main.js       Menú, animaciones, formulario y WhatsApp
img/             Logo y fotos (vacía por ahora)
```

## Datos pendientes

Todos los huecos están marcados con la palabra **PENDIENTE**. Para encontrarlos, busque `PENDIENTE` en `index.html` y `js/main.js`.
Los que se ven en la página aparecen con fondo amarillo y borde punteado.

## Cómo cambiar…

### Textos
Están todos en `index.html`, ordenados por sección (`INICIO`, `CIFRAS`, `LA EMPRESA`, `SERVICIOS`, `INSTALACIONES`, `CONTACTO`, `PIE`).
Edite el texto entre las etiquetas sin tocar lo que está entre `< >`.

### Teléfono, email y dirección
Aparecen en varios sitios de `index.html` (bloque `application/ld+json` del principio, sección Contacto y pie).
Busque el dato antiguo y reemplácelo en todos los lugares. El email también está en `CONTACT_EMAIL` en `js/main.js`.

### WhatsApp
En `js/main.js`, cambie `WHATSAPP_NUMBER`:
- Móvil: `5491152637450` (valor actual)
- Fijo con WhatsApp Business: `541152637450`

El mensaje precargado está en `WHATSAPP_MESSAGE`. Todos los botones de WhatsApp toman estos valores automáticamente.

### Formulario
1. Cree un formulario en un servicio como [Formspree](https://formspree.io) y copie la URL de envío.
2. Péguela en `FORM_ENDPOINT` al principio de `js/main.js`.

Mientras `FORM_ENDPOINT` esté vacío, el formulario no envía nada y muestra un aviso con el email y WhatsApp.

### Logo
1. Guarde el logo en `img/logo.svg` (o `.png`).
2. En `index.html`, dentro de `<a class="brand">`, reemplace el bloque `<span class="brand-text">…</span>` por:
   `<img src="img/logo.svg" alt="Fiscales San Martín S.A." width="180" height="48">`
3. En el pie, reemplace `<div class="logo-slot">…</div>` por la misma imagen (en versión clara si el fondo es oscuro).

### Fotos del depósito
1. Guarde las fotos en `img/` (unos 1600 px de ancho, comprimidas en JPG o WebP).
2. En la sección `INSTALACIONES` de `index.html`, reemplace cada `<figure class="photo-slot">…</figure>` por:
   ```html
   <figure class="photo"><img src="img/deposito-1.jpg" alt="Qué se ve en la foto" loading="lazy" width="1600" height="1200"></figure>
   ```
   `loading="lazy"` hace que las fotos se carguen solo al llegar a la galería.

### Foto de fondo del inicio
En `css/styles.css`, en la regla `.hero`, cambie `background` por:
```css
background: linear-gradient(rgba(15, 42, 74, .82), rgba(15, 42, 74, .82)), url("../img/hero.jpg") center / cover;
```
La capa azul semitransparente mantiene el texto legible.

### Colores
Al principio de `css/styles.css`, en `:root`. Si la marca tiene colores propios, cambie `--navy`, `--blue` y `--accent`.

## Notas
- Los íconos son de [Lucide](https://lucide.dev) (licencia ISC) y están incluidos dentro de `index.html`.
- El mapa usa la búsqueda de Google Maps por dirección y se carga en diferido.
- El bloque `application/ld+json` del principio describe a la empresa para los buscadores (dirección, teléfono, email y horario 24/7).
