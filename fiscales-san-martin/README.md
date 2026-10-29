# Web de Fiscales San Martín S.A.

Sitio de una sola página, hecho con HTML, CSS y JavaScript simples (sin frameworks ni instalación).

- **Ver en local:** abrir `index.html` con doble clic.
- **Publicar:** subir la carpeta completa (`index.html`, `css/`, `js/`, `img/`) a cualquier hosting.

```
index.html      Contenido de la página (todos los textos)
css/styles.css  Estilos (colores y medidas al principio del archivo)
js/main.js      Menú, animaciones, formulario y WhatsApp (configuración al principio)
img/            Logo, favicon y fotos
```

## Buscar lo que falta

Todo lo pendiente está marcado con la palabra **PENDIENTE** (y **REVISAR** para el email).
Buscar esas palabras en `index.html`, `js/main.js` y `img/favicon.svg`. En la página, los huecos
visibles aparecen en recuadros amarillos punteados.

## Cambiar textos

Todos los textos están en `index.html`, ordenados por secciones con comentarios
(`<!-- ============ SERVICIOS ============ -->`, etc.). Editar el texto entre las etiquetas y guardar.

Al cambiar teléfono, email o dirección, hacerlo en **todos** los lugares donde aparecen:

- sección Contacto y pie de página (`index.html`);
- datos estructurados `application/ld+json` en el `<head>` de `index.html`;
- `CONTACT_EMAIL` y `WHATSAPP_NUMBER` en `js/main.js`.

## WhatsApp

Al principio de `js/main.js`:

```js
const WHATSAPP_NUMBER = "5491152637450";   // celular (por defecto)
// const WHATSAPP_NUMBER = "541152637450"; // fijo con WhatsApp Business
const WHATSAPP_MESSAGE = "Hola, quiero información sobre sus servicios de depósito fiscal.";
```

El script actualiza solo todos los botones de WhatsApp. Los enlaces escritos en `index.html`
(`data-wa`) son el respaldo por si JavaScript no carga: si se cambia el número, cambiarlo también ahí.

## Formulario de contacto

1. Crear una cuenta en un servicio de formularios (por ejemplo [Formspree](https://formspree.io)).
2. Copiar la URL de envío que da el servicio (por ejemplo `https://formspree.io/f/abcd1234`).
3. Pegarla en `js/main.js`:

   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/abcd1234";
   ```

Mientras `FORM_ENDPOINT` esté vacío, el formulario valida los campos y muestra un aviso
(«El formulario todavía no está conectado») con el email y WhatsApp como alternativa.

## Logo

El logo actual es **provisional** (icono + texto). Para poner el oficial:

1. Guardar el archivo en `img/logo.svg` (o `img/logo.png` de al menos 400 px de ancho).
2. En `index.html`, dentro de la cabecera y del pie, reemplazar el bloque
   `<span class="brand-mark">…</span><span class="brand-text">…</span>` por:

   ```html
   <img src="img/logo.svg" alt="Fiscales San Martín S.A." width="180" height="44">
   ```

   (En el pie, usar una versión clara del logo, porque el fondo es azul oscuro.)
3. Reemplazar también `img/favicon.svg` por una versión cuadrada del logo.

## Fotos

Usar solo fotos reales del depósito. Recomendado: JPG o WebP, 1600 px de ancho como máximo,
menos de 300 KB cada una (se pueden comprimir en [squoosh.app](https://squoosh.app)).

### Galería (sección Instalaciones)

Guardar las fotos en `img/` (por ejemplo `deposito-1.jpg` … `deposito-6.jpg`) y en `index.html`
reemplazar cada

```html
<div class="photo-placeholder" …>…</div>
```

por

```html
<img src="img/deposito-1.jpg" alt="Vista de la nave principal con mercadería en pallets" loading="lazy" width="800" height="600">
```

El texto `alt` debe describir lo que se ve en la foto.

### Foto de fondo del inicio

Guardar la foto como `img/hero.jpg` y cambiar la etiqueta de la sección de inicio:

```html
<section class="hero has-photo" id="inicio" style="--hero-photo: url('img/hero.jpg')" aria-labelledby="hero-title">
```

Se oscurece automáticamente con el azul de marca para que el texto se lea bien.

## Colores

Al principio de `css/styles.css`, en `:root`. Son los del brief; si la empresa tiene colores
oficiales, cambiar `--navy`, `--blue` y `--accent`.

## Redes sociales

En el pie de página de `index.html`, reemplazar el recuadro `[PENDIENTE: redes sociales oficiales]`
por los enlaces, por ejemplo:

```html
<ul class="footer-list">
  <li><a href="https://www.linkedin.com/company/..." target="_blank" rel="noopener">LinkedIn</a></li>
</ul>
```

## Créditos

Iconos: [Lucide](https://lucide.dev) (licencia ISC), incluidos dentro de `index.html`.
Tipografía: Inter (Google Fonts).
