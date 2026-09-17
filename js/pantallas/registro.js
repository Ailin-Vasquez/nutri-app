import { crearUsuario } from "../logica/auth.js";
import { haySesionActiva } from "../logica/session.js";

if (haySesionActiva()) {
  window.location.replace("dashboard.html");
} else {
  document.documentElement.classList.remove("auth-checking");
}

function mostrarAlerta(mensaje, tipo) {
  const contenedor = document.getElementById("register-alert");
  contenedor.innerHTML = "";
  if (!mensaje) return;
  const div = document.createElement("div");
  div.className = "alert " + (tipo === "ok" ? "alert-ok" : "alert-error");
  div.textContent = mensaje;
  contenedor.appendChild(div);
}

document.getElementById("form-registro").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;
  const password2 = document.getElementById("reg-password2").value;

  const resultado = crearUsuario(username, password, password2);
  if (!resultado.ok) {
    mostrarAlerta(resultado.error, "error");
    return;
  }

  sessionStorage.setItem("nutrix_mensaje_login", "Usuario creado. Ahora puedes iniciar sesión.");
  window.location.href = "index.html";
});
