import { sembrarUsuarioDemo, validarCredenciales } from "../logica/auth.js";
import { iniciarSesion, haySesionActiva } from "../logica/session.js";

sembrarUsuarioDemo();

if (haySesionActiva()) {
  window.location.replace("dashboard.html");
} else {
  document.documentElement.classList.remove("auth-checking");
}

function mostrarAlerta(mensaje, tipo) {
  const contenedor = document.getElementById("login-alert");
  contenedor.innerHTML = "";
  if (!mensaje) return;
  const div = document.createElement("div");
  div.className = "alert " + (tipo === "ok" ? "alert-ok" : "alert-error");
  div.textContent = mensaje;
  contenedor.appendChild(div);
}

const mensajeRegistro = sessionStorage.getItem("nutrix_mensaje_login");
if (mensajeRegistro) {
  mostrarAlerta(mensajeRegistro, "ok");
  sessionStorage.removeItem("nutrix_mensaje_login");
}

document.getElementById("form-login").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  if (!username || !password) {
    mostrarAlerta("Ingresa tu usuario y contraseña.", "error");
    return;
  }

  const resultado = validarCredenciales(username, password);
  if (!resultado.ok) {
    mostrarAlerta(resultado.error, "error");
    return;
  }

  iniciarSesion(resultado.usuario);
  window.location.href = "dashboard.html";
});
