import { getSesion, cerrarSesion } from "../logica/session.js";

const LOGO_SVG = `
  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="var(--accent-soft)"/>
    <path d="M20 30C13 30 9 25.5 9 19c0-4 2-7 4-9 1.3 3 3.3 4.6 5.7 5.4C17.6 12 18.6 9 21 7c1.2 4 3.4 6 5.6 7.6C29.4 16.6 31 19 31 22c0 5-4.5 8-11 8Z" fill="var(--accent)"/>
    <path d="M20 30c0-6 1.5-13 6.6-18.4" stroke="var(--surface)" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;

const ENLACES = [
  { href: "dashboard.html", label: "Inicio" },
  { href: "pacientes.html", label: "Pacientes" },
  { href: "consultas.html", label: "Consultas" },
];

export function pintarNav(paginaActual) {
  const contenedor = document.getElementById("navbar");
  if (!contenedor) return;

  const sesion = getSesion();
  const username = sesion ? sesion.username : "usuario";

  const enlacesHtml = ENLACES.map((enlace) => {
    const activo = enlace.href === paginaActual ? " active" : "";
    return `<a class="${activo.trim()}" href="${enlace.href}">${enlace.label}</a>`;
  }).join("");

  contenedor.innerHTML = `
    <div class="topbar">
      <a class="brand" href="dashboard.html">
        ${LOGO_SVG}
        <span class="wordmark">Nutri<span class="x">AGVR</span></span>
      </a>
      <div class="navlinks">${enlacesHtml}</div>
      <div class="who">
        <span class="pill">${username}</span>
        <button class="btn btn-ghost btn-sm" id="btn-logout">Cerrar sesión</button>
      </div>
    </div>
  `;

  document.getElementById("btn-logout").addEventListener("click", () => {
    cerrarSesion();
    window.location.href = "index.html";
  });
}
