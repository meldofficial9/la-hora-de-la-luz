// Navbar toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Netlify Identity redirect to /panel after login
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", (user) => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/panel/";
        });
      }
    });
  }

  // Dynamic content loader
  const page = document.body.getAttribute("data-page");
  if (!page) return;

  const map = {
    "eventos": { file: "content/eventos.json", containerId: "eventos-list", type: "event" },
    "testimonios": { file: "content/testimonios.json", containerId: "testimonios-list", type: "testimonial" },
    "noticias": { file: "content/noticias.json", containerId: "noticias-list", type: "news" },
    "reflexiones": { file: "content/reflexiones.json", containerId: "reflexiones-list", type: "reflection" },
    "recursos": { file: "content/recursos.json", containerId: "recursos-list", type: "resource" },
    "gocuba-eventos": { file: "content/eventos-gocuba.json", containerId: "gocuba-eventos-list", type: "event" },
    "gocuba-testimonios": { file: "content/testimonios-gocuba.json", containerId: "gocuba-testimonios-list", type: "testimonial" },
    "gocuba-noticias": { file: "content/noticias-gocuba.json", containerId: "gocuba-noticias-list", type: "news" },
    "home": { file: "content/testimonios.json", containerId: "home-testimonios", type: "testimonial", limit: 3 },
    "gocuba": { file: "content/testimonios-gocuba.json", containerId: null, type: null }
  };

  const cfg = map[page];
  if (!cfg || !cfg.file || !cfg.containerId) return;

  const container = document.getElementById(cfg.containerId);
  if (!container) return;

  fetch(cfg.file)
    .then((res) => res.json())
    .then((data) => {
      const items = (data && data.items) || [];
      const slice = typeof cfg.limit === "number" ? items.slice(0, cfg.limit) : items;

      if (!slice.length) {
        container.innerHTML = "<p class='section-intro'>Pronto compartiremos contenido en esta sección.</p>";
        return;
      }

      const fragments = slice.map((item) => {
        if (cfg.type === "event") {
          return renderEvent(item);
        } else if (cfg.type === "testimonial") {
          return renderTestimonial(item);
        } else if (cfg.type === "news") {
          return renderNews(item);
        } else if (cfg.type === "reflection") {
          return renderReflection(item);
        } else if (cfg.type === "resource") {
          return renderResource(item);
        }
        return "";
      });

      container.innerHTML = fragments.join("");
    })
    .catch((err) => {
      console.error("Error cargando contenido dinámico:", err);
      container.innerHTML =
        "<p class='section-intro'>No fue posible cargar el contenido en este momento.</p>";
    });
});

function esc(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Render helpers
function renderEvent(item) {
  const titulo = esc(item.titulo);
  const fecha = esc(item.fecha);
  const lugar = esc(item.lugar);
  const descripcion = esc(item.descripcion);
  const tag = esc(item.tag);

  return `
    <article class="card">
      ${tag ? `<div class="card-tag">${tag}</div>` : ""}
      <div class="card-title">${titulo}</div>
      <div class="card-meta">${fecha}${lugar ? " · " + lugar : ""}</div>
      <p>${descripcion}</p>
    </article>
  `;
}

function renderTestimonial(item) {
  const nombre = esc(item.nombre);
  const lugar = esc(item.lugar);
  const resumen = esc(item.resumen);
  const cuerpo = esc(item.cuerpo || item.testimonio);
  return `
    <article class="story">
      <h3>${nombre || "Testimonio"}</h3>
      ${lugar ? `<p class="card-meta">${lugar}</p>` : ""}
      ${resumen ? `<p><strong>${resumen}</strong></p>` : ""}
      <p>${cuerpo}</p>
    </article>
  `;
}

function renderNews(item) {
  const titulo = esc(item.titulo);
  const fecha = esc(item.fecha);
  const resumen = esc(item.resumen);
  const link = esc(item.link);
  return `
    <article class="card">
      <div class="card-title">${titulo}</div>
      ${fecha ? `<div class="card-meta">${fecha}</div>` : ""}
      <p>${resumen}</p>
      ${link ? `<a href="${link}" class="card-link" target="_blank" rel="noopener noreferrer">Leer más →</a>` : ""}
    </article>
  `;
}

function renderReflection(item) {
  const titulo = esc(item.titulo);
  const fecha = esc(item.fecha);
  const pasaje = esc(item.pasaje);
  const cuerpo = esc(item.cuerpo);
  return `
    <article class="card">
      <div class="card-title">${titulo}</div>
      ${fecha ? `<div class="card-meta">${fecha}</div>` : ""}
      ${pasaje ? `<p><em>${pasaje}</em></p>` : ""}
      <p>${cuerpo}</p>
    </article>
  `;
}

function renderResource(item) {
  const titulo = esc(item.titulo);
  const tipo = esc(item.tipo);
  const descripcion = esc(item.descripcion);
  const link = esc(item.link);
  return `
    <article class="card">
      <div class="card-title">${titulo}</div>
      ${tipo ? `<div class="card-meta">${tipo}</div>` : ""}
      <p>${descripcion}</p>
      ${link ? `<a href="${link}" class="card-link" target="_blank" rel="noopener noreferrer">Ver recurso →</a>` : ""}
    </article>
  `;
}
